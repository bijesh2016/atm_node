# CORS Setup for MERN Stack

This document explains the CORS (Cross-Origin Resource Sharing) configuration for your MERN stack application.

## What was configured:

### Backend (Node.js/Express)
1. **Installed CORS package**: `npm install cors`
2. **Configured CORS middleware** in `src/config/express.config.js`:
   - Allowed origins: `localhost:3000`, `localhost:5173` (React/Vite dev servers)
   - Enabled credentials for authentication
   - Allowed necessary HTTP methods and headers

### Frontend (React)
1. **Updated API base URL** from `localhost:8000` to `localhost:9000` to match your backend
2. **Updated all API endpoints** to include the correct path prefix `/api/atm_locator/`
3. **Created test component** to verify CORS is working

## How to test:

### 1. Start your backend server:
```bash
npm run watch
```
Your backend will run on `http://localhost:9000`

### 2. Start your React frontend:
```bash
cd frontend
npm start  # or npm run dev for Vite
```
Your frontend will run on `http://localhost:3000` or `http://localhost:5173`

### 3. Test the connection:
- The app will show a "API Connection Test" component
- If CORS is working correctly, you'll see "Connection successful!" with response data
- If there are issues, you'll see error details

## CORS Configuration Details:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000', // React development server
    'http://localhost:5173', // Vite development server
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
};
```

## API Endpoints:

All your API endpoints now use the correct path structure:
- Authentication: `/api/atm_locator/auth/*`
- Banks: `/api/atm_locator/bank/*`
- Branches: `/api/atm_locator/branch/*`
- ATMs: `/api/atm_locator/atm/*`

## Troubleshooting:

### Common CORS errors:
1. **"No 'Access-Control-Allow-Origin' header"**: Check that CORS middleware is loaded before routes
2. **"Credentials not supported"**: Ensure `credentials: true` is set in both backend CORS and frontend axios
3. **"Method not allowed"**: Verify the HTTP method is included in the allowed methods array

### If you're still having issues:
1. Check browser console for specific error messages
2. Verify backend is running on port 9000
3. Verify frontend is running on an allowed origin (3000 or 5173)
4. Check that the CORS middleware is loaded before your routes in `express.config.js`

## Next Steps:

Once you've verified CORS is working:
1. Remove the test component from `App.tsx`
2. Uncomment the normal app flow: `return user ? <Dashboard /> : <Login />;`
3. Test your authentication and other API calls

## Production Considerations:

For production, you should:
1. Replace `localhost` origins with your actual domain
2. Consider using environment variables for origins
3. Implement more restrictive CORS policies
4. Use HTTPS in production 