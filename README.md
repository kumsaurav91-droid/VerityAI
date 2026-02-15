# 🛡️ VerityAI - Fake Productivity & Career Advice Detector

> **"Don't let toxic productivity fool you."**

**VerityAI** is an AI-powered tool designed for students to detect misleading productivity advice and "AI Slop" career content. It categorizes content into three levels: **Realistic**, **Exaggerated**, and **Misleading** using Google's latest Gemini models. It provides a "Truth Score" and highlights red flags in real-time.

---
## 🎯 Project Purpose

In the age of endless scrolling, students and early-career professionals are bombarded with conflicting advice. Social media algorithms often prioritize **"Toxic Productivity"** and **"Get-Rich-Quick Scams"** over realistic, actionable guidance. This noise creates anxiety, burnout, and unrealistic expectations.

**VerityAI was built to cut through this noise.**

It serves as a rational, AI-powered filter that analyzes career advice for:
* **Validity:** Does this advice actually work for the average person?
* **Toxicity:** Does it promote harmful habits like burnout or isolation?
* **Hidden Agendas:** Is the creator just trying to sell a course?

Our goal is to protect users from scams and burnout by providing an objective **"Truth Score"** and highlighting the missing context behind viral success stories.

---

## 🌟 Key Features

* **🧠 Smart AI Analysis:** Uses Google Gemini to analyze content.
* **💯 Truth Score System:** Assigns a reliability score (0-100%) to any piece of advice.
* **🚩 Red Flag Detection:** specifically highlights phrases like "Guaranteed Success," "Sleep is for the weak," etc.
* **🎨 Visual Feedback:** Color-coded results (Green = Safe, Yellow = Exaggerated, Red = Misleading).
* **⚡ Fast & Lightweight:** Built with **FastAPI** (Backend) and **Vanilla JS** (Frontend) for instant performance.

---

## 🛠️ Tech Stack

* **Backend:** 
    - Python 3.9+
    - FastAPI - Modern, fast web framework
    - Uvicorn - ASGI server

* **Frontend:** 
    - HTML5, CSS3, JavaScript (Fetch API)
    - Modern, responsive design

* **AI Engine:** 
    - Google Gemini API - AI analysis engine (`google-generativeai`)

---

## 💻 Optimal Viewing Experience
> [!IMPORTANT]
> **For the best user experience, it is highly recommended to view the live website in Desktop Mode.** The dashboard's glassmorphism effects and real-time risk charts are optimized for larger screens to provide full clarity of the diagnostic data

---

## 🚀 Live Project Access
* **Live Demo:** 🚧 Coming Soon (Stay Tuned!)
* **Resources:** [**VerityAI Resources**](https://drive.google.com/drive/folders/1Wmsv2MkkrWLdjHzUnldyK_g84WZ0-yat?usp=drive_link)
 

---

## ⚙️ Installation & Setup

Follow these steps to run VerityAI locally on your machine.

> ### 📋 Prerequisites
* Python 3.9 or higher installed.
* Google Gemini API Key (free tier available).

## Step 1: Clone the Repository
```bash
git clone [https://github.com/kumsaurav91-droid/VerityAI.git](https://github.com/kumsaurav91-droid/VerityAI.git)
cd VerityAI
```
## Step 2: Backend Setup

1. **Navigate to the backend directory:**
```bash
cd backend
```
2. **Create a virtual environment (Optional but recommended)**
```bash
python -m venv venv

# Activate venv
venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Get your Google Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Click "Create API Key"
   - Copy your API key

5. **Configure environment variables:**
```bash
# Create a .env file inside the backend/ folder and add your key:
# Add your API key:
GEMINI_API_KEY=your_actual_api_key_here
```

6. **Start the backend server:**
```bash
python main.py
```

You should see: 🚀 Using Model: Gemini 2.5 Flash (or similar) on `http://0.0.0.0:8000`

## Step 3: Set Up the Frontend

1. **Open a new terminal window** (keep the backend running)

2. **Navigate to the project root:**
```bash
cd verityai
```

3. **Serve the frontend:**

**Option A: Using Python's built-in server (easiest)**
```bash
# Python 3
python -m http.server 3000
```

**Option B: Using VS Code Live Server**
- Install "Live Server" extension in VS Code
- Right-click `index.html` and select "Open with Live Server"

4. **Open your browser:**
   - Go to `http://localhost:3000`
   - You should see the VerityAI homepage!



## 📁 Project Structure

```
VerityAI/
├── backend/
│   ├── main.py                 # FastAPI app & AI Logic
│   ├── .env                    # API Keys (Keep this private!)
│   ├── requirements.txt        # Python dependencies
│   └── test_api.py             # Testing script
├── .gitignore                  # Git ignore rules
├── index.html                  # Frontend UI
├── styles.css                  # Styling
├── script.js                   # Frontend Logic (API Calls)
├── README.md                   # You are here
├── DEPLOYMENT.md               # Guide to host this online
└── DOCUMENTATION.md            # Technical Architecture details
```

## 🧪 Testing the Application

1. Open `http://localhost:3000` in your browser
2. Scroll to the "Analyze Content" section
3. Paste some content (try the examples below)
4. Click "Analyze Content"
5. Review the results!

> ### Example Test Content:

**Realistic:**
```
Building a successful career takes time, dedication, and continuous learning. Start with the basics, build projects, network with professionals, and apply for positions that match your skills. Remember, everyone's journey is different.
```

**Exaggerated:**
```
Wake up at 5 AM every day and follow my exact routine to become a millionaire within a year! Just hustle 18 hours a day and learn 5 programming languages simultaneously!
```

**Misleading:**
```
You're wasting your life if you're not making $10k/month by age 20! Drop out of school, invest everything in crypto, and work 24/7 without breaks. Success is guaranteed!
```

---

## ❓ Frequently Asked Questions (FAQ)

### Q: Why am I seeing "Demo Mode"?
This happens if the backend cannot find your GEMINI_API_KEY. Make sure your .env file is in the backend/ folder and formatted correctly.

### Q: Which AI model is it using?
Check your backend terminal! This project is exclusively powered by the Gemini 3 Flash model.

### Q: Is my content sent anywhere?
Yes, content is sent to:
1. Your backend server (localhost or deployed)
2. Google Gemini API for analysis
3. Nowhere else

### Q: What kind of content can I analyze?
You can analyze:
- Social media posts
- Blog articles
- Career advice columns
- Productivity tips
- Course descriptions
- LinkedIn posts

---

### **Important Step Before Uploading:**
Aapke paas `backend/requirements.txt` file honi chahiye taaki GitHub par koi aur user isse install kar sake.

Agar aapne ye file nahi banayi hai, toh **Backend Terminal** mein yeh command chalayein:

```bash
pip freeze > requirements.txt
# Isse ek nayi file ban jayegi jisme fastapi, uvicorn, google-generativeai sab likha hoga.
```
## 🎯 Feature Enhancements

Potential features for future versions:

### Current (v1.0)
- ✅ Basic analysis
- ✅ Educational resources
- ✅ Responsive design

### Planned (v2.0)
- User accounts
- Analysis history
- Chrome extension
- Advanced analytics
- Community reporting & flagging system

---
## 📞 Contact

**SAURAV KUMAR**

- GitHub: [@kumsaurav91-droid](https://github.com/kumsaurav91-droid)
- Linkedin Profile: [@kumsaurav91](https://www.linkedin.com/in/kumsaurav91)

**⭐ Star this repository if you find it helpful!**

---

### Built for Students, by Students ❤️

Stop falling for fake productivity. Start making informed decisions.

**VerityAI - Your Truth in the Age of AI**


// ssss