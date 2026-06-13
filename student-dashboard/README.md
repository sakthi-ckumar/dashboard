# Progressive Student Dashboard - Full Stack Challenge

A full-stack web application that tracks student progress across courses, recommends next steps, and visualizes learning insights.

## Tech Stack

- Frontend: React.js, Vite, Axios, Recharts
- Backend: Node.js, Express.js, MongoDB, JWT
- Database: MongoDB

## Features

- Email/password authentication
- Student and mentor roles
- Protected dashboard route
- Completed lessons summary
- Total time spent summary
- Course progress distribution chart
- Time-series learning trend chart
- Adaptive recommendation API
- Seeded sample data
- Responsive UI

## Project Structure

```txt
student-dashboard/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── api.js
    │   ├── main.jsx
    │   └── style.css
    ├── index.html
    └── package.json
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Backend URL:

```txt
http://localhost:5000
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

## Demo Login

```txt
Email: student@example.com
Password: 123456
```

## API Endpoints

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
```

### Dashboard

```txt
GET /api/dashboard/summary
GET /api/dashboard/trend
GET /api/dashboard/lessons
GET /api/dashboard/recommendations
```

All dashboard APIs require JWT token in the Authorization header.

```txt
Authorization: Bearer <token>
```

## Interview Explanation

For this challenge, I built a Progressive Student Dashboard as a full-stack application. The objective is to track student learning progress across courses and provide useful insights.

On the frontend side, I used React.js with Vite. I created a login page, protected dashboard page, progress cards, a trend chart, and a course completion pie chart. I used Axios for API integration and Recharts for visual analytics.

On the backend side, I used Node.js, Express.js, MongoDB, and JWT authentication. I created APIs for login, dashboard summary, time-series trend data, lesson details, and recommendations.

For security, I implemented JWT-based authentication and role-based user structure. For dashboard insights, I calculated completed lessons, total time spent, course-wise progress, and daily learning trends using MongoDB aggregation.
