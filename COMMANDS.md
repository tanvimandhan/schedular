# Commands Reference Guide

## 🚀 Quick Start (Recommended)

### Run Both Backend and Frontend Together
```bash
npm run dev
```
This runs both servers concurrently on:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000

---

## 📦 First Time Setup

### 1. Install All Dependencies
```bash
npm run install:all
```

Or install separately:
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install --legacy-peer-deps
```

### 2. Set Up Database

**Create PostgreSQL database:**
```sql
CREATE DATABASE scheduler_dev;
```

**Configure environment:**
```bash
cd backend
cp env.example .env
# Edit .env with your database credentials
```

**Run migrations:**
```bash
cd backend
npm run db:migrate
```

---

## 🔧 Running Separately

### Backend Only

**From project root:**
```bash
npm run dev:backend
```

**Or from backend directory:**
```bash
cd backend
npm run dev
```

Backend runs on: **http://localhost:3001**

**Available backend commands:**
- `npm run dev` - Start development server (with nodemon)
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:rollback` - Rollback last migration
- `npm run db:seed` - Run database seeds

### Frontend Only

**From project root:**
```bash
npm run dev:frontend
```

**Or from frontend directory:**
```bash
cd frontend
npm start
# or
npm run dev
```

Frontend runs on: **http://localhost:3000**

**Available frontend commands:**
- `npm start` or `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

---

## 🗄️ Database Commands

```bash
cd backend

# Run migrations
npm run db:migrate

# Rollback last migration
npm run db:rollback

# Run seeds (if any)
npm run db:seed
```

---

## 🏗️ Build Commands

### Build Both
```bash
npm run build
```

### Build Separately
```bash
npm run build:backend
npm run build:frontend
```

---

## 📋 Complete Setup Sequence

```bash
# 1. Install all dependencies
npm run install:all

# 2. Set up backend environment
cd backend
cp env.example .env
# Edit .env file with your database credentials

# 3. Set up database
# Create PostgreSQL database first, then:
npm run db:migrate

# 4. Start both servers
cd ..
npm run dev
```

---

## 🔍 Verify Installation

### Check Backend
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Scheduler API is running",
  "timestamp": "..."
}
```

### Check Frontend
Open browser: http://localhost:3000

---

## ⚠️ Troubleshooting

### Port Already in Use

**Backend (3001):**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

**Frontend (3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues
- Verify PostgreSQL is running
- Check `.env` file has correct credentials
- Ensure database exists

### Frontend Dependencies Issues
```bash
cd frontend
npm install --legacy-peer-deps
```

---

## 📝 Environment Variables

**Backend (.env):**
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scheduler_dev
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key-here
```

---

## 🎯 Common Workflows

### Development Workflow
```bash
# Terminal 1: Start both servers
npm run dev

# Terminal 2: Make changes, servers auto-reload
```

### Testing Backend Only
```bash
cd backend
npm run dev
# Test API at http://localhost:3001/api/health
```

### Testing Frontend Only
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

---

## 🔗 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health
- **API Base**: http://localhost:3001/api

---

## 📚 Additional Resources

- Backend API Documentation: `backend/API_DOCUMENTATION.md`
- Frontend Requirements: `frontend/FRONTEND_REQUIREMENTS.md`
- Backend Implementation: `backend/BACKEND_IMPLEMENTATION.md`

