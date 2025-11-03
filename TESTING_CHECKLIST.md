# 🧪 Scheduler App - Testing Checklist

## ✅ Pre-Testing Setup

- [ ] PostgreSQL service is running
- [ ] Database `scheduler_dev` is created
- [ ] Migrations have been run (`npm run db:migrate`)
- [ ] Backend and Frontend are running (`npm run dev`)
- [ ] Frontend is accessible at http://localhost:3000
- [ ] Backend API is healthy at http://localhost:3001/api/health

---

## 📋 Test Case 1: Create Recurring Slot

**Objective**: Verify that creating a slot on one day replicates it for all upcoming instances of that day.

### Steps:
1. Navigate to **Dashboard** → Click **New Slot** or go to **Slots** page
2. Fill in form:
   - **Day of Week**: Monday
   - **Start Time**: 09:00
   - **End Time**: 11:00
   - **Name**: Morning Meeting (optional)
3. Click **Create Slot**
4. You should see a success toast notification

### Expected Result:
- ✅ Slot is created successfully
- ✅ Every Monday in the calendar should now have this 9 AM - 11 AM slot
- ✅ Slot should appear in both current and future weeks
- ✅ In **Weekly Calendar** view, navigate forward (infinite scroll) and verify the slot appears on all Mondays

### Backend Verification:
```sql
-- Run in PostgreSQL
SELECT id, day_of_week, start_time, end_time, is_active FROM slots WHERE day_of_week = 1;
```
Should show the created slot with `day_of_week = 1` (Monday).

---

## 📋 Test Case 2: Max 2 Slots Per Day Enforcement

**Objective**: Verify that a day cannot have more than 2 slots.

### Steps:
1. Create a **Monday slot** (9 AM - 11 AM) - if not already created
2. Create a second **Monday slot** (1 PM - 3 PM)
3. Try to create a **third Monday slot** (4 PM - 5 PM)

### Expected Result:
- ✅ First slot creation succeeds
- ✅ Second slot creation succeeds
- ✅ Third slot creation **FAILS** with error: "Maximum 2 slots allowed per day"
- ✅ Toast notification shows the error
- ✅ No slot is added to the database

### Backend Verification:
```sql
SELECT COUNT(*) as slot_count FROM slots WHERE day_of_week = 1 AND is_active = true;
```
Should return `2` (not 3).

---

## 📋 Test Case 3: Time Conflict Detection

**Objective**: Verify that overlapping time slots on the same day are rejected.

### Steps:
1. You should already have a Monday 9 AM - 11 AM slot
2. Try to create a **conflicting Monday slot** (10 AM - 12 PM)
3. Try to create another **conflicting slot** (8 AM - 10 AM)
4. Try to create another **conflicting slot** (8 AM - 12 PM, encompassing the first)

### Expected Result:
- ✅ All three attempts **FAIL** with error: "A slot already exists for this day and time"
- ✅ No conflicting slots are created
- ✅ Valid slot (3 PM - 5 PM) on the same day should still succeed (non-overlapping)

### Backend Verification:
```sql
SELECT day_of_week, start_time, end_time FROM slots WHERE is_active = true ORDER BY day_of_week, start_time;
```
Should show no overlapping times on the same day.

---

## 📋 Test Case 4: Create Exception for Specific Date

**Objective**: Verify that exceptions can be created for a specific date without affecting other recurring slots.

### Steps:
1. Navigate to **Weekly Calendar** → Current or future week
2. Find a Monday with your recurring slot (e.g., 9 AM - 11 AM)
3. Click the **Edit icon** on that specific slot instance
4. Modify it:
   - Change time to **9:30 AM - 10:30 AM**, OR
   - Mark as **Cancelled**
5. Confirm the change

### Expected Result:
- ✅ Exception is created for that specific date only
- ✅ Toast shows: "Slot exception created successfully" or "Slot updated"
- ✅ The modified instance shows the new time/cancelled status
- ✅ **Other Mondays** still show the original 9 AM - 11 AM slot (unaffected)
- ✅ Navigate to future weeks and verify other Monday slots remain unchanged

### Frontend Verification:
1. Look at current Monday slot - should show modified time/cancelled status
2. Navigate forward one week
3. Look at next Monday slot - should show **original** 9 AM - 11 AM (not modified)

### Backend Verification:
```sql
-- Check the base slot (unchanged)
SELECT id, day_of_week, start_time, end_time FROM slots WHERE day_of_week = 1 LIMIT 1;

-- Check exceptions for that slot
SELECT slot_id, exception_date, start_time, end_time, is_cancelled FROM slot_exceptions WHERE slot_id = '<slot_id>' ORDER BY exception_date;
```
The base slot should be unchanged. The exception should show the specific date with modified times.

---

## 📋 Test Case 5: Cancel Specific Slot Instance

**Objective**: Verify that a specific slot instance can be cancelled while keeping others active.

### Steps:
1. Find a Monday slot in a future week (e.g., 2 weeks from now)
2. Click **Edit** → Mark as **Cancelled**
3. Confirm the cancellation
4. Navigate to the current week - the slot should still be there

### Expected Result:
- ✅ Only that specific instance is marked as cancelled
- ✅ Cancelled slot shows with strikethrough or disabled appearance in the calendar
- ✅ **Same slot on other Mondays** is still active
- ✅ The slot is not deleted, just marked as cancelled

### Database Verification:
```sql
SELECT slot_id, exception_date, is_cancelled FROM slot_exceptions WHERE is_cancelled = true;
```
Should show the cancelled exception for the specific date.

---

## 📋 Test Case 6: Infinite Scroll (Load More Weeks)

**Objective**: Verify that the calendar efficiently loads past and future weeks on scroll.

