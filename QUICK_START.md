# ⚡ Quick Start - 5 Minutes

## Prerequisites
- PostgreSQL running on localhost:5432
- Node.js v16+
- npm v7+

## Step 1: Install Dependencies (2 min)
```powershell
cd c:\Users\vikas\Desktop\schedular
npm run install:all
```

## Step 2: Setup Database (1 min)
```powershell
# In backend directory
cd backend
npm run db:migrate
```

## Step 3: Start Services (1 min)
```powershell
# Back to root
cd ..

# Start both frontend and backend
npm run dev
```

## Step 4: Open in Browser (1 min)
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/health

---

## 🎯 You're Done!

Start creating slots in the **Dashboard** or **Calendar** page!

For detailed setup guide, see [SETUP.md](./SETUP.md)

## Troubleshooting
- **Port error?** Check if services are already running: `netstat -ano | findstr :3001`
- **Database error?** Make sure PostgreSQL is running: `pg_isready -h localhost`
- **See SETUP.md** for more troubleshooting tips