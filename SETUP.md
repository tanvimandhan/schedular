# 🚀 Scheduler System - Complete Setup Guide

## ✅ Current Status

Your project has an excellent foundation with:
- ✅ Full Express backend with TypeScript
- ✅ React frontend with routing and components
- ✅ PostgreSQL database migrations
- ✅ API services and type safety
- ✅ Tailwind CSS styling
- ✅ Form validation (React Hook Form + Joi)

## 📋 Prerequisites

- **Node.js** v16+ (https://nodejs.org/)
- **PostgreSQL** v12+ (https://www.postgresql.org/download/windows/)
- **npm** v7+
- **Git** (optional)

## 🔧 Step-by-Step Setup

### 1. PostgreSQL Database Setup

PostgreSQL must be running and accessible. Follow these steps:

**Option A: Using PostgreSQL Service (Recommended)**
1. Open Windows Services (services.msc)
2. Find "postgresql-x64-XX" or similar
3. Right-click → Start (if not already running)

**Option B: Command Line**
```powershell
# Start PostgreSQL service
net start postgresql-14  # Replace with your version

# Or if using WSL/PowerShell
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start
```

**Create Database and User:**
```sql
-- Connect as postgres user
psql -U postgres

-- Create database
CREATE DATABASE scheduler_dev;

-- Verify
\l
```

### 2. Install Dependencies

```powershell
# From project root
cd c:\Users\vikas\Desktop\schedular

# Install all dependencies
npm run install:all
```

This will install:
- Root dependencies (concurrently)
- Backend dependencies
- Frontend dependencies

### 3. Environment Configuration

**Backend .env** (Already created at `backend/.env`):
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scheduler_dev
DB_USER=postgres
DB_PASSWORD=postgres
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key-change-in-production
```

**Frontend .env** (Already created at `frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 4. Database Migrations

```powershell
cd c:\Users\vikas\Desktop\schedular\backend

# Run migrations
npm run db:migrate

# Output should show:
# ✓ Ran 2 migrations
# ✓ Table 'slots' created
# ✓ Table 'slot_exceptions' created
```

### 5. Start the Application

**Option A: Run Both Services Together** (Recommended)
```powershell
cd c:\Users\vikas\Desktop\schedular

# Start backend and frontend concurrently
npm run dev
```

**Option B: Run Services Separately**

Terminal 1 - Backend:
```powershell
cd c:\Users\vikas\Desktop\schedular\backend
npm run dev
```

Terminal 2 - Frontend:
```powershell
cd c:\Users\vikas\Desktop\schedular\frontend
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## 📊 Testing the Setup

### 1. Check Backend Health
```powershell
# Test API health endpoint
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Scheduler API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Create Your First Slot

Navigate to **Dashboard** → **New Slot** and:
- Title: "Morning Standup"
- Day: Monday
- Start Time: 09:00
- End Time: 09:30
- Recurring: Yes
- Effective From: Today's date

## 🎯 Key Features to Test

### 1. Weekly Calendar View
- Go to **Calendar** page
- Scroll to load more weeks (infinite scroll)
- See slots displayed by day

### 2. Create, Update & Delete
- **Create**: Calendar → New Slot
- **Update**: Calendar → Edit Icon on slot
- **Delete**: Calendar → Delete Icon on slot

### 3. Slot Management
- **Slots** page shows all slots
- Filter by day, status, search
- Bulk management and status toggle

### 4. Exception Handling
- **Exceptions** page for modifying specific dates
- Create exception to cancel or reschedule a single instance
- View modification reasons

### 5. Dashboard
- Overview of all slots
- Recent exceptions
- Quick stats (Total, Active, Recent)

## 🛠 Build for Production

```powershell
cd c:\Users\vikas\Desktop\schedular

# Build both backend and frontend
npm run build

# Output:
# - backend/dist/ (compiled backend)
# - frontend/build/ (production frontend bundle)
```

### Start Production Build
```powershell
# Backend
cd backend
npm start

# Frontend (requires HTTP server, e.g., 'serve')
npm install -g serve
serve -s frontend/build -l 3000
```

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Database Connection Error
```powershell
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Or check Windows Service
Get-Service postgresql-*
```

### Migration Failed
```powershell
# Rollback last migration
cd backend
npm run db:rollback

# Run again
npm run db:migrate
```

### Dependencies Installation Issues
```powershell
# Clear npm cache
npm cache clean --force

# Remove node_modules
Remove-Item -Recurse -Force node_modules, backend/node_modules, frontend/node_modules

# Reinstall
npm run install:all
```

## 📁 Project Structure

```
scheduler/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── validation/      # Joi schemas
│   │   ├── database/        # DB connection
│   │   ├── types/           # TypeScript types
│   │   └── index.ts         # Entry point
│   ├── migrations/          # DB migrations
│   ├── dist/               # Compiled output
│   ├── .env                # Environment config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utilities
│   │   ├── index.tsx       # Entry point
│   │   └── App.tsx         # Root component
│   ├── public/
│   ├── .env                # Environment config
│   └── package.json
│
├── package.json           # Root package
├── README.md             # Project overview
├── SETUP.md             # This file
└── knexfile.js          # Migrations config
```

## 📚 API Reference

### Slots Endpoints

```
POST   /api/slots                           # Create slot
GET    /api/slots                           # Get all slots
GET    /api/slots/weekly                    # Get weekly schedule
GET    /api/slots/weekly-with-exceptions    # Get with exceptions
GET    /api/slots/day/:dayOfWeek           # Get by day
GET    /api/slots/date-range               # Get by date range
GET    /api/slots/:id                      # Get by ID
PUT    /api/slots/:id                      # Update slot
PUT    /api/slots/:id/exception            # Create exception
DELETE /api/slots/:id                      # Delete slot
```

### Exceptions Endpoints

```
POST   /api/exceptions                     # Create exception
GET    /api/exceptions                     # Get exceptions
GET    /api/exceptions/:id                 # Get by ID
PUT    /api/exceptions/:id                 # Update exception
DELETE /api/exceptions/:id                 # Delete exception
GET    /api/exceptions/effective/:slotId/:date  # Get effective slot
```

## 🚀 Next Steps

1. **Test all CRUD operations** in the UI
2. **Create recurring slots** for your schedule
3. **Add exceptions** for specific dates
4. **Customize styling** in `frontend/tailwind.config.js`
5. **Deploy to production** when ready

## ❓ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 3000/3001 in use | Kill process or change PORT in .env |
| Database connection failed | Ensure PostgreSQL is running |
| Migrations failed | Run `npm run db:rollback` then retry |
| Blank page on frontend | Check browser console for errors |
| API 404 errors | Verify backend is running on correct port |

## 📞 Support Resources

- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com
- **TypeScript Docs**: https://www.typescriptlang.org
- **Tailwind CSS**: https://tailwindcss.com

## ✨ Tips for Success

- ✅ Always run migrations before starting backend
- ✅ Check backend health endpoint when debugging
- ✅ Use browser DevTools Network tab to inspect API calls
- ✅ Backend logs will show SQL queries in development
- ✅ Frontend toast notifications show API errors clearly
- ✅ Keep .env files updated when changing DB credentials

---

**Happy Scheduling! 🎉**

For issues or questions, check the logs and error messages carefully - they usually provide the solution.