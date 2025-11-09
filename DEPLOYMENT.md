# Scheduler App - Deployment Guide

## Overview
- **Frontend**: Vercel
- **Backend**: Render.com
- **Database**: Neon PostgreSQL (already configured)

---

## STEP 1: Deploy Backend to Render.com

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up and link your GitHub account
3. Click "New +" → "Web Service"

### 1.2 Configure Backend Service
1. **Connect GitHub Repository**
   - Select your GitHub repo with this project
   - Choose branch: `main` (or your main branch)

2. **Fill in Service Details**
   - **Name**: `scheduler-backend`
   - **Environment**: `Node`
   - **Region**: `Oregon` (or closest to you)
   - **Branch**: `main`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && node dist/index.js`
   - **Plan**: Free (for testing)

3. **Add Environment Variables**
   Click "Add Environment Variables":
   ```
   PORT=3001
   NODE_ENV=production
   DATABASE_URL=postgresql://neondb_owner:npg_tyIkFaG26Sfd@ep-lingering-mouse-ahwp8ag2-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=your-strong-secret-key-here
   FRONTEND_URL=https://scheduler-frontend.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (~5 minutes)
   - You'll get a URL like: `https://scheduler-backend-xxxx.onrender.com`

### 1.3 Save Backend URL
After deployment succeeds, note your backend URL:
```
https://scheduler-backend-xxxx.onrender.com
```

---

## STEP 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New..." → "Project"

### 2.2 Configure Frontend Project
1. **Import Git Repository**
   - Select your GitHub repo
   - Choose `frontend` as root directory

2. **Configure Build Settings**
   - **Framework**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables**
   Click "Environment Variables":
   ```
   VITE_API_URL=https://scheduler-backend-xxxx.onrender.com/api
   ```
   (Replace with your actual backend URL)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2 minutes)
   - You'll get a URL like: `https://scheduler-frontend-xxxx.vercel.app`

### 2.3 Update Backend FRONTEND_URL
After frontend deployment:
1. Go to Render dashboard
2. Open your `scheduler-backend` service
3. Go to "Environment"
4. Update `FRONTEND_URL` to your Vercel URL
5. It will auto-redeploy

---

## STEP 3: Verify Deployment

### Test Backend Health
```
curl https://scheduler-backend-xxxx.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Scheduler API is running",
  "timestamp": "2024-11-09T10:00:00.000Z"
}
```

### Test Frontend
Visit your Vercel URL in browser:
```
https://scheduler-frontend-xxxx.vercel.app
```

You should see the scheduler dashboard loading without errors.

---

## STEP 4: Database Migrations (If Needed)

If you need to run migrations on the Neon database:

### Option A: Using Render Shell
1. Go to Render dashboard → Backend service
2. Click "Shell"
3. Run migrations:
```bash
cd backend
npx knex migrate:latest
```

### Option B: Local Migration with Production DB
```bash
cd backend
# Update DATABASE_URL in .env temporarily to production
npx knex migrate:latest
# Restore local DATABASE_URL
```

---

## STEP 5: Update Your Local .env Files

### Frontend `.env`
```
VITE_API_URL=https://scheduler-backend-xxxx.onrender.com/api
```

### Backend `.env`
```
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://...
FRONTEND_URL=https://scheduler-frontend-xxxx.vercel.app
JWT_SECRET=your-secret-key
```

---

## Troubleshooting

### Backend Not Starting
```bash
# Check logs on Render
- Go to Render dashboard
- Click your service
- Scroll to "Logs"
```

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` environment variable
- Check CORS settings in backend
- Ensure backend is running

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Neon database is active
- Try restarting the backend service

---

## Production Checklist
- ✅ Backend deployed to Render
- ✅ Frontend deployed to Vercel
- ✅ Environment variables configured
- ✅ Database migrations run
- ✅ CORS properly configured
- ✅ Health check passing
- ✅ Frontend can reach backend

---

## Useful Links
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- Neon Console: https://console.neon.tech
