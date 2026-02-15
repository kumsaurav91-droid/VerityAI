# VerityAI Deployment Guide

## Prerequisites
- A GitHub Account
- Installed Git and Python
- Your Google Gemini API Key

---

## Option 1: Deploy to Render + Vercel (Recommended)

> ### Backend on Render.com

**Render is free and perfect for FastAPI apps**

1. **Prepare Your Repository**
   ```bash
   # Create a Git repository
   git init
   git add .
   git commit -m "Initial commit"
   
   # Push to GitHub (create repo first on github.com)
   git remote add origin https://github.com/kumsaurav91-droid/VerityAI.git
   git push -u origin main
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Connect your GitHub account

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Configure settings:
     - **Name:** verityai-backend
     - **Root Directory:** backend
     - **Environment:** Python 3
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add Environment Variable:
     - **Key:** GEMINI_API_KEY
     - **Value:** your_api_key
   - Click "Create Web Service"

4. **Get Your Backend URL**
   - After deployment, you'll get a URL like: `https://verityai-backend.onrender.com`
   - Copy this URL

> ### Frontend on Vercel

**Vercel is perfect for static sites**

1. **Update Frontend Configuration**
   Edit `script.js` line 2:
   ```javascript
   const API_URL = 'https://verityai-backend.onrender.com'; // Your Render URL
   ```

2. **Deploy to Vercel**
   
   **Method A: Vercel CLI**
   ```bash
   npm i -g vercel
   vercel --prod
   ```
   
   **Method B: Vercel Website**
   - Go to https://vercel.com
   - Click "Import Project"
   - Connect GitHub and select your repo
   - Configure:
     - **Framework Preset:** Other
     - **Root Directory:** ./
   - Click "Deploy"

3. **Done!**
   - Your site will be live at: `https://verityai.vercel.app`
   - Custom domain available

---

## Option 2: Deploy to Railway.app (Full Stack)

> ### Railway can host both frontend and backend

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy Backend**
   - New Project → Deploy from GitHub
   - Select your repository
   - Add service configuration:
     ```json
     {
       "build": {
         "builder": "NIXPACKS"
       },
       "deploy": {
         "startCommand": "cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT"
       }
     }
     ```
   - Add environment variable: `GEMINI_API_KEY`

3. **Deploy Frontend**
   - Add another service for frontend
   - Use static file serving

---

## ✅ Post-Deployment Checklist

- Backend is accessible at your domain
- Frontend can connect to backend
- HTTPS/SSL is enabled
- Environment variables are set
- CORS is configured correctly
- API rate limiting is in place
- Backup strategy is defined

---

## 🔄 How to Update
Both Render and Vercel are set up for Continuous Deployment.

1. Make changes to your code locally.

2. Run:

```bash
git add .
git commit -m "Fixed a bug"
git push origin main
```

3. Wait ~2 minutes. Both platforms will detect the push and re-deploy your site automatically.No need to click "Deploy" manually again.

---

## 🆘 Troubleshooting Common Issues
1. "Network Error" / Nothing happens when clicking button
   - Cause: CORS issue or wrong URL.

   - Fix: Open Browser Console (F12). If you see "CORS Missing Allow Origin", you skipped Part C above. Go back and add the Vercel URL to main.py.

2. "ModuleNotFoundError" on Render
   - Cause: Deployment fails with "Module not found".

   - Fix:
      - Check your requirements.txt.
      - Ensure all libraries (fastapi, uvicorn, google-generativeai, etc.) are listed.
      - Ensure you are not importing a local file that you forgot to upload.

3. "502 Bad Gateway" / "Deploy Failed"
   - Cause: The start command is wrong or the app crashed.

   - Fix: Check Render Logs. If it says AttributeError: module 'main' has no attribute 'app', ensure your file is named main.py and the FastAPI instance is app = FastAPI().