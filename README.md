# 🛡️ VerityAI — AI Second Opinion for Students

<div align="center">

> *"Check it before you pay, join or believe it."*

**A free, AI-powered second opinion tool for students evaluating career advice, courses, job offers and online claims — with marked-up evidence, risk scoring and actionable next steps.**

[Features](#-key-features) • [Problem & Solution](#-the-problem-we-solve) • [Quick Start](#-quick-start) • [Tech Stack](#️-tech-stack) • [API Reference](#-api-reference) • [Deploy](#-deployment)

---

<img src="https://cdn.corenexis.com/f/3NfM9sbtcKh.png" alt="VerityAI Preview" width="100%"/>

</div>

---

## 🌐 About the Project

**VerityAI** is a free, AI-powered tool that reads career advice, course pitches and job offers the way a sceptical expert would — marking up the risky phrases, explaining each warning sign, and telling you what to do next.

- **Three smart checkers** for advice, courses and job offers — each with its own rules and verdict labels.
- **Any input format** — paste text, add a link, upload a screenshot, PDF, or a YouTube video.
- **Evidence, not just a score** — risky phrases are highlighted in your own text with a reason and severity.
- **Works in Hindi and Hinglish** — not just English content.
- **Installable as a PWA** — share messages directly from WhatsApp on Android.

---

## 💡 The Problem We Solve

| The Problem | VerityAI's Solution |
|---|---|
| "100% placement guarantee" and "50 LPA average" everywhere | **AI Claim Checker** marks each exaggerated phrase with a reason |
| Can't tell a fake job offer from a real one | **Job Offer Verifier** flags fee requests, free email domains and missing interviews |
| Paid a course fee, now ignoring phone calls | **Course Checker** scores placement promises, refund terms and fake urgency |
| No idea which claims can actually be verified | **Claim Fact-Check** uses Google Search grounding and lists every source |
| Already been scammed — don't know what to do | **Scam safeguards** link directly to the cyber crime helpline (1930) |

---

## 🎯 Target Audience

- **Students & Job Seekers** — Verify a course pitch or recruiter message before you pay or reply.
- **First-time Job Hunters** — Spot fake job offers and placement-guarantee scams.
- **College Students** — Check coaching-centre ads and internship offers.
- **Developers & Educators** — Self-host and run in demo mode with zero API cost.

---

## ✨ Key Features

- **🔍 AI Claim Checker** — Paste advice, a post or a link and see which claims look exaggerated, with the exact phrases marked.
- **🛡️ Evidence-Based Verification** — Checks specific claims against web sources and shows which could not be verified.
- **📸 Screenshot, PDF and Video Input** — Upload a screenshot or PDF, or paste a YouTube link, and check what it says.
- **💼 Job Offer Verifier** — Spots fee requests, free email addresses, missing interviews and other fake-offer signs.
- **🎓 Course Verifier** — Tests placement promises, refund terms, fake urgency and income claims before you pay.
- **📊 Risk Profile** — Hype, burnout risk, hidden selling and weak evidence are scored separately on a radar chart.
- **📋 Actionable Next Steps** — Questions to ask, a tick-off checklist and an honest rewrite of what a fair offer would say.
- **🧠 Spot the Scam Quiz** — Eight real-looking messages to practise on, with explanations after each answer.
- **🕐 Browser History** — Every result is saved locally in your browser. Search, filter and revisit at any time.
- **🌙 Dark / Light Theme** — Instant toggle, saved across sessions.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Backend** | Python 3.10+, FastAPI, Pydantic | REST API, AI calls, URL fetching, domain checks |
| **AI** | Google Gemini (`google-genai` SDK) | Structured JSON output, Google Search grounding, PDF & video input |
| **Frontend** | Plain HTML5, CSS3, JavaScript | Multi-page site with no build step |
| **Tests & CI** | pytest, ruff, GitHub Actions | Lint and test on every push |
| **Deployment** | Render (Free Web Service) | Unified backend + static frontend on a single URL |

---

## 📁 Project Structure

```text
VerityAI/
├── 📂 backend/
│   ├── main.py                 # API, Gemini calls, URL fetching, domain checks
│   ├── requirements.txt
│   ├── requirements-dev.txt    # Adds pytest and ruff
│   ├── .env.example            # Copy to .env and add your Gemini key
│   └── 📂 tests/               # pytest suite (no network or API key needed)
│
├── 📂 frontend/
│   ├── 📂 pages/               # One HTML file per page (static, no build step)
│   ├── 📂 scripts/             # One JS file per page plus shared scripts
│   │   ├── common.js           # Shared helpers, check types, history storage
│   │   ├── layout.js           # Shared header and footer
│   │   ├── theme.js            # Runs first — prevents wrong-theme flash
│   │   ├── features.js         # Feature list for landing, Features and Planned pages
│   │   └── check.js · results.js · history.js · practice.js · faq.js
|   |
│   ├── 📂 assets/              # Icons and PWA manifest
│   ├── styles.css              # Shared design system (includes Google Fonts import)
│   └── sw.js                   # Service worker — must stay at root for PWA scope
│
├── 📂 .github/workflows/       # ci.yml — lint and tests on every push
├── DEPLOYMENT.md
├── LICENSE
└── README.md
```

---

## 🚀 Quick Start

You need **Python 3.10+** and a free [Gemini API key](https://aistudio.google.com/apikey).

### 1. Clone the Repository

```bash
git clone https://github.com/kumsaurav91-droid/VerityAI.git
cd VerityAI
```

---

### 2. Set Up and Run the Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
copy .env.example .env         # macOS/Linux: cp .env.example .env
python main.py
```

Open **`http://localhost:8000`** — the backend serves the frontend too, nothing else to start.

---

### 3. No API Key? Use Demo Mode

Set `DEMO_MODE=true` in `.env` to try the full interface with clearly labelled keyword responses — no Gemini key needed.

---

### 4. Run the Tests

```bash
cd backend
venv\Scripts\activate
pip install -r requirements-dev.txt
pytest tests -q
```

Tests need no API key or internet connection.

---

## ⚙️ Configuration

All settings live in `backend/.env`.

| Variable | Default | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | none | Your Gemini API key |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Model used for analysis and fact-checks |
| `DEMO_MODE` | `false` | Keyword-only demo when there is no key |
| `MAX_CHARS` | `8000` | Longest text accepted |
| `MAX_IMAGE_MB` | `4` | Largest screenshot or PDF accepted |
| `RATE_LIMIT_PER_MIN` | `10` | Requests per minute per visitor |
| `TRUST_PROXY` | `false` | Set `true` behind a proxy (Render / Nginx) |
| `FRONTEND_URL` | none | Allowed CORS origin when frontend is hosted separately |

---

## 📡 API Reference

All write requests require `Content-Type: application/json`. Interactive docs available at `/docs` while the server runs.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | `{status, mode: live/demo/unconfigured, model, max_chars}` |
| `POST` | `/analyze` | Analyse text, URL, image or PDF. Body: `{content/url/image, kind}` |
| `POST` | `/claims` | Fact-check extracted text against web sources. Body: `{text}` |
| `POST` | `/feedback` | Submit result feedback. Body: `{rating, kind, category, score, comment}` |

**`POST /analyze` returns:** `category`, `summary`, `truth_score`, `scores`, `key_findings`, `red_flags`, `questions_to_ask`, `facts`, `checklist`, `domain_checks`, `realistic_rewrite`, `recommendation`, `extracted_text`.

> **Risk score vs Evidence confidence:** The API returns a `truth_score` (higher = safer). The UI shows `100 − truth_score` as the risk score. Evidence confidence is separate — it only appears after you run the claim check.

---

## 🗺️ Roadmap

- 🔔 **WhatsApp & Email alerts** when a check result is high risk
- 🌐 **Public shareable result pages** with a short link
- 🔍 **More input languages** — Tamil, Telugu, Bengali
- 🏫 **Internship & Scholarship checkers** (currently planned, not live)
- 🤖 **Ask AI follow-up** — ask questions about a specific result
- 🧩 **Chrome extension** — check any page without copying text
- 📊 **Community scam reports** (needs moderation and legal review)

---

## 📜 Pages

| Page | URL | What it is |
|---|---|---|
| Home | `/` | Introduction and feature preview |
| Check | `/check` | The main checker — advice, course or job offer |
| Result | `/results/<id>` | Full verdict, evidence, claim check, share and export |
| Features | `/features` | All features, marked Available or Planned |
| How it works | `/how-it-works` | Each step explained with what the AI cannot determine |
| Practice | `/practice` | Spot the Scam — eight-message quiz |
| History | `/history` | All your saved checks, searchable and filterable |
| FAQ | `/faq` | Searchable questions by category |
| About / Privacy / Terms | `/about` `/privacy` `/terms` | Plain-language information pages |

---

## 🚢 Deployment

> See [DEPLOYMENT.md](DEPLOYMENT.md) for full step-by-step instructions.
VerityAI deploys as a **single unified service on Render** — backend and frontend served together from one URL.

---

## 🔒 Privacy & Limits

- Your input is sent to this server and then to Google's Gemini API. Nothing is stored on the server except optional feedback you send.
- History is saved only in your own browser and can be deleted at any time from the History page.
- The AI can be wrong — treat results as a second opinion and check the quoted phrases yourself.
- YouTube analysis works on public videos, first 10 minutes only. Pages needing a login (Instagram, X) cannot be read — paste the text or use a screenshot instead.

---

## 📄 License

Released under the [MIT License](LICENSE).

---

<div align="center">

### **Built with ❤️ by Saurav Kumar**

⭐ **Star this repo if VerityAI helped you spot a scam!** ⭐

</div>

