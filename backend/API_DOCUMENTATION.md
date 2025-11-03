# Backend API Documentation

## Overview

The scheduler backend is built with **Node.js + TypeScript** and uses **PostgreSQL** for data storage. All recurring logic and exception handling is done entirely in the backend.

## Base URL

```
http://localhost:3001/api
```

## API Endpoints

### 1. Creating a Slot

**Endpoint:** `POST /api/slots`

**Description:** Creates a new recurring weekly slot. The slot will automatically replicate for all upcoming occurrences of that day.

**Request Body:**
```json
{
  "title": "Morning Meeting",
  "description": "Team standup",
  "day_of_week": 1,  // 0=Sunday, 1=Monday, ..., 6=Saturday
  "start_time": "09:00",
  "end_time": "11:00",
  "is_recurring": true,
  "effective_from": "2024-01-01",
  "effective_until": null  // null means indefinite
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Morning Meeting",
    "day_of_week": 1,
    "start_time": "09:00",
    "end_time": "11:00",
    "is_recurring": true,
    "effective_from": "2024-01-01",
    "effective_until": null,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Slot created successfully"
}
```

**Validation Rules:**
- Maximum 2 slots per day (enforced by backend)
- No overlapping time slots on the same day
- Start time must be before end time

---

### 2. Fetching Slots for a Given Week

**Endpoint:** `GET /api/slots/weekly-with-exceptions?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

**Description:** Fetches all slots for a given week with exceptions automatically applied. The backend handles all recurring logic - if a slot is set for Monday, it will appear on all Mondays in the date range unless there's an exception.

**Query Parameters:**
- `startDate` (required): Start date of the week (YYYY-MM-DD format)
- `endDate` (required): End date of the week (YYYY-MM-DD format)

**Example Request:**
```
GET /api/slots/weekly-with-exceptions?startDate=2024-01-01&endDate=2024-01-07
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-01",
      "day_of_week": 1,
      "slots": [
        {
          "id": "uuid",
          "title": "Morning Meeting",
          "start_time": "09:00",
          "end_time": "11:00",
          "is_exception": false,
          "is_cancelled": false
        },
        {
          "id": "uuid",
          "title": "Afternoon Session",
          "start_time": "14:00",
          "end_time": "16:00",
          "is_exception": true,
          "modified_start_time": "15:00",
          "modified_end_time": "17:00",
          "exception_reason": "Slot updated for specific date"
        }
      ]
    },
    // ... more days
  ],
  "message": "Weekly slots with exceptions retrieved successfully"
}
```

**Backend Logic:**
- Automatically finds all slots matching each day of the week
- Applies exceptions for specific dates
- Returns slots with their exception status and modifications

---

### 3. Updating a Slot (Creates Exception)

**Endpoint:** `PUT /api/slots/:id`

**Description:** Updates a slot. If a `date` is provided, creates an exception for that specific date without affecting the recurring pattern.

**Path Parameters:**
- `id`: Slot UUID

**Request Body (with date - creates exception):**
```json
{
  "date": "2024-01-08",
  "start_time": "10:00",
  "end_time": "12:00"
}
```

**Request Body (without date - updates recurring slot):**
```json
{
  "start_time": "10:00",
  "end_time": "12:00"
}
```

**Response (with date - exception created):**
```json
{
  "success": true,
  "data": {
    "id": "exception-uuid",
    "slot_id": "slot-uuid",
    "exception_date": "2024-01-08",
    "start_time": "10:00",
    "end_time": "12:00",
    "is_cancelled": false,
    "reason": "Slot updated for specific date"
  },
  "message": "Slot exception created successfully"
}
```

**Backend Logic:**
- If `date` is provided: Creates/updates an exception for that specific date
- If `date` is NOT provided: Updates the recurring slot itself (affects all future occurrences)
- Recurring pattern remains unchanged for other dates when creating exceptions

---

### 4. Deleting a Slot (Creates Exception)

**Endpoint:** `DELETE /api/slots/:id?date=YYYY-MM-DD`

**Description:** Deletes a slot. If a `date` query parameter is provided, creates an exception (cancels) for that specific date without affecting the recurring pattern.

**Path Parameters:**
- `id`: Slot UUID

**Query Parameters:**
- `date` (optional): Specific date to cancel (YYYY-MM-DD format)
- `permanent` (optional): If `true` and no date, permanently deletes the slot

**Example Request (with date - creates exception):**
```
DELETE /api/slots/uuid?date=2024-01-08
```

**Example Request (without date - deletes recurring slot):**
```
DELETE /api/slots/uuid
```

**Response (with date - exception created):**
```json
{
  "success": true,
  "data": {
    "id": "exception-uuid",
    "slot_id": "slot-uuid",
    "exception_date": "2024-01-08",
    "is_cancelled": true,
    "reason": "Slot cancelled for specific date"
  },
  "message": "Slot cancelled for this date"
}
```

**Backend Logic:**
- If `date` is provided: Creates/updates an exception with `is_cancelled: true` for that specific date
- If `date` is NOT provided: Deletes or deactivates the recurring slot (affects all future occurrences)
- Recurring pattern remains unchanged for other dates when creating exceptions

---

## Exception Handling (Backend Logic)

All exception handling is done automatically in the backend:

1. **When fetching weekly slots:**
   - Backend retrieves all recurring slots
   - Backend checks for exceptions for each date
   - Backend applies exceptions (modifications or cancellations) to the appropriate dates
   - Frontend receives fully processed data

2. **When updating a slot with a date:**
   - Backend creates/updates an exception entry
   - Recurring slot remains unchanged
   - Exception only affects the specified date

3. **When deleting a slot with a date:**
   - Backend creates/updates an exception with cancellation flag
   - Recurring slot remains unchanged
   - Cancellation only affects the specified date

## Recurring Logic (Backend Logic)

The backend automatically handles recurring logic:

- When a slot is created with `day_of_week: 1` (Monday), it appears on ALL Mondays
- The backend calculates which slots should appear on which dates based on:
  - `day_of_week` field
  - `effective_from` and `effective_until` dates
  - Active status
- Exceptions override the recurring pattern for specific dates
- No frontend calculation required - backend does all the work

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message"
}
```

