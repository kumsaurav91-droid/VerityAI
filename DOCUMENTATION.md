# 📘 VerityAI Technical Documentation

## Project Overview
**VerityAI** is a specialized AI-powered tool designed to help students identify and avoid misleading productivity advice and low-quality career content (often called "AI slop"). The system uses Google's Gemini AI to analyze text content and categorize it into three distinct levels.

---

## 🏗️ System Architecture

VerityAI follows a **Client-Server Architecture**:

1.  **Frontend (Client):** A lightweight HTML/JS interface that captures user input and displays results.
2.  **Backend (Server):** A FastAPI (Python) application that acts as the bridge between the user and the AI.
3.  **AI Engine:** Google's Gemini Models (via API) perform the actual text analysis.

### System Design

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Browser   │ ◄─────► │   FastAPI   │ ◄─────► │ Google       │
│  (Frontend) │  HTTP   │  (Backend)  │   API   │ Gemini AI    │
└─────────────┘         └─────────────┘         └──────────────┘
    Client                  Server                 AI Engine
```

### Data Flow
`User Input` ➡️ `Frontend (fetch)` ➡️ `FastAPI (/analyze)` ➡️ `Gemini API` ➡️ `Analysis JSON` ➡️ `Frontend UI`

---

## 🤖 AI Logic & Model Selection

VerityAI uses a **Smart Model Selection Strategy** to ensure reliability and speed.
**Gemini 2.5 Flash** Selected for highest speed and efficiency.

### Prompt Engineering
The AI is prompted to act as a **"Critical Career Consultant."** It is strictly instructed to return data in a specific **JSON format** to ensure the frontend can parse it correctly.

**Key Analysis Metrics:**
* **Truth Score (0-100):** A quantitative measure of advice reliability.
* **Category:** Classified as `Realistic`, `Exaggerated`, or `Misleading`.
* **Red Flags:** Detection of specific toxic phrases (e.g., "Sleep is for the weak").

---

## 🔌 API Reference

The backend exposes the following RESTful endpoints:

### 1. Health Check
* **Endpoint:** `GET /health`
* **Purpose:** To verify if the backend is running and which mode (Production/Demo) is active.
* **Response:**
    ```json
    {
      "status": "online",
      "mode": "production"
    }
    ```

### 2. Analyze Content
* **Endpoint:** `POST /analyze`
* **Purpose:** Sends text to the AI for analysis.
* **Request Body:**
    ```json
    {
      "content": "Text to analyze here..."
    }
    ```
* **Response Body:**
    ```json
    {
      "category": "Misleading",
      "truth_score": 15,
      "explanation": "This advice ignores survivorship bias...",
      "key_findings": ["Finding 1", "Finding 2"],
      "red_flags": ["Guaranteed success", "Toxic productivity"],
      "recommendation": "Focus on skill building instead."
    }
    ```

---

## 💻 Frontend Implementation

The frontend is built with **Vanilla JavaScript** to keep the application lightweight (no heavy frameworks like React or Angular required for this scale).

* **`script.js`**: Handles the `API Call`. It sends the user's text to `http://localhost:8000/analyze`.
* **DOM Manipulation**: Once the data returns, JavaScript dynamically updates the CSS classes (Green/Yellow/Red cards) based on the `category` received from the backend.

---

## 🛡️ Error Handling

The system includes robust error handling:
1.  **API Key Missing:** If `.env` is missing, the system switches to **"Demo Mode"** (returns pre-written responses) instead of crashing.
2.  **Model Failure:** If the primary AI model fails, it attempts to degrade gracefully to older models.
3.  **Invalid JSON:** If the AI returns malformed text, a regex parser attempts to extract valid JSON before throwing an error.

---

## 🔮 Future Roadmap

Potential technical improvements for version 2.0:
* **Rate Limiting:** Implement Redis to prevent API abuse.
* **Database Integration:** Store analysis history using SQLite or PostgreSQL.
* **User Authentication:** Allow users to save their favorite analyses.