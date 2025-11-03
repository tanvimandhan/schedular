# Scheduler System

A comprehensive scheduler system with recurring weekly slots and exception handling. Built with React + TypeScript + Tailwind CSS frontend and Node.js + TypeScript + PostgreSQL backend.

## Features

- **Recurring Weekly Slots**: Create and manage slots that repeat weekly
- **Weekly Calendar View**: Interactive calendar with infinite scroll for upcoming weeks
- **Exception Handling**: Modify or cancel specific instances of recurring slots
- **2-Slot Per Day Limit**: Enforced constraint with visual indicators
- **Optimistic Updates**: Immediate UI feedback for better user experience
- **Slot Management**: Full CRUD operations for slots
- **Time Conflict Detection**: Prevents overlapping slots on the same day
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Type Safety**: Full TypeScript support across frontend and backend

## Architecture

### Backend (Node.js + TypeScript + PostgreSQL)
- RESTful API with Express.js
- PostgreSQL database with Knex.js ORM
- Joi validation for request validation
- Comprehensive error handling
- Database migrations for schema management

### Frontend (React + TypeScript + Tailwind CSS)
- Modern React with hooks and functional components
- TypeScript for type safety
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form for form handling
- Axios for API communication

## Database Schema

### Slots Table
- `id`: UUID primary key
- `title`: Slot title
- `description`: Optional description
- `day_of_week`: 0-6 (Sunday-Saturday)
- `start_time`: Time format (HH:MM)
- `end_time`: Time format (HH:MM)
- `is_recurring`: Boolean flag
- `effective_from`: Start date
- `effective_until`: End date (optional)
- `is_active`: Active status

### Slot Exceptions Table
- `id`: UUID primary key
- `slot_id`: Foreign key to slots
- `exception_date`: Specific date for exception
- `start_time`: Modified start time (optional)
- `end_time`: Modified end time (optional)
- `is_cancelled`: Cancellation flag
- `reason`: Exception reason (optional)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scheduler-system
   ```

2. **Run the setup script**
   ```bash
   node setup.js
   ```

   Or manually install dependencies:
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   cd backend
   npm run db:migrate
   ```

5. **Start the development servers**
   ```bash
   # From root directory
   npm run dev
   ```

This will start both the backend API (port 3001) and frontend (port 3000) concurrently.

### Manual Setup

If you prefer to run the services separately:

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Slots
- `GET /api/slots` - Get all slots
- `GET /api/slots/weekly` - Get weekly schedule
- `GET /api/slots/weekly-with-exceptions` - Get weekly slots with exceptions
- `GET /api/slots/day/:dayOfWeek` - Get slots for specific day
- `GET /api/slots/:id` - Get slot by ID
- `POST /api/slots` - Create new slot
- `PUT /api/slots/:id` - Update slot
- `PUT /api/slots/:id/exception` - Update slot with exception for specific date
- `DELETE /api/slots/:id` - Delete slot

### Exceptions
- `GET /api/exceptions` - Get all exceptions
- `GET /api/exceptions/:id` - Get exception by ID
- `POST /api/exceptions` - Create new exception
- `PUT /api/exceptions/:id` - Update exception
- `DELETE /api/exceptions/:id` - Delete exception
- `GET /api/exceptions/effective/:slotId/:date` - Get effective slot for date

## Usage

### Creating Slots
1. Navigate to the Slots page
2. Click "New Slot"
3. Fill in the slot details:
   - Title and description
   - Day of the week
   - Start and end times
   - Effective date range
   - Recurring status

### Managing Exceptions
1. Navigate to the Exceptions page
2. Click "New Exception"
3. Select a slot and date
4. Choose to either:
   - Cancel the slot for that date
   - Modify the time for that date
5. Add an optional reason

### Weekly Schedule
The dashboard provides an overview of all slots organized by day of the week, making it easy to see your complete schedule at a glance.

## Development

### Database Migrations
```bash
cd backend
npm run db:migrate    # Run migrations
npm run db:rollback   # Rollback last migration
```

### Building for Production
```bash
npm run build
```

### Code Structure
```
├── backend/
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── validation/     # Joi schemas
│   │   └── types/          # TypeScript types
│   ├── migrations/         # Database migrations
│   └── seeds/             # Database seeds
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