### Steps:
1. Open **Weekly Calendar**
2. Scroll **downward** (or to the next week) using navigation controls
3. Continue scrolling forward 4-5 weeks into the future
4. Verify all slots appear for each week
5. Scroll **backward** if possible, or open **Week Selector**
6. Go to past weeks and verify slots appear there too

### Expected Result:
- ✅ Each week loads automatically as you scroll
- ✅ No delays or loading errors
- ✅ All recurring slots appear on their correct days in all weeks
- ✅ Calendar remains responsive
- ✅ Weeks load smoothly without page refresh

### Performance Check:
- ✅ Each week loads in < 1 second
- ✅ No console errors in browser DevTools (F12)
- ✅ API calls show correct date ranges

---

## 📋 Test Case 7: View All Slots (Slots Page)

**Objective**: Verify the Slots page displays all slots correctly with search and filtering.

### Steps:
1. Navigate to **Slots** page
2. You should see all recurring slots listed
3. Each slot should show:
   - Day of week name (Monday, Tuesday, etc.)
   - Start time and end time
   - Number of future instances
4. Try **Search** feature (if available)
5. Try **Filter** by day (if available)

### Expected Result:
- ✅ All created slots are listed
- ✅ Search/filter works correctly
- ✅ Slot details are accurate
- ✅ Can click to view/edit/delete each slot

---

## 📋 Test Case 8: Edit Recurring Slot (Base Slot)

**Objective**: Verify that editing the base slot affects all future instances (not exceptions).

### Steps:
1. Navigate to **Slots** page
2. Find the Monday 9 AM - 11 AM slot
3. Click **Edit** → Change time to **9:15 AM - 11:15 AM**
4. Save the changes
5. Navigate to **Weekly Calendar** and check multiple Mondays

### Expected Result:
- ✅ Edit is successful
- ✅ **All Monday slots** now show 9:15 AM - 11:15 AM
- ✅ **Previously cancelled instances** remain cancelled on their specific dates
- ✅ **Previously modified instances** are updated with the new times
- ✅ Calendar is updated in real-time

---

## 📋 Test Case 9: Delete Recurring Slot

**Objective**: Verify that deleting a slot deactivates all instances.

### Steps:
1. Create a test slot (e.g., **Wednesday 2 PM - 4 PM**)
2. Verify it appears in the calendar for multiple weeks
3. Navigate to **Slots** page → Find the Wednesday slot
4. Click **Delete**
5. Confirm deletion
6. Navigate to **Weekly Calendar**

### Expected Result:
- ✅ Deletion is successful
- ✅ Slot is **no longer visible** in the calendar (any week)
- ✅ Toast notification confirms deletion
- ✅ No 500 errors in backend logs

### Backend Verification:
```sql
SELECT * FROM slots WHERE day_of_week = 3 AND is_active = false;
```
The deleted slot should show `is_active = false` or be completely gone depending on soft/hard delete setting.

---

## 📋 Test Case 10: Dashboard Statistics

**Objective**: Verify that the dashboard shows correct statistics.

### Steps:
1. Navigate to **Dashboard**
2. Check the displayed statistics:
   - Total active slots
   - Upcoming exceptions
   - Recent activity

### Expected Result:
- ✅ All statistics are accurate
- ✅ Numbers match the database
- ✅ Recent activity log shows all changes

---

## 🐛 Common Issues to Check

### Issue: Slots not appearing in calendar
- [ ] Check backend logs for API errors
- [ ] Verify database migrations ran successfully
- [ ] Check browser console (F12) for network errors
- [ ] Ensure slots have `is_active = true` in database

### Issue: Infinite scroll not working
- [ ] Check browser console for JavaScript errors
- [ ] Verify API endpoints are responding
- [ ] Test network tab in DevTools (F12)
- [ ] Scroll on calendar container (not page)

### Issue: Exceptions not showing
- [ ] Verify slot_exceptions table is populated correctly
- [ ] Check that exception_date matches the UI date format
- [ ] Ensure the exception is linked to the correct slot_id

### Issue: Max 2 slots limit not enforced
- [ ] Check backend logs during slot creation
- [ ] Verify getSlotsCountForDay() query is correct
- [ ] Ensure is_active filter is applied

### Issue: Time conflicts not detected
- [ ] Verify checkSlotConflict() query logic
- [ ] Test with exact overlap and partial overlap
- [ ] Check database for data consistency

---

## 📊 Test Results Template

```markdown
# Test Results - [Date]

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1. Create Recurring Slot | ✅/❌ | |
| 2. Max 2 Slots Limit | ✅/❌ | |
| 3. Time Conflict Detection | ✅/❌ | |
| 4. Create Exception | ✅/❌ | |
| 5. Cancel Instance | ✅/❌ | |
| 6. Infinite Scroll | ✅/❌ | |
| 7. Slots Page View | ✅/❌ | |
| 8. Edit Base Slot | ✅/❌ | |
| 9. Delete Slot | ✅/❌ | |
| 10. Dashboard Stats | ✅/❌ | |

**Overall Status**: ✅ PASS / ❌ FAIL

**Issues Found**: 
- [List any issues]

**Next Steps**: 
- [What to fix or test next]
```

---

## 🚀 After Testing

If all tests pass:
1. ✅ Your app is production-ready for an MVP
2. 📝 Consider adding user authentication
3. 🔄 Think about calendar sharing features
4. 📱 Test on mobile devices
5. 🌍 Consider multi-timezone support

If issues are found:
1. Check the **Backend Logs** in your terminal
2. Check the **Browser Console** (F12)
3. Review the **FIXES_APPLIED.md** for troubleshooting
4. Check **SETUP.md** for detailed explanations