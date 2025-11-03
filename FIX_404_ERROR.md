# Fix 404 Error - Frontend Not Running

## 🚨 Problem: `GET http://localhost:3000/ net::ERR_HTTP_RESPONSE_CODE_FAILURE 404`

This means the frontend server is **not running** or **not installed properly**.

---

## ✅ Solution: Follow These Steps

### Step 1: Navigate to Frontend Directory
```bash
cd C:\Users\vikas\Desktop\schedular\frontend
```

### Step 2: Install Dependencies (CRITICAL!)
```bash
npm install
```

**If you see peer dependency warnings, use:**
```bash
npm install --legacy-peer-deps
```

**Wait for installation to complete!** You should see "added X packages"

### Step 3: Verify index.html is in Root
Make sure `index.html` is in `frontend/` root (not in `public/`). It's already fixed in the code.

### Step 4: Start the Frontend Server
```bash
npm start
```

**OR**
```bash
npm run dev
```

### Step 5: What You Should See

**✅ SUCCESS:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Browser should automatically open to http://localhost:3000**

---

## 🔍 Troubleshooting

### Issue 1: "Command not found" or "npm: command not recognized"
**Solution**: Node.js not installed or not in PATH
- Download Node.js from https://nodejs.org
- Restart terminal after installation

### Issue 2: "Cannot find module 'vite'"
**Solution**: Dependencies not installed
```bash
cd frontend
npm install
```

### Issue 3: Port 3000 already in use
**Solution**: Kill process using port 3000
```bash
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Then try again
npm start
```

### Issue 4: Still getting 404 after starting
**Check:**
1. Is the server actually running? Look for "VITE ready" message
2. Are you opening the correct URL? Use http://localhost:3000 (not 3001)
3. Try stopping and restarting:
   ```bash
   # Press Ctrl+C to stop
   # Then start again
   npm start
   ```

### Issue 5: "ENOENT: no such file or directory"
**Solution**: You're in the wrong directory
```bash
# Make sure you're here:
cd C:\Users\vikas\Desktop\schedular\frontend

# Verify files exist:
dir package.json
dir index.html
dir src
```

---

## 📋 Complete Checklist

Before you start, make sure:

- [ ] You're in the frontend directory: `cd frontend`
- [ ] Dependencies installed: `npm install` completed successfully
- [ ] `index.html` exists in frontend root
- [ ] `src/main.tsx` exists
- [ ] No error messages in terminal
- [ ] Backend is running on port 3001 (for API calls)

---

## 🎯 Quick Fix Command Sequence

Copy and paste these commands **one at a time**:

```bash
# 1. Go to frontend
cd C:\Users\vikas\Desktop\schedular\frontend

# 2. Install dependencies
npm install

# 3. Start server
npm start
```

---

## 🆘 Still Not Working?

**Check these things:**

1. **What does the terminal show when you run `npm start`?**
   - Copy the full output and share it

2. **Is there a process already using port 3000?**
   ```bash
   netstat -ano | findstr :3000
   ```

3. **Do you see any error messages?**
   - Share the complete error message

4. **Are dependencies installed?**
   ```bash
   cd frontend
   dir node_modules
   ```
   - Should show many folders, not empty

---

## ✅ Expected Working State

When everything works, you should have:

**Terminal 1 (Backend):**
```
🚀 Scheduler API server running on port 3001
```

**Terminal 2 (Frontend):**
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

**Browser:**
- Opens automatically to http://localhost:3000
- Shows the scheduler calendar interface
- No 404 errors
