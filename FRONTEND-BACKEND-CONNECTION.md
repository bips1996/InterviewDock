# Frontend-Backend Connection Configuration

## Current Setup

### Backend (Production)
- **URL:** http://13.235.133.89:5001
- **API Base:** http://13.235.133.89:5001/api
- **Status:** ✅ Running and accessible

### Frontend (Local Development)
- **URL:** http://localhost:3000
- **API Connection:** http://13.235.133.89:5001/api (configured in `.env`)
- **Status:** ✅ Running

## Configuration Files

### Frontend Environment (.env)
```
VITE_API_URL=http://13.235.133.89:5001/api
```

### Postman Environments
1. **Local Environment** - `InterviewDock-Environments.postman_environment.json`
   - For testing with local backend: `http://localhost:5001`

2. **Production Environment** - `InterviewDock-Production.postman_environment.json`
   - For testing with production backend: `http://13.235.133.89:5001`

## Testing

### 1. Test Backend Health
```bash
curl http://13.235.133.89:5001/health
```

Expected Response:
```json
{
  "status": "ok",
  "message": "InterviewDock API is running"
}
```

### 2. Test API Endpoints
```bash
# Get all categories
curl http://13.235.133.89:5001/api/categories

# Get all technologies
curl http://13.235.133.89:5001/api/technologies

# Get all questions
curl http://13.235.133.89:5001/api/questions
```

### 3. Test Frontend
1. Open your browser and navigate to: http://localhost:3000
2. The frontend should now fetch data from the production backend
3. Check browser console for any errors
4. Verify that data is loading correctly from the backend

## Switching Between Environments

### For Local Backend Testing
Update `frontend/.env`:
```
VITE_API_URL=http://localhost:5001/api
```

Then restart the frontend server:
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### For Production Backend Testing
Update `frontend/.env`:
```
VITE_API_URL=http://13.235.133.89:5001/api
```

Then restart the frontend server.

## Common Issues & Solutions

### CORS Errors
If you see CORS errors in the browser console, ensure your backend has CORS enabled for the frontend origin.

Backend should have:
```typescript
app.use(cors());
```

### Connection Refused
- Verify backend is running: `curl http://13.235.133.89:5001/health`
- Check EC2 security group allows inbound traffic on port 5001
- Verify Docker container is running on EC2

### Data Not Loading
1. Open browser DevTools (F12)
2. Check Network tab for API requests
3. Verify requests are going to the correct URL
4. Check Console tab for any JavaScript errors

## Next Steps

1. ✅ Backend deployed and running on EC2
2. ✅ Frontend configured to connect to production backend
3. ✅ Postman collections updated with production environment
4. 🔄 **Test the application in your browser**
5. 📋 Consider deploying frontend to production (Vercel/Netlify/S3)

## Production Deployment Checklist

When ready to deploy frontend to production:
- [ ] Update `.env.production` with production backend URL
- [ ] Build frontend: `npm run build`
- [ ] Deploy `dist` folder to hosting service
- [ ] Update backend CORS to allow production frontend URL
- [ ] Test all features in production environment
