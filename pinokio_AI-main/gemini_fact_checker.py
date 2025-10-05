import os
import json
from pathlib import Path
from typing import List, Literal
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()


class FactCheckInput(BaseModel):
    post_content: str = Field(..., description="The full text content from X.com post")


class RedFlag(BaseModel):
    category: str = Field(..., description="Kategoria czerwonej flagi (np. 'Analiza profilu', 'Treść postu', 'Jakość językowa')")
    indicator: str = Field(..., description="Konkretny zidentyfikowany wskaźnik")
    severity: Literal["low", "medium", "high"] = Field(..., description="Waga czerwonej flagi")
    details: str = Field(..., description="Szczegółowe wyjaśnienie dlaczego to jest czerwona flaga")


class FactCheckOutput(BaseModel):
    misinformation_probability: int = Field(
        ..., ge=0, le=100, description="Prawdopodobieństwo (0-100%) że post zawiera dezinformację"
    )
    red_flags: List[RedFlag] = Field(
        ..., description="Lista zidentyfikowanych czerwonych flag"
    )
    analysis: str = Field(
        ..., description="Podsumowanie analizy bez wydawania ostatecznych werdyktów"
    )
    evidence_sources: List[str] = Field(
        ..., description="Zewnętrzne źródła użyte do weryfikacji twierdzeń"
    )


class GeminiFactChecker:

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("API key must be provided or set in GEMINI_API_KEY environment variable")

        self.client = genai.Client(api_key=self.api_key)
        self.base_dir = Path(__file__).parent
        self._load_config()

    def _load_config(self):
        with open(self.base_dir / "prompts" / "fact_check_system.json", "r") as f:
            self.system_config = json.load(f)

        with open(self.base_dir / "prompts" / "fact_check_template.json", "r") as f:
            self.prompt_template = json.load(f)

        with open(self.base_dir / "schemas" / "gemini_request.json", "r") as f:
            self.request_schema = json.load(f)

    def _build_prompt(self, post_content: str) -> str:
        try:
            # Extract system instruction
            sys_instr = self.system_config.get("system_instruction", {})
            task = sys_instr.get("task", "")
            description = sys_instr.get("description", "")
            critical_note = sys_instr.get("critical_note", "")

            # Build analysis steps
            steps_text = []
            analysis_steps_list = self.system_config.get("analysis_steps", [])
            for step in analysis_steps_list:
                step_name = step.get("name", "")
                step_desc = step.get("description", "")

                # Check if criteria exists
                if "criteria" in step:
                    criteria = "\n".join(f"  - {c}" for c in step["criteria"])
                    steps_text.append(f"{step.get('step', '')}. {step_name}:\n{step_desc}\nKryteria:\n{criteria}")
                else:
                    steps_text.append(f"{step.get('step', '')}. {step_name}:\n{step_desc}")

            analysis_steps = "\n\n".join(steps_text)

            # Build output requirements
            output_req = self.system_config.get("output_requirements", {})
            red_flags_info = output_req.get('red_flags', {})
            misinf_info = output_req.get('misinformation_probability', {})
            analysis_info = output_req.get('analysis', {})
            evidence_info = output_req.get('evidence_sources', {})

            output_text = f"""Format odpowiedzi:
- red_flags: {red_flags_info.get('description', '')} ({red_flags_info.get('format', '')})
- misinformation_probability: {misinf_info.get('description', '')} ({misinf_info.get('calculation', '')})
- analysis: {analysis_info.get('description', '')} (Ton: {analysis_info.get('tone', '')})
- evidence_sources: {evidence_info.get('description', '')} (Format: {evidence_info.get('format', '')})"""

            # Important notes
            notes = "\n".join(f"- {note}" for note in self.system_config.get("important_notes", []))

            # User prompt - escape curly braces that aren't placeholders
            user_prompt_template = self.prompt_template.get("user_prompt_template", "")
            # Replace all {...} except {post_content} with {{...}}
            import re
            # Temporarily replace {post_content} with a placeholder
            temp_template = user_prompt_template.replace("{post_content}", "<<<POST_CONTENT>>>")
            # Escape remaining braces
            temp_template = temp_template.replace("{", "{{").replace("}", "}}")
            # Restore the placeholder
            temp_template = temp_template.replace("<<<POST_CONTENT>>>", "{post_content}")

            user_prompt = temp_template.format(post_content=post_content)

            full_prompt = f"""ZADANIE: {task}

{description}

KRYTYCZNA UWAGA: {critical_note}

KROKI ANALIZY:
{analysis_steps}

{output_text}

WAŻNE UWAGI:
{notes}

---

{user_prompt}
"""
            return full_prompt
        except Exception as e:
            raise ValueError(f"Błąd budowania promptu: {str(e)}")

    def check_post(self, post_content: str) -> FactCheckOutput:
        prompt = self._build_prompt(post_content)

        prompt += "\n\nMUSISZ odpowiedzieć poprawnym JSON-em w dokładnie tym formacie:\n"
        prompt += json.dumps(self.request_schema["config"]["response_schema"], indent=2, ensure_ascii=False)

        try:
            response = self.client.models.generate_content(
                model=self.request_schema["model"],
                contents=prompt,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())]
                )
            )

            result_text = response.text.strip()
            print(f"=== RAW GEMINI RESPONSE ===")
            print(result_text[:1000])
            print(f"=== END RAW RESPONSE ===")

            if not result_text:
                raise ValueError("Pusta odpowiedź z Gemini API")

            # Remove markdown code blocks if present
            if result_text.startswith("```"):
                lines = result_text.split("\n")
                result_text = "\n".join(lines[1:-1]) if len(lines) > 2 else result_text
                if result_text.startswith("json"):
                    result_text = result_text[4:].strip()

            # Find JSON object boundaries
            json_start = result_text.find("{")
            json_end = result_text.rfind("}") + 1

            if json_start != -1 and json_end > json_start:
                result_text = result_text[json_start:json_end]
            else:
                raise ValueError(f"Nie znaleziono poprawnego obiektu JSON w odpowiedzi: {result_text[:300]}")

            print(f"=== EXTRACTED JSON ===")
            print(result_text[:1000])
            print(f"=== END EXTRACTED JSON ===")

            # Parse JSON
            result_dict = json.loads(result_text)

            # Process evidence_sources if they come as dict objects
            if "evidence_sources" in result_dict and isinstance(result_dict["evidence_sources"], list):
                evidence_list = []
                for item in result_dict["evidence_sources"]:
                    if isinstance(item, dict):
                        source = item.get("source", "Nieznane źródło")
                        finding = item.get("finding", item.get("content", "Brak szczegółów"))
                        evidence_list.append(f"[{source}] - {finding}")
                    else:
                        evidence_list.append(str(item))
                result_dict["evidence_sources"] = evidence_list

            # Process red_flags if needed
            if "red_flags" in result_dict and isinstance(result_dict["red_flags"], list):
                red_flags_list = []
                for flag in result_dict["red_flags"]:
                    if isinstance(flag, dict):
                        red_flags_list.append(RedFlag(**flag))
                result_dict["red_flags"] = red_flags_list

            return FactCheckOutput(**result_dict)

        except json.JSONDecodeError as e:
            raise ValueError(f"Błąd parsowania JSON: {str(e)}. Odpowiedź: {result_text[:500]}")
        except Exception as e:
            raise ValueError(f"Błąd przetwarzania odpowiedzi Gemini: {str(e)}")

    def check_post_dict(self, input_data: dict) -> dict:
        validated_input = FactCheckInput(**input_data)
        result = self.check_post(validated_input.post_content)
        return result.model_dump()
