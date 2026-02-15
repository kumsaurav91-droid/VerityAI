from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
import json
import re
from typing import List
from dotenv import load_dotenv
from pathlib import Path

# 1. Load Environment Variables
try:
    current_dir = Path(__file__).resolve().parent
    env_path = current_dir / ".env"
    load_dotenv(dotenv_path=env_path)
    print(f"📂 Searching for .env at: {env_path}") 
except Exception as e:
    print(f"⚠️ Error loading .env: {e}")

app = FastAPI(title="VerityAI API", version="Final Stable")

# 2. CORS Settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Gemini Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    print("✅ SUCCESS: Gemini API Key found!")
    genai.configure(api_key=GEMINI_API_KEY)
    
    # --- MODEL SELECTION ---
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        print("🚀 Using Model: Gemini 2.5 Flash (High Performance)")
    except Exception as e:
        print(f"⚠️ Model Error: {e}")
        model = None
else:
    print("❌ ERROR: Gemini API Key NOT found!")
    model = None

# 4. Data Models
class AnalysisRequest(BaseModel):
    content: str

class AnalysisResponse(BaseModel):
    category: str
    explanation: str
    key_findings: List[str]
    red_flags: List[str]
    recommendation: str
    truth_score: int 

# 5. Analysis Prompt (UPDATED: SHORT & CONCISE)
ANALYSIS_PROMPT = """
You are VerityAI. Analyze the career advice strictly and concisely.

Output MUST be a valid JSON object:
{{
  "category": "Realistic", "Exaggerated", or "Misleading",
  "truth_score": (Integer 0-100),
  "explanation": "Write a short, sharp summary (max 2-3 sentences). Get straight to the point.",
  "key_findings": [
    "Observation 1 (max 10-12 words)",
    "Observation 2 (max 10-12 words)",
    "Observation 3 (max 10-12 words)",
    "Observation 4 (max 10-12 words)"
  ],
  "red_flags": [
    "Flag 1 (Short phrase)",
    "Flag 2 (Short phrase)",
    "Flag 3 (Short phrase)"
  ] (Return ['None detected'] if safe),
  "recommendation": "One concrete, actionable step (1-2 sentences)."
}}

Content to analyze:
---
{content}
---
"""

# 6. Helper Functions
def extract_json(text: str) -> dict:
    try:
        cleaned = re.sub(r'```json\s*|\s*```', '', text)
        match = re.search(r'\{.*\}', cleaned, re.DOTALL)
        if match:
            return json.loads(match.group())
        return json.loads(cleaned)
    except Exception as e:
        print(f"JSON Parse Error: {e}")
        return None

# --- SMART DEMO ANALYSIS (Keeping this safe just in case) ---
def demo_analysis(content: str) -> dict:
    content_lower = content.lower()
    
    if any(word in content_lower for word in ["millionaire", "crypto", "guaranteed", "10k/month", "waste your life"]):
        return {
            "category": "Misleading",
            "truth_score": 15,
            "explanation": "This content promotes unrealistic 'Get Rich Quick' schemes and uses fear tactics.",
            "key_findings": [
                "Promotes extreme financial results quickly.",
                "Uses fear-mongering language.",
                "Encourages risky behavior."
            ],
            "red_flags": ["Guaranteed success", "Toxic urgency", "Unverified claims"],
            "recommendation": "Avoid this. Success takes time and cannot be guaranteed."
        }
    
    elif any(word in content_lower for word in ["wake up at", "hustle", "sleep is for", "no breaks", "senior engineer by age"]):
        return {
            "category": "Exaggerated",
            "truth_score": 45,
            "explanation": "This advice promotes 'Hustle Culture' which is often unsustainable and leads to burnout.",
            "key_findings": [
                "Advocates for sleep deprivation.",
                "Ignores work-life balance.",
                "Sets an unrealistic timeline."
            ],
            "red_flags": ["Toxic productivity", "Survivorship bias", "Health risk"],
            "recommendation": "Take the good parts but ignore the extreme schedule."
        }

    else:
        return {
            "category": "Realistic",
            "truth_score": 85,
            "explanation": "The advice provided seems grounded in reality and focuses on steady growth.",
            "key_findings": [
                "Advocates for steady progress.",
                "Avoids absolutes.",
                "Acknowledges effort."
            ],
            "red_flags": ["None detected"],
            "recommendation": "This looks like solid advice. Focus on consistency."
        }

# 7. API Endpoints

@app.get("/health")
async def health_check():
    return {"status": "online", "model": "Gemini 2.5 Flash"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_content(request: AnalysisRequest):
    if not request.content or len(request.content.strip()) < 10:
        raise HTTPException(status_code=400, detail="Content too short")

    if model:
        try:
            response = model.generate_content(
                ANALYSIS_PROMPT.format(content=request.content),
                generation_config=genai.types.GenerationConfig(temperature=0.3)
            )
            
            if response.text:
                result = extract_json(response.text)
                if result:
                    return result
            
        except Exception as e:
            print(f"⚠️ API Error: {e}")
            if "404" in str(e):
                 print("❌ ERROR: Model 'gemini-2.5-flash' not found.")
            if "429" in str(e):
                print("❌ ERROR: API Quota Exceeded.")

    return demo_analysis(request.content)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)