**Common HTTP Status Codes:**
- `400`: Bad Request (validation errors, missing parameters)
- `404`: Not Found (slot not found)
- `409`: Conflict (maximum slots reached, time conflict)
- `500`: Internal Server Error

## Example Usage Flow

1. **Create a recurring slot:**
   ```
   POST /api/slots
   { "day_of_week": 1, "start_time": "09:00", "end_time": "11:00", ... }
   ```

2. **Fetch week with slots:**
   ```
   GET /api/slots/weekly-with-exceptions?startDate=2024-01-01&endDate=2024-01-07
   ```
   Returns all Mondays in that week with the slot

3. **Update slot for specific date:**
   ```
   PUT /api/slots/uuid
   { "date": "2024-01-08", "start_time": "10:00", "end_time": "12:00" }
   ```
   Creates exception - only 2024-01-08 is affected, other Mondays unchanged

4. **Delete slot for specific date:**
   ```
   DELETE /api/slots/uuid?date=2024-01-15
   ```
   Creates cancellation exception - only 2024-01-15 is cancelled, other Mondays unchanged

## Database Schema

### Slots Table
- Stores recurring slot definitions
- `day_of_week`: 0-6 (Sunday-Saturday)
- `effective_from` and `effective_until`: Date range for slot validity

### Slot Exceptions Table
- Stores exceptions to recurring patterns
- `exception_date`: Specific date for exception
- `is_cancelled`: Boolean flag for cancellations
- `start_time`/`end_time`: Modified times (optional)

The backend joins these tables and applies exceptions when fetching weekly data.

