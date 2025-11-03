# 📋 Quick Reference Guide

## 🎯 Requirements vs Implementation

### Requirement 1: Recurring Slots
```
USER ACTION:
  "Create slot: Monday 9 AM - 11 AM"
                    ↓
            [API POST /slots]
                    ↓
      [Store in DB: day_of_week=1, 
       start_time=09:00, end_time=11:00]
                    ↓
          [User views calendar]
                    ↓
      [Get all slots for week X-X+6]
         [Filter by day_of_week]
                    ↓
   [Display Monday 9-11 for ALL Mondays in range]

RESULT: ✅ Recurring slot appears on every Monday automatically
```

### Requirement 2: Max 2 Slots Per Day
```
USER ACTION:
  "Create 3rd Monday slot"
                    ↓
       [SlotController.createSlot()]
                    ↓
  [Query: COUNT(*) slots WHERE day_of_week=1 AND is_active=true]
                    ↓
        [Result: 2 slots already exist]
                    ↓
              [REJECT]
       [Return 409 Conflict]
     "Maximum 2 slots allowed"
                    ↓
RESULT: ✅ 3rd slot NOT created, user gets error message
```

### Requirement 3: Time Conflict Detection
```
USER ACTION:
  "Create Monday 10:00-12:00"
  (conflicts with 9:00-11:00)
                    ↓
       [SlotController.createSlot()]
                    ↓
  [Call SlotModel.checkSlotConflict()]
                    ↓
  [Query: SELECT * FROM slots WHERE
    day_of_week=1 AND is_active=true AND
    (start_time BETWEEN 10:00-12:00 OR
     end_time BETWEEN 10:00-12:00 OR
     (start_time <= 10:00 AND end_time >= 12:00))]
                    ↓
      [Found: 9:00-11:00 slot overlaps]
                    ↓
              [REJECT]
       [Return 409 Conflict]
   "A slot already exists for this time"
                    ↓
RESULT: ✅ Overlapping slot NOT created
```

### Requirement 4: Exception System
```
CURRENT STATE:
  Monday 9-11 AM (recurring, appears every Monday)

USER ACTION:
  "Edit specific Monday Jan 15: Change to 9:30-10:30"
                    ↓
  [SlotController.updateSlotWithException()]
                    ↓
   [Insert into slot_exceptions:
    - slot_id: <id of recurring slot>
    - exception_date: 2024-01-15
    - start_time: 09:30
    - end_time: 10:30]
                    ↓
     [Base slot in 'slots' table: UNCHANGED]
                    ↓
   [When displaying calendar for week Jan 14-20:]
    - Jan 14 (Mon):  Query exceptions → No exception → Show 9-11 ✓
    - Jan 15 (Tue):  (N/A - Tuesday)
    - Jan 22 (Mon):  Query exceptions → No exception → Show 9-11 ✓
                    ↓
RESULT: ✅ Only Jan 15 changed, others unaffected
```

### Requirement 5: Weekly Calendar + Infinite Scroll
```
USER INTERFACE:
┌─────────────────────────────────────┐
│  WEEKLY CALENDAR                    │
├─────────────────────────────────────┤
│  Sun  Mon  Tue  Wed  Thu  Fri  Sat  │
│  7    8    9    10   11   12   13   │
│       ════════════════               │
│       Mon 9-11 AM (Meeting)          │
│       Mon 1-3 PM  (Review)           │
│                                     │
│  [← Previous]    [Next →]            │
└─────────────────────────────────────┘
                    ↓
          [Click Next or Scroll]
                    ↓
       [Query: getWeeklySlotsWithExceptions(
        startDate: 2024-01-14,
        endDate: 2024-01-20)]
                    ↓
     [Process all slots + exceptions]
                    ↓
    [Render next week in calendar]
                    ↓
RESULT: ✅ Smooth infinite scroll, all slots display correctly
```

---

## 🔌 API Endpoints Reference

### Create Recurring Slot
```
POST /api/slots
Content-Type: application/json

{
  "day_of_week": 1,           // 0=Sun, 1=Mon, ..., 6=Sat
  "start_time": "09:00",      // HH:mm format
  "end_time": "11:00",        // HH:mm format
  "name": "Team Meeting",     // optional
  "effective_from": "2024-01-08"  // optional
}

✅ Success (201):
{
  "success": true,
  "data": { id, day_of_week, start_time, end_time, ... },
  "message": "Slot created successfully"
}

❌ Max slots exceeded (409):
{
  "success": false,
  "error": "Limit exceeded",
  "message": "Maximum 2 slots allowed per day"
}

❌ Time conflict (409):
{
  "success": false,
  "error": "Conflict",
  "message": "A slot already exists for this day and time"
}
```

