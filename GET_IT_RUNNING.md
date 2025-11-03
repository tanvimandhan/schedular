# Get It Running on Localhost - Step by Step Guide

## 🎯 Goal: See the app at http://localhost:3000

Follow these steps **IN ORDER**. Don't skip any!

---

## Step 1: Check Prerequisites ✅

Make sure you have these installed:
- ✅ Node.js (v16 or higher) - Check: `node --version`
- ✅ PostgreSQL installed and running
- ✅ npm (comes with Node.js) - Check: `npm --version`

---

## Step 2: Install ALL Dependencies

**Open a terminal in the project root** (`C:\Users\vikas\Desktop\schedular`)

### Install Backend Dependencies
```bash
cd backend
npm install
```

Wait for it to finish. You should see "added X packages"

### Install Frontend Dependencies
```bash
cd ../frontend
npm install --legacy-peer-deps
```

⚠️ **CRITICAL**: Use `--legacy-peer-deps` flag for frontend!

Wait for it to finish. This might take a few minutes.

---

## Step 3: Set Up Database

### 3a. Create PostgreSQL Database

Open PostgreSQL (pgAdmin or psql) and run:
```sql
CREATE DATABASE scheduler_dev;
```

### 3b. Configure Backend Environment

```bash
cd backend
```

**Create `.env` file** (if it doesn't exist):
```bash
# Windows PowerShell
Copy-Item env.example .env

# Or manually create .env file in backend folder
```

**Edit `.env` file** with your database credentials:
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scheduler_dev
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
JWT_SECRET=your-secret-key-here-change-this
```

⚠️ **IMPORTANT**: Replace `your_postgres_password_here` with your actual PostgreSQL password!

### 3c. Run Database Migrations

```bash
npm run db:migrate
```

You should see:
```
Batch 1 run: 1 migrations
Batch 2 run: 1 migrations
```

If you see errors:
- Make sure PostgreSQL is running
- Check your `.env` file has correct credentials
- Make sure database `scheduler_dev` exists

---

## Step 4: Start the Backend

```bash
cd backend
npm run dev
```

**You should see:**
```
🚀 Scheduler API server running on port 3001
📊 Environment: development
🌐 Health check: http://localhost:3001/api/health
```

✅ **If you see this, backend is running!** Keep this terminal open.

❌ **If you see errors**, check:
- Did you install dependencies? (`npm install` in backend folder)
- Is PostgreSQL running?
- Are database credentials correct in `.env`?

---

## Step 5: Start the Frontend (NEW TERMINAL)

**Open a NEW terminal window** (keep backend running in first terminal)

```bash
cd C:\Users\vikas\Desktop\schedular\frontend
npm start
```

**You should see:**
```
Compiled successfully!

You can now view scheduler-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
```

✅ **Browser should open automatically to http://localhost:3000**

❌ **If it doesn't open**, manually go to: http://localhost:3000

---

## Step 6: Test It Works

1. **Check Backend**: Open http://localhost:3001/api/health
   - Should see: `{"success":true,"message":"Scheduler API is running",...}`

2. **Check Frontend**: Open http://localhost:3000
   - Should see the scheduler interface with calendar view

3. **Test Creating a Slot**:
   - Click "New Slot" button
   - Fill in the form
   - Submit
   - Slot should appear in calendar immediately!

---

## 🚨 Common Problems & Solutions

### Problem 1: "Cannot find module" errors
**Solution**: Dependencies not installed
```bash
cd backend && npm install
cd ../frontend && npm install --legacy-peer-deps
```

### Problem 2: "Port 3001 already in use"
**Solution**: Kill process on port 3001
```bash
# Windows PowerShell
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Then try again
cd backend && npm run dev
```

### Problem 3: "Port 3000 already in use"
**Solution**: Kill process on port 3000
```bash
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Then try again
cd frontend && npm start
```

### Problem 4: Database connection error
**Solution**: 
1. Check PostgreSQL is running
2. Verify `.env` file has correct credentials
3. Make sure database `scheduler_dev` exists
4. Check PostgreSQL service is started (Windows Services)

### Problem 5: "react-scripts not found"
**Solution**: Frontend dependencies not installed properly
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

### Problem 6: TypeScript errors in backend
**Solution**: Already fixed! Just restart:
```bash
cd backend
npm run dev
```

---

## 🎯 Quick Start Script (After Initial Setup)

Once everything is set up, you can use this from project root:

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend  
cd frontend
npm start
```

---

## ✅ Success Checklist

Before you can see the app, make sure:

- [ ] Node.js installed (`node --version` works)
- [ ] PostgreSQL installed and running
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd frontend && npm install --legacy-peer-deps`)
- [ ] Database created (`CREATE DATABASE scheduler_dev;`)
- [ ] `.env` file created in `backend/` folder with correct database credentials
- [ ] Migrations run (`cd backend && npm run db:migrate`)
- [ ] Backend running (`cd backend && npm run dev` - see success message)
- [ ] Frontend running (`cd frontend && npm start` - browser opens)

**Once ALL checkboxes are checked, you WILL see it on localhost!**

---

## 🆘 Still Not Working?

Share the **exact error message** you're seeing, and I'll help you fix it!

Common things to check:
1. Copy/paste the full error message
2. Which step are you stuck on?
3. Are both terminals showing the apps running?
