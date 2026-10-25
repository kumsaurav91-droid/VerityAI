# 🚢 VerityAI — Deployment Guide (Render)

<div align="center">

> *"Deploy VerityAI as a single unified service — backend + frontend on one URL, 100% free, zero complex setup."*

**One platform, one repository, one service, one URL.**

[Prerequisites](#-prerequisites) • [1. Push to GitHub](#1-push-to-github) • [2. Deploy on Render](#2-deploy-on-render) • [Configuration](#-environment-variables) • [Checklist](#-post-deploy-checklist)

---

</div>

## 📋 Prerequisites

Before deploying, make sure you have:

- ✅ A **GitHub account** with this repository pushed
- ✅ A free **[Gemini API key](https://aistudio.google.com/apikey)**
- ✅ A free **[Render account](https://render.com)**

> 💡 **Why Render alone?**  
> VerityAI's FastAPI backend serves the entire frontend (HTML, CSS, JS, PWA) automatically. You do **NOT** need Vercel, AWS, or separate frontend hosting. One Render service handles everything.

---

## 1. Push to GitHub

If your project is not yet on GitHub, run these commands in your project folder:

```bash
git init
git add .
git commit -m "VerityAI: Single-platform deployment ready"
git branch -M main
git remote add origin https://github.com/kumsaurav91-droid/VerityAI.git
git push -u origin main
```

---

## 2. Deploy on Render

### Step 1 — Create a Web Service
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** (top right) → **Web Service**.
3. Select **Build and deploy from a Git repository** → click **Next**.
4. Choose your `VerityAI` repository.

### Step 2 — Configure Service Settings

Fill in the settings form as follows:

| Setting | Value | Notes |
|---|---|---|
| **Name** | `verityai` *(or your preferred name)* | Will become `verityai.onrender.com` |
| **Region** | Singapore / Frankfurt / Oregon | Pick the region closest to your users |
| **Branch** | `main` | Automatic deployment on git push |
| **Root Directory** | *(leave blank / empty)* | Defaults to root of repo |
| **Runtime** | `Python 3` | |
| **Build Command** | `pip install -r backend/requirements.txt` | Installs all Python dependencies |
| **Start Command** | `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT --proxy-headers --forwarded-allow-ips='*'` | Starts FastAPI server |
| **Instance Type** | `Free` | 100% free |

---

### Step 3 — Add Environment Variables

Scroll down to the **Environment Variables** section and add:

| Key | Value | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | `AIzaSy...` | Your Google Gemini API Key from [AI Studio](https://aistudio.google.com/apikey) |
| `TRUST_PROXY` | `true` | Allows accurate client IP for rate limiting behind Render's proxy |

> ℹ️ *Tip: If you don't have a Gemini API key ready yet, set `DEMO_MODE` = `true` to test all UI features with instant mock responses.*

---

### Step 4 — Click Deploy!

Click **Create Web Service**.  
Render will automatically:
1. Pull your code from GitHub.
2. Install Python packages (`fastapi`, `uvicorn`, `google-genai`, `httpx`, etc.).
3. Start the server and bind to the assigned port.

Within 1–2 minutes, your web application will be live at:

```
https://verityai.onrender.com
```

Whenever you run `git push`, Render automatically rebuilds and redeploys your updates! 🚀

---

## ⚙️ Environment Variables Reference

All optional variables can be customized in Render's **Environment** tab:

| Variable | Default | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | *(none)* | Your Gemini API key (**required** for live AI checks) |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Gemini model name |
| `DEMO_MODE` | `false` | Enable demo mode without needing an API key |
| `TRUST_PROXY` | `false` | Set `true` on Render so client IP is detected properly |
| `MAX_CHARS` | `8000` | Max characters accepted per check |
| `MAX_IMAGE_MB` | `4` | Max screenshot / PDF upload size in MB |
| `RATE_LIMIT_PER_MIN` | `10` | Number of checks allowed per minute per IP |

---

## ⚠️ Free Tier Considerations

| Behavior | Explanation | Solution |
|---|---|---|
| **Cold Starts** | Free services sleep after 15 minutes of inactivity. | The first visitor after inactivity will wait ~10-15 seconds for wake up. Subsequent requests are instant. |
| **Custom Domains** | Supported for free on Render. | You can connect a free custom domain (e.g. `verity.yourdomain.com`) in the **Settings > Custom Domains** tab. |
| **SSL / HTTPS** | Automatic and free. | Managed Let's Encrypt SSL certificate is provided out of the box. |

---

## ✅ Post-Deploy Checklist

- **Home Page**: Open `https://your-service.onrender.com` — verify hero section and animations load.
- **Check Page**: Navigate to `/check` and paste sample text (e.g. a suspicious job offer or course claim).
- **Analyze Flow**: Click "Check" — verify the analysis completes and redirects to `/results/<id>`.
- **Fact-Check Feature**: On the result page, click "Check claims with sources" (this needs a live Gemini key, not demo mode).
- **Dark / Light Mode**: Toggle theme in the top nav and refresh the page to test theme persistence.
- **PWA & Offline**: Open Chrome DevTools > Application > Service Workers to verify `sw.js` is active.
