# Fixing Common Errors

## Backend Error: TypeScript knexfile Import

✅ **FIXED** - The TypeScript configuration has been updated to allow JavaScript imports.

The backend should now work. If you still see errors, restart the dev server:
```bash
cd backend
npm run dev
```

## Frontend Error: react-scripts not found

This means frontend dependencies are not installed. Run:

```bash
cd frontend
npm install --legacy-peer-deps
```

**Why `--legacy-peer-deps`?**
- React Scripts 5.0.1 has peer dependency conflicts with TypeScript 5.x
- This flag allows installation despite conflicts
- It's safe to use in this case

After installation, start the frontend:
```bash
npm start
```

## Complete Fix Sequence

### Backend Fix
```bash
cd backend
npm run dev
```

### Frontend Fix
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

### Or Run Both
```bash
# From project root
npm run dev
```

