# 🎨 Scheduler Deployment - Visual Guide

## Architecture Diagram

```
                        INTERNET
                          ▲
                          │
              ┌───────────┼───────────┐
              │           │           │
              ▼           ▼           ▼
         ┌─────────────────────────────────┐
         │   User's Web Browser            │
         │   https://frontend-url.com      │
         └──────────────┬──────────────────┘
                        │
                  HTTP/HTTPS Requests
                        │
         ┌──────────────▼──────────────┐
         │   VERCEL (Frontend)         │
         │   ✅ React + Vite App       │
         │   ✅ CDN + Auto-Deploy      │
         │   ✅ SSL Certificate        │
         └──────────────┬──────────────┘
                        │
              API Calls via HTTPS
              (CORS Enabled)
                        │
         ┌──────────────▼──────────────┐
         │   RENDER (Backend)          │
         │   ✅ Express.js + TypeScript│
         │   ✅ Node.js Server         │
         │   ✅ Auto-Restart           │
         └──────────────┬──────────────┘
                        │
            Database Connections
                        │
         ┌──────────────▼──────────────┐
         │   NEON (Database)           │
         │   ✅ PostgreSQL Cloud       │
         │   ✅ Automatic Backups      │
         │   ✅ Serverless             │
         └─────────────────────────────┘
```

---

## Deployment Flow Timeline

```
HOUR 0: Local Development
┌─────────────────────────────────┐
│ You: Code → Test → Push to Git  │
└──────────┬──────────────────────┘
           │
           ▼
HOUR 0:00 - GitHub Receives Push
┌─────────────────────────────────┐
│ Your code in GitHub repo        │
└──────────┬──────────────────────┘
           │
           ├─────────────────┬──────────────────┐
           │                 │                  │
           ▼                 ▼                  ▼
HOUR 0:05 - Render Deploys   Vercel Deploys   Both Online!
┌─────────────────────────┐ ┌──────────────────┐
│ ✅ Backend Updated      │ │ ✅ Frontend Ready│
│ • Build (1-2 min)       │ │ • Build (1 min)  │
│ • Start (30 sec)        │ │ • Deploy (30 sec)│
│ • Health Check ✅       │ │ • DNS Updated ✅ │
└─────────────────────────┘ └──────────────────┘
           │                       │
           └───────────┬───────────┘
                       ▼
            🎉 DEPLOYMENT COMPLETE!
         New feature live for users!
```

---

## File Structure for Deployment

```
Your GitHub Repo
│
├─ backend/
│  ├─ src/
│  │  ├─ index.ts          (Main server)
│  │  ├─ controllers/      (Route handlers)
│  │  ├─ routes/           (API endpoints)
│  │  ├─ models/           (Database queries)
│  │  └─ middleware/       (Express middleware)
│  ├─ package.json         (Dependencies)
│  ├─ tsconfig.json        (TypeScript config)
│  ├─ .env                 (Local secrets)
│  ├─ .env.example         (Template)
│  ├─ vercel.json          (Deploy config)
│  └─ knexfile.js          (Database migrations)
│
├─ frontend/
│  ├─ src/
│  │  ├─ App.tsx           (Main app)
│  │  ├─ pages/            (Route pages)
│  │  ├─ components/       (React components)
│  │  ├─ services/         (API calls)
│  │  └─ types/            (TypeScript types)
│  ├─ package.json         (Dependencies)
│  ├─ vite.config.ts       (Build config)
│  ├─ tsconfig.json        (TypeScript config)
│  ├─ .env                 (Local secrets)
│  ├─ .env.example         (Template)
│  ├─ vercel.json          (Deploy config)
│  └─ index.html           (Entry point)
│
├─ DEPLOYMENT.md           (Read this first!)
├─ QUICK_DEPLOY.md         (Quick reference)
└─ README.md               (Project info)
```

---

## Step-by-Step Visual Deployment

### 🟦 Step 1: Backend to Render

```
LOGIN                CONNECT              CONFIGURE
  ↓                    ↓                      ↓
┌─────┐            ┌─────────┐           ┌─────────────┐
│Render│ ——→ │GitHub Repo│ ——→ │Build Settings│
│.com  │            │Scheduler│           │Build: npm   │
└─────┘            │          │           │run build    │
                    └─────────┘           └──────┬──────┘
                                                │
                                    ┌───────────┘
                                    ▼
                            ENVIRONMENT SETUP
                            ┌──────────────────┐
                            │DATABASE_URL=...  │
                            │JWT_SECRET=...    │
                            │FRONTEND_URL=...  │
                            └────────┬─────────┘
                                     │
                                     ▼
                            ✅ BACKEND DEPLOYED!
                          https://backend-xxx.onrender.com
                          📋 Copy this URL!
```

### 🟨 Step 2: Frontend to Vercel

