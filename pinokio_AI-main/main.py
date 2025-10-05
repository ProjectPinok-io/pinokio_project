import random
from enum import Enum
from typing import List

import uvicorn
from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gemini_fact_checker import GeminiFactChecker, FactCheckInput, FactCheckOutput

app = FastAPI(title="X.com Fact Checker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fact_checker = GeminiFactChecker()


class FactCheckRequest(BaseModel):
    post_content: str

class PostStatus(str, Enum):
    VALID = "valid"
    WARNING = "warning"
    UNKNOWN = "unknown"

class GetPostsStatusResponse(BaseModel):
    status: PostStatus
    warnings: List[str]

@app.get("/")
async def root():
    return {"message": "X.com Fact Checker API", "version": "1.0.0"}


@app.post("/fact-check", response_model=FactCheckOutput)
async def fact_check_post(request: FactCheckRequest):
    try:
        result = fact_checker.check_post(request.post_content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fact-check failed: {str(e)}")

@app.get("/api/posts/{post_id}", response_model=GetPostsStatusResponse)
async def get_post_status(post_id: str = Path(..., description="The ID of the post to check")):
    # Use post_id to determine status (1=VALID, 2=WARNING, 3=UNKNOWN)
    if post_id == "1":
        status = PostStatus.VALID
        warnings = []
    elif post_id == "2":
        status = PostStatus.WARNING
        possible_warnings = [
            "Contains potentially misleading information",
            "Claims not fully verified by sources",
            "Missing important context",
            "Outdated information",
            "Misleading statistics",
            "Unverified sources cited"
        ]
        # Select 1-3 random warnings
        warnings = random.sample(possible_warnings, random.randint(1, 3))
    elif post_id == "3":
        status = PostStatus.UNKNOWN
        warnings = []
    else:
        # Default to random behavior for other IDs
        status = random.choice(list(PostStatus))
        warnings = []
        if status == PostStatus.WARNING:
            possible_warnings = [
                "Contains potentially misleading information",
                "Claims not fully verified by sources",
                "Missing important context",
                "Outdated information",
                "Misleading statistics",
                "Unverified sources cited"
            ]
            warnings = random.sample(possible_warnings, random.randint(1, 3))

    return GetPostsStatusResponse(status=status, warnings=warnings)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)