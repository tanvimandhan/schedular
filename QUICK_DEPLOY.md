# ⚡ Quick Deployment Checklist

## Prerequisites
- [ ] GitHub account with your code pushed
- [ ] Render.com account
- [ ] Vercel account
- [ ] Neon database credentials

---

## 🚀 DEPLOYMENT IN 5 MINUTES

### Step 1: Backend to Render (3 minutes)
```
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Fill in:
   - Name: scheduler-backend
   - Build: cd backend && npm install && npm run build
   - Start: cd backend && node dist/index.js
5. Add Environment Variables:
   PORT=3001
   NODE_ENV=production
   DATABASE_URL=postgresql://neondb_owner:npg_tyIkFaG26Sfd@ep-lingering-mouse-ahwp8ag2-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=change-me-to-random-secret
   FRONTEND_URL=https://scheduler-frontend-xxxx.vercel.app (update after frontend deploy)
6. Click "Create Web Service"
7. ✅ WAIT for deployment to complete
8. 📋 Copy the backend URL (e.g., https://scheduler-backend-xxxx.onrender.com)
```

### Step 2: Frontend to Vercel (2 minutes)
```
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Set root directory: ./frontend
4. Add Environment Variable:
   VITE_API_URL=https://scheduler-backend-xxxx.onrender.com/api
   (Use the URL from Step 1)
5. Click "Deploy"
6. ✅ WAIT for deployment to complete
7. 📋 Copy the frontend URL (e.g., https://scheduler-frontend-xxxx.vercel.app)
```

### Step 3: Update Backend FRONTEND_URL
```
1. Go back to Render dashboard
2. Open scheduler-backend service
3. Go to "Environment"
4. Update FRONTEND_URL to your Vercel URL
5. Service will auto-redeploy
```

---

## ✅ Verify Everything Works

### Test Backend API
```bash
curl https://scheduler-backend-xxxx.onrender.com/api/health
```
Should return:
```json
{"success":true,"message":"Scheduler API is running","timestamp":"..."}
```

### Test Frontend
Open in browser:
```
https://scheduler-frontend-xxxx.vercel.app
```
Should load the scheduler dashboard.

---

## 🔗 Your Deployment URLs
```
Backend API:  https://scheduler-backend-xxxx.onrender.com
Frontend:     https://scheduler-frontend-xxxx.vercel.app
Dashboard:    https://scheduler-frontend-xxxx.vercel.app/dashboard
```

---

## 🐛 Troubleshooting

### Backend won't start
- Check "Logs" on Render dashboard
- Verify DATABASE_URL is correct
- Run: `npm run build` locally to test

### Frontend can't reach backend
- Check VITE_API_URL environment variable
- Ensure it includes `/api` at the end
- Check browser console for CORS errors

### Database connection fails
- Verify DATABASE_URL in Render environment
- Check Neon database is active (console.neon.tech)
- Try redeploying the service

---

## 📚 Full Documentation
See `DEPLOYMENT.md` for detailed instructions and troubleshooting.