```
LOGIN                CONNECT              CONFIGURE
  ↓                    ↓                      ↓
┌──────┐           ┌─────────┐           ┌──────────────┐
│Vercel│ ——→ │GitHub Repo│ ——→ │Environment:   │
│.com  │           │Scheduler│           │VITE_API_URL= │
└──────┘           │(frontend)│          │<backend-url> │
                   └─────────┘           └──────┬───────┘
                                               │
                                    ┌──────────┘
                                    ▼
                          ✅ FRONTEND DEPLOYED!
                         https://frontend-xxx.vercel.app
                         🎉 Check this in browser!
```

### 🟩 Step 3: Connect Backend & Frontend

```
┌────────────────────────────────────────────┐
│ Update Render Backend Environment          │
│                                            │
│  FRONTEND_URL = https://frontend-xxx...   │
│                                            │
│ Render auto-redeploys ✅                   │
└────────────────────────────────────────────┘
```

---

## Deployment Comparison

```
╔════════════════════════════════════════════════════════════╗
║ SERVICE      │ COST   │ EASE   │ SPEED  │ SUPPORT         ║
╠════════════════════════════════════════════════════════════╣
║ Render       │ FREE*  │ ⭐⭐⭐⭐⭐ │ ⭐⭐⭐⭐  │ Good Docs       ║
║ Backend      │        │        │        │                 ║
╠════════════════════════════════════════════════════════════╣
║ Vercel       │ FREE   │ ⭐⭐⭐⭐⭐ │ ⭐⭐⭐⭐⭐│ Excellent Docs  ║
║ Frontend     │        │        │        │                 ║
╠════════════════════════════════════════════════════════════╣
║ Neon         │ FREE*  │ ⭐⭐⭐⭐  │ ⭐⭐⭐  │ Good Docs       ║
║ Database     │        │        │        │                 ║
╚════════════════════════════════════════════════════════════╝

* Free tier limited but sufficient for development/small apps
```

---

## Environment Variables Cheat Sheet

### Backend (Render Dashboard)

| Variable | Example | Where to Get |
|----------|---------|--------------|
| `PORT` | `3001` | Keep as is |
| `NODE_ENV` | `production` | Keep as is |
| `DATABASE_URL` | `postgresql://...` | From Neon Console |
| `JWT_SECRET` | `abc123!@#` | Generate random |
| `FRONTEND_URL` | `https://frontend-xxx.vercel.app` | From Vercel |

### Frontend (Vercel Environment)

| Variable | Example | Where to Get |
|----------|---------|--------------|
| `VITE_API_URL` | `https://backend-xxx.onrender.com/api` | From Render |

---

## Troubleshooting Visual Map

```
┌─ Something Wrong? ─────────────────────────────┐
│                                                 │
├─ Frontend Shows Blank Page                    │
│  └─ Check: Vercel Logs → VITE_API_URL        │
│                                                 │
├─ Can't Load Dashboard                         │
│  └─ Check: Network Tab → API Call Status     │
│          → Backend Logs on Render             │
│                                                 │
├─ 500 Error from API                           │
│  └─ Check: Backend Logs → Database Error     │
│          → Environment Variables             │
│                                                 │
├─ Can't Connect to Database                    │
│  └─ Check: Neon Console → Database Active    │
│          → DATABASE_URL Format                │
│                                                 │
└─ Build Fails                                  │
   └─ Check: Logs on Render/Vercel             │
            → package.json Dependencies         │
            → Build Script Output               │
```

---

## Quick Reference Card

### URLs After Deployment
```
Backend API:   https://scheduler-backend-xxxx.onrender.com
Frontend:      https://scheduler-frontend-xxxx.vercel.app
Health Check:  https://scheduler-backend-xxxx.onrender.com/api/health
```

### Key Files to Remember
```
📄 DEPLOYMENT.md              ← Read first for details
📄 QUICK_DEPLOY.md            ← Quick checklist
📄 backend/.env.example       ← Backend vars template
📄 frontend/.env.example      ← Frontend vars template
```

### Common Commands
```
# Test backend build
cd backend && npm run build

# Test frontend build
cd frontend && npm run build

# Test backend locally
cd backend && npm start

# Test frontend locally
cd frontend && npm run dev
```

---

## Success Criteria ✅

After deployment, verify:

```
✅ Backend Health Check
   curl https://backend-xxx.onrender.com/api/health
   → Status: 200, "Scheduler API is running"

✅ Frontend Loads
   Open https://frontend-xxx.vercel.app in browser
   → Dashboard visible

✅ Can Fetch Data
   Dashboard shows slots and calendar
   → No "Failed to load" errors

✅ Can Create Slots
   Add a new slot through UI
   → Saves successfully

✅ Can View Exceptions
   Check exceptions section
   → Displays without errors

✅ Auto-Deploy Works
   Push a small change to GitHub
   → Deployment starts automatically
   → Live within 2-5 minutes
```

---

## Timeline

```
⏰ START
   │
   ├─ 5 min: Deploy Backend
   │
   ├─ 5 min: Deploy Frontend
   │
   ├─ 2 min: Configure Environment
   │
   └─ 2 min: Verify & Test
   
   Total: ~15 minutes to Live! 🎉
```

---

*For detailed instructions, see DEPLOYMENT.md*
