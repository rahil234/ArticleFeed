# Quick Start Guide - Testing Public Pages

## Prerequisites
- Docker and Docker Compose installed
- Ports 3000 (frontend) and 4000 (backend) available

## Starting the Application

### Option 1: Development Mode
```bash
# Start both frontend and backend in development mode
docker-compose up
```

### Option 2: Production Mode
```bash
# Start in production mode
docker-compose -f docker-compose-prod.yaml up
```

### Option 3: Manual Start (without Docker)

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Testing Public Pages

### Test as Non-Authenticated User

1. **Visit Home Page**
   - Navigate to `http://localhost:3000`
   - You should see a list of all articles
   - No login required!

2. **Browse Articles**
   - Click on any article card to view details in a dialog
   - View title, description, content, author, and tags
   - Notice the "Sign in to interact" message at the bottom

3. **Navigate to Login**
   - Click "Login" button in the navigation bar
   - Or click "Login" in the article interaction section

4. **Test Navigation**
   - Navigation shows: ArticleFeeds logo, Home link, Login and Sign Up buttons
   - All links should work without authentication

### Test as Authenticated User

1. **Register/Login**
   - Go to `http://localhost:3000/register` or `/login`
   - Create an account or login with existing credentials

2. **Check Redirect**
   - After login, you should be redirected to `/dashboard`
   - Dashboard shows personalized article feed

3. **Test Navigation**
   - Navigation now shows: Dashboard, My Articles, User menu
   - User menu has Settings and Logout options

4. **Interact with Articles**
   - Like, dislike, or block articles
   - Changes should reflect immediately

5. **Visit Home Page**
   - Go to `http://localhost:3000`
   - You should be automatically redirected to `/dashboard`

## API Endpoints to Test

### Public Endpoints (No Auth)
```bash
# Get all public articles
curl http://localhost:4000/api/article/public

# Get specific article
curl http://localhost:4000/api/article/public/{article-id}
```

### Protected Endpoints (Auth Required)
```bash
# Get user's feed (requires Bearer token)
curl -H "Authorization: Bearer {your-token}" http://localhost:4000/api/article/feed

# Get user's articles
curl -H "Authorization: Bearer {your-token}" http://localhost:4000/api/article
```

## Expected Behavior

### ✅ Public User Can:
- View home page with all articles
- Read article details
- See article metadata (author, date, tags, category)
- Browse without authentication
- See prompts to login for interactions

### ✅ Public User Cannot:
- Like/dislike/block articles
- Access dashboard
- Create articles
- Edit articles

### ✅ Authenticated User Can:
- Everything public users can do
- Access personalized dashboard
- Like/dislike/block articles
- Create new articles
- Edit their own articles
- See their articles in "My Articles"

### ✅ Authenticated User Cannot:
- Stay on public home page (auto-redirected to dashboard)

## Troubleshooting

### Issue: "Network Error" or "Failed to fetch"
- Check that backend is running on port 4000
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env` file
- Check browser console for CORS errors

### Issue: "No articles showing"
- Make sure database has articles
- Check backend logs for errors
- Verify API endpoints are returning data

### Issue: Navigation doesn't update after login
- Check localStorage for authToken
- Verify AuthContext is working
- Check browser console for React errors

### Issue: TypeScript errors in IDE
- Run `npm run build` to verify no actual errors
- Restart TypeScript server in your IDE
- Clear IDE cache if needed

## Next Steps

1. **Create Sample Data**
   - Register a user
   - Create some articles
   - Test with different categories and tags

2. **Test Interactions**
   - Login and like articles
   - Dislike and block articles
   - Verify feed updates

3. **Test Responsive Design**
   - Test on mobile devices
   - Check navigation menu on small screens
   - Verify article cards layout

4. **Performance Testing**
   - Create many articles
   - Test loading times
   - Check pagination if implemented

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (.env)
```
PORT=4000
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

## Support

If you encounter any issues:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables are set correctly
3. Ensure database migrations are up to date: `cd backend && npx prisma migrate deploy`
4. Check the implementation summary in `PUBLIC_PAGES_IMPLEMENTATION.md`
