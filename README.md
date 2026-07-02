# 🤖 AI Interview Coach

An AI-powered mock interview platform that helps users practice technical and HR interviews with real-time AI-generated questions, answer evaluation, and personalised feedback.

🌐 **Live Demo:** https://ai-coach-one-ebon.vercel.app  
💻 **Frontend:** Vercel  
⚙️ **Backend:** Render  
🗄️ **Database:** MongoDB Atlas

---

## 🚀 Features

### 🔐 Authentication System
- User Signup & Login
- JWT-based Authentication
- Protected Routes
- Local Storage Session Management
- Show/Hide Password Functionality

### 🤖 AI Mock Interviews
- JavaScript Interview Mode
- React Interview Mode
- Node.js Interview Mode
- MongoDB Interview Mode
- HR Interview Mode

### 🧠 Smart AI Evaluation
- AI asks one question at a time
- Scores each answer out of 10
- Provides strengths and improvement areas
- Generates a final interview report

### 🎨 User Experience
- Responsive Design
- Typing Animation for AI Responses
- Modern UI with Smooth Interactions
- Mobile-Friendly Layout

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Context API
- Axios
- React Markdown
- React Icons
- CSS3

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- MongoDB
- Mongoose
- Groq API

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## 📂 Project Structure

```bash
AI-INTERVIEW-COACH
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── backend
    ├── config
    │   └── db.js
    │
    ├── controllers
    │   └── authController.js
    │
    ├── models
    │   └── User.js
    │
    ├── routes
    │   └── authRoutes.js
    │
    ├── middleware
    │   └── authMiddleware.js
    │
    └── server.js
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/sanskarb128-boop/AI-COACH.git
cd AI-COACH
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GROQ_API_KEY=your_groq_api_key
```

Start backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create:

```env
VITE_API_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

---

## 🔒 Authentication Flow

```text
User Signup
      ↓
Password Hashing (bcrypt)
      ↓
MongoDB Storage
      ↓
User Login
      ↓
JWT Token Generation
      ↓
Local Storage Session
      ↓
Protected Routes
      ↓
Access AI Interview Coach
```

---

## 🎯 Future Improvements

- Save Interview History
- User Dashboard
- Previous Score Analytics
- Download Report as PDF
- Voice-Based Interviews
- Google Authentication
- Leaderboards
- Interview Timer
- Resume-Based Custom Interviews

---

## 🏆 Achievements

Built as a full-stack MERN project to simulate real-world technical interview preparation using AI-powered feedback and modern authentication practices.

---

## 👨‍💻 Author

### Sanskar Bhatt

📧 Email: sanskarb128@gmail.com

🔗 LinkedIn:  
https://www.linkedin.com/in/sanskar-bhatt-37b76136b

💻 GitHub:  
https://github.com/sanskarb128-boop

---
⭐ If you like this project, consider giving it a star!
