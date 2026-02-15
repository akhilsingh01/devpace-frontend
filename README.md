## DevPace Frontend
DevPace is a full-stack productivity application designed to help users track, organize, and manage their study sessions efficiently.
This repository contains the frontend built using React (Vite) and Tailwind CSS.

The frontend communicates with a Django REST Framework backend using JWT authentication.

## Tech Stack
- React (Vite)
- Tailwind CSS
- Axios
- JWT Authentication
- Deployed on Vercel

## Features
- User Login and Registration
- JWT Authentication with:
  - Access token (short-lived)
  - Refresh token stored in HttpOnly cookie
- Automatic token refresh using Axios interceptors
- Protected routes
- Full CRUD operations for Study Logs
- Profile view and update
- Change password functionality
- Clean responsive UI with Tailwind CSS


## Authentication Architecture
- Short-lived access tokens are stored client-side and attached via the `Authorization: Bearer` header.
- Refresh tokens are stored in HttpOnly cookies to prevent JavaScript access.
- Axios interceptors handle automatic token refresh.
- Users are redirected to login if refresh fails.


## Environment Variables

Create a .env file in the project root:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/
```
For production:
```
VITE_API_BASE_URL=https://your-backend-name.onrender.com/api/
```


## Project Structure

```
devpace-frontend/
│
└── src/
      ├── api/
      ├── components/
      ├── pages/
      ├── App.jsx
      └── main.jsx
```
The axios instance is configured inside the api folder with:
- Request interceptor (attach access token)
- Response interceptor (auto refresh logic)


## Run Locally

1️. Clone the repository
```
git clone https://github.com/akhilsingh01/devpace-frontend.git
cd devpace-frontend
```
2. Install dependencies
```
npm i
```
3. Start development server
```
npm run dev
```
The app will run on:
```
http://localhost:5173
```

## Production Deployment
The frontend is deployed on Vercel.
### Steps:
- Push code to GitHub
- Import project in Vercel
- Deploy
Production configuration uses environment-based API URLs and secure cookie handling.

## Live Demo

Frontend: https://your-frontend.vercel.app  
Backend API: https://your-backend.onrender.com/api/

## Backend Repository
The backend is built using:
- Django REST Framework
- PostgreSQL (production)
- JWT authentication
- Deployed on Render
Backend is maintained in a separate repository for better service separation.


## Future Improvements
- Move access token to in-memory state instead of localStorage
- Add refresh token rotation
- Add global error handling UI
- Add loading states and skeleton components
- Add dashboard analytics


## License
This project is licensed under the MIT License.