### Get Weekly Slots with Exceptions
```
GET /api/slots/weekly-with-exceptions?startDate=2024-01-07&endDate=2024-01-13

✅ Success (200):
{
  "success": true,
  "data": [
    {
      "date": "2024-01-07",
      "day_of_week": 0,  // Sunday
      "slots": []
    },
    {
      "date": "2024-01-08",
      "day_of_week": 1,  // Monday
      "slots": [
        {
          "id": "uuid",
          "day_of_week": 1,
          "start_time": "09:00",
          "end_time": "11:00",
          "is_exception": false
        },
        {
          "id": "uuid2",
          "day_of_week": 1,
          "start_time": "14:00",
          "end_time": "16:00",
          "is_exception": false
        }
      ]
    },
    ...
  ]
}
```

### Create Exception for Specific Date
```
PUT /api/slots/:slotId/exception
Content-Type: application/json

{
  "date": "2024-01-15",
  "updates": {
    "start_time": "09:30",    // optional: new start time
    "end_time": "10:30",      // optional: new end time
    "is_cancelled": false,    // optional: mark as cancelled
    "reason": "Rescheduled"   // optional: reason for change
  }
}

✅ Success (201):
{
  "success": true,
  "data": { id, slot_id, exception_date, start_time, end_time, ... },
  "message": "Slot exception created successfully"
}
```

---

## 🗄️ Database Schema Quick View

### Slots Table
```sql
CREATE TABLE slots (
  id UUID PRIMARY KEY,
  day_of_week INT (0-6),       -- 0=Sun, 1=Mon, ..., 6=Sat
  start_time TIME,             -- e.g., 09:00:00
  end_time TIME,               -- e.g., 11:00:00
  is_active BOOLEAN,           -- soft delete flag
  name VARCHAR(255),           -- optional slot name
  effective_from DATE,         -- when slot starts recurring
  effective_until DATE,        -- when slot stops (NULL = ongoing)
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

Index: day_of_week (for fast filtering by day)
```

### Slot Exceptions Table
```sql
CREATE TABLE slot_exceptions (
  id UUID PRIMARY KEY,
  slot_id UUID REFERENCES slots(id),  -- which recurring slot
  exception_date DATE,                 -- specific date
  start_time TIME,                     -- modified time
  end_time TIME,                       -- modified time
  is_cancelled BOOLEAN,                -- if this instance is cancelled
  reason VARCHAR(500),                 -- why the change
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

Index: (slot_id, exception_date) unique (one exception per date per slot)
```

---

## 🧠 How the System Thinks

### Creating a Recurring Slot
```
Input: Monday 9-11 AM
       ↓
Store as 1 record:
  - day_of_week: 1
  - start_time: 09:00
  - end_time: 11:00
       ↓
When displaying Jan 8-14 week:
  - Find all slots
  - For each date in range:
    - Get day_of_week (0-6)
    - Find slots matching day_of_week
    - Check for exceptions on that date
    - Display the slot(s)
       ↓
Result: Monday shown with 9-11 AM slot
```

### Handling Exceptions
```
Base Slot: Monday 9-11 AM
Exception created for Jan 15: 9:30-10:30
       ↓
Display logic:
  - Get Monday dates: Jan 8, 15, 22, 29, ...
  - For Jan 8:  No exception → Show 9-11 AM ✓
  - For Jan 15: Exception exists → Show 9:30-10:30 ✓
  - For Jan 22: No exception → Show 9-11 AM ✓
  - For Jan 29: No exception → Show 9-11 AM ✓
       ↓
Base slot NEVER modified - exceptions only override for specific dates
```

---

## 🎮 User Workflows

### Workflow 1: Create Recurring Meeting
```
1. Click "New Slot"
2. Fill form:
   - Day: Monday
   - Time: 9:00 - 11:00
   - Name: Team Meeting
3. Click "Create"
4. ✅ Slot appears on every Monday in calendar
5. ✅ See in Weekly Calendar, scrolling works
```

### Workflow 2: Reschedule One Instance
```
1. Click edit on specific Monday instance
2. Change time: 9:30 - 10:30
3. Click "Save"
4. ✅ That Monday shows new time
5. ✅ Other Mondays unchanged
6. Can undo by deleting exception
```

### Workflow 3: Cancel One Instance
```
1. Click edit on specific Monday instance
2. Check "Mark as Cancelled"
3. Click "Save"
4. ✅ That Monday shows crossed out/disabled
5. ✅ Still appears in calendar (for reference)
6. ✅ Other Mondays still active
```

### Workflow 4: Navigate Through Weeks
```
1. Open Weekly Calendar
2. See current week
3. Click "Next" or scroll
4. ✅ Next week loads
5. ✅ Slots appear on correct days
6. Continue clicking forward/backward
7. ✅ All weeks load smoothly
```

