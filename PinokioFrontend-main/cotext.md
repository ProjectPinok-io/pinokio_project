# 📘 Kontekst projektu: **Pinokio FakeCheck – Panel Administracyjny (Frontend)**

## 🎯 Cel projektu
Panel administracyjny służy do zarządzania zgłoszeniami, użytkownikami, analizami oraz konfiguracją aplikacji **Pinokio FakeCheck** – systemu analizującego wiarygodność postów w mediach społecznościowych.  
Projekt ma na celu dostarczenie czytelnego, nowoczesnego i wydajnego interfejsu, umożliwiającego administratorom oraz fact-checkerom kontrolę nad danymi i procesami analitycznymi.

---

## ⚙️ Stack technologiczny
- **Framework:** Angular (v17+)
- **UI Library:** PrimeNG (komponenty UI, tabele, formularze, dialogi, dashboard)
- **Język:** TypeScript
- **Zarządzanie stanem:** RxJS / Signals
- **Routing:** Angular Router (lazy loading per feature)
- **Stylowanie:** SCSS z modularną strukturą
- **HTTP:** Angular HttpClient (komunikacja z API backendowym)
- **i18n:** Angular Internationalization (planowane)
- **Testy:** Jasmine + Karma

---

## 🧩 Struktura projektu (feature-based)
src/
├── app/
│ ├── core/ # Moduły podstawowe, serwisy globalne, guardy, interceptory
│ │ ├── guards/
│ │ ├── interceptors/
│ │ ├── services/
│ │ └── models/
│ │
│ ├── shared/ # Komponenty współdzielone (layouty, tabelki, przyciski, alerty)
│ │ ├── components/
│ │ ├── directives/
│ │ ├── pipes/
│ │ └── utils/
│ │
│ ├── features/ # Moduły funkcjonalne (lazy-loaded)
│ │ ├── dashboard/ # Widok główny z podsumowaniem analiz i statystyk
│ │ ├── users/ # Zarządzanie użytkownikami, rangami (np. “Fact Checker”)
│ │ ├── reports/ # Zgłoszenia postów (podejrzane, potwierdzone, fake news)
│ │ ├── analysis/ # Moduł przeglądu i szczegółów analiz postów
│ │ ├── profiles/ # Analiza i historia profili użytkowników
│ │ ├── comments/ # Analiza komentarzy (język, reakcje, liczba odpowiedzi)
│ │ ├── audit/ # Panel do audytu profili i ręcznego fact-checkingu
│ │ ├── settings/ # Ustawienia aplikacji, konfiguracja wag, API itp.
│ │ └── auth/ # Logowanie, rejestracja, role i autoryzacja
│ │
│ └── app-routing.module.ts # Konfiguracja tras aplikacji
│
├── assets/ # Ikony, style globalne, fonty, zasoby graficzne
├── environments/ # Pliki konfiguracyjne środowisk (dev/prod)
└── main.ts / index.html # Punkty wejścia aplikacji

markdown
Copy code

---

## 🧠 Główne funkcjonalności panelu

### 🔍 Analiza profili
- Data utworzenia konta  
- Stopień uzupełnienia danych profilu  
- Częstotliwość komentowania  
- Typ konta (publiczne/prywatne)  
- Liczba followersów / followingów  
- Stosunek obserwujących do obserwowanych  
- Nadanie wag dla poszczególnych weryfikatorów  

### 💬 Analiza komentarzy
- Poprawność językowa  
- Liczba polubień i odpowiedzi  
- Wskaźniki aktywności  

### 🧾 Analiza postów
- Weryfikacja liczby komentarzy i udostępnień  
- Poprawność językowa (gramatyka, styl, nadużycie CAPS)  
- Długość posta, użycie myślników, słowa kluczowe  
- Porównanie z artykułami zewnętrznymi (zgodność treści)  
- Klasyfikacja: ✅ Zatwierdzony / ⚠️ Niepewny / ❌ Fake News  

### 👥 System społecznościowy
- Użytkownicy mogą oceniać posty i oceny innych użytkowników  
- System rang (np. **Fact Checker**)  
- Historia zgłoszeń użytkownika  

### 🧮 Panel administracyjny
- Wyświetlanie zgłoszonych postów z możliwością filtrowania i sortowania  
- Możliwość komentowania i przypisywania zgłoszeń  
- Widok historii i statusów zgłoszeń  
- Zarządzanie użytkownikami i rolami  
- Konfiguracja wag analizy  

---

## 💼 Modele biznesowe (utrzymanie aplikacji)
- **Reklamy** na stronie (zależne od widoku)
- **Subskrypcje:**
  - Plan darmowy → analiza postów z ostatniego tygodnia  
  - Plan płatny → wybór zakresu czasowego analizy  
- **Usługa audytu:** manualne fact-checkowanie zgłoszonych profili  

---

## 🧠 Integracje i komponenty zewnętrzne
- **Gemini Flash API** – analiza treści i semantyki postów  
- **Scraper** – pobieranie danych z platform społecznościowych  
- **Backend API** – REST/GraphQL (autoryzacja JWT)  
- **CMS + strona klienta** – zarządzanie treściami publicznymi i raportami  

---

## 🎨 UI i UX
- PrimeNG jako główna biblioteka komponentów  
- Własne motywy SCSS oparte na systemie kolorów PrimeNG  
- Layout w stylu **Admin Dashboard** (sidebar + topbar)  
- Responsywność dla desktop/tablet  
- Czytelne wizualizacje danych (PrimeNG Charts)

---

## 🧰 Konwencje i dobre praktyki
- Każdy **feature module** posiada własny routing i serwis danych  
- Komunikacja z API przez dedykowane serwisy (`*.service.ts`)  
- Interfejsy w folderze `/core/models`  
- Komponenty dzielone w `/shared/components`  
- Importy i eksporty modułów w `index.ts`  
- Lazy loading + optymalizacja builda  
- Testy jednostkowe dla logiki i serwisów  

---

## 🚀 Etapy rozwoju
1. Stworzenie podstawowego layoutu i nawigacji (PrimeNG)
2. Implementacja autoryzacji i ról użytkowników
3. Moduł analiz postów i profili
4. Moduł zgłoszeń i dashboard
5. Integracja z backendem i testy
6. Finalne UI/UX, optymalizacja i wdrożenie produkcyjne

---

**Autor (rola):** Frontend Developer  
**Odpowiedzialność:** Struktura projektu Angular, architektura modułowa, integracja z API, implementacja UI PrimeNG oraz obsługa logiki w panelu administracyjnym.