---

## ⚙️ Key System Behaviors

### Slot Creation Validation (in order)
```
1. Is user authenticated? → No → 401 Unauthorized
2. Valid request body? → No → 400 Bad Request
3. Does day exist (0-6)? → No → 400 Bad Request
4. Valid time format? → No → 400 Bad Request
5. Is end_time > start_time? → No → 400 Bad Request
6. Already 2 slots on this day? → Yes → 409 Conflict
7. Time conflict with existing? → Yes → 409 Conflict
8. ✅ All checks pass → Create slot → 201 Created
```

### Slot Display Logic
```
For each day in displayed week:
  1. Get day's day_of_week (0-6)
  2. Find all slots where day_of_week matches
  3. For each slot:
     - Check if exception exists for this date
     - If exception: Show modified time or cancelled
     - If no exception: Show original slot times
  4. Sort by start_time
  5. Display in calendar
```

### Exception Rules
```
- Only ONE exception per slot per date
- Exceptions are independent of base slot
- Deleting base slot: all instances gone (including exceptions)
- Deleting exception: revert to base slot for that date
- Editing base slot: affects all dates without exceptions
```

---

## 🚦 Status Codes Reference

| Code | Meaning | Example |
|------|---------|---------|
| 201 | Created | Slot successfully created |
| 400 | Bad Request | Invalid time format, missing required field |
| 404 | Not Found | Slot ID doesn't exist |
| 409 | Conflict | Time overlap, max slots exceeded, duplicate exception |
| 500 | Server Error | Database connection issue, unexpected error |

---

## 📱 UI Components

### Weekly Calendar Component
- Displays 7 days (Sunday-Saturday)
- Shows current week by default
- Navigation: Previous/Next buttons or infinite scroll
- Each day shows:
  - Day name (Monday)
  - Date (Jan 15, 2024)
  - All slots for that day (9-11 AM, 1-3 PM)
  - Edit/delete buttons per slot

### Create Slot Modal
- Dropdown: Select day of week
- Time picker: Start and end time
- Optional name field
- Validation: Real-time feedback
- Submit: Create button (disabled if invalid)

### Edit Slot Modal
- Shows current times
- Edit fields for new times
- Option to cancel the instance
- Optional reason field
- Submit: Save or Cancel button

### Exception Management Page
- List all exceptions
- Filter by:
  - Date range
  - Slot name
  - Status (cancelled/modified)
- Actions: View details, edit, delete

---

## 💡 Pro Tips

### For Best Performance
- Limit viewing to ±4 weeks at a time
- Cache weeks that are already loaded
- Use date range queries (not all slots at once)
- Soft delete instead of hard delete (faster)

### For Best UX
- Show loading spinner while fetching
- Highlight current week
- Use toast notifications for feedback
- Disable double-submit on forms
- Confirm before deleting

### For Best Reliability
- Always validate on both frontend and backend
- Always check for conflicts before creation
- Log all changes (audit trail)
- Use transactions for multi-step operations
- Backup database regularly

---

## 🔍 Debugging Tips

### To check if slot is recurring correctly:
```sql
SELECT * FROM slots WHERE day_of_week = 1;
-- Should show 1 record
-- Get that ID for next query
```

### To check if exception exists for specific date:
```sql
SELECT * FROM slot_exceptions 
WHERE slot_id = 'your-slot-id' 
AND exception_date = '2024-01-15';
-- Should show 1 record if exception created
-- Empty if no exception for that date
```

### To check all exceptions for a slot:
```sql
SELECT * FROM slot_exceptions 
WHERE slot_id = 'your-slot-id'
ORDER BY exception_date;
```

### To view what gets displayed for a week:
```sql
-- Get all active slots
SELECT * FROM slots WHERE is_active = true;

-- Get all exceptions for date range
SELECT * FROM slot_exceptions 
WHERE exception_date BETWEEN '2024-01-08' AND '2024-01-14'
ORDER BY exception_date;

-- Frontend then combines these to display
```

---

## 📞 Quick Help

| Problem | Solution |
|---------|----------|
| Slot not appearing | Check if `is_active = true` in database |
| Max 2 slots not enforced | Check backend logs for validation error |
| Exception not showing | Verify `exception_date` matches UI date format |
| Infinite scroll sluggish | Check Network tab - may be API latency |
| Time conflict not detected | Try exact overlap first (e.g., 9-11 vs 9-11) |
| Past weeks not loading | Check that `effective_until` is NULL or future |

---

**For detailed information, refer to:**
- `REQUIREMENTS_VERIFICATION.md` - Technical verification
- `TESTING_CHECKLIST.md` - Test procedures  
- `SETUP.md` - Setup and troubleshooting

✅ **Status**: All requirements verified and working!