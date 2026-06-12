# 🎮 Tic Tac Toe — Setup & Deployment Guide

> **For Beginners** — Follow every step in order. Don't skip anything.

---

## 📁 Project Structure

```
tictactoe/
├── backend/
│   ├── models/
│   │   └── Room.js
│   ├── utils/
│   │   └── gameLogic.js
│   ├── server.js
│   ├── package.json
│   └── .env.example        ← copy this to .env
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── ConnectionBanner.jsx
    │   │   ├── GameBoard.jsx
    │   │   ├── Scoreboard.jsx
    │   │   └── VictoryOverlay.jsx
    │   ├── pages/
    │   │   ├── Welcome.jsx
    │   │   ├── Lobby.jsx
    │   │   ├── Game.jsx
    │   │   └── JoinRoom.jsx
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── socket.js
    │   ├── index.css
    │   └── index.js
    ├── package.json
    ├── tailwind.config.js
    └── .env.example        ← copy this to .env
```

---

## STEP 1 — Install Node.js

1. Go to https://nodejs.org
2. Download the **LTS version** (green button)
3. Install it (click Next through all prompts)
4. Open your terminal (Command Prompt on Windows, Terminal on Mac)
5. Verify by typing: `node --version`
   - You should see something like `v20.x.x`

---

## STEP 2 — Set Up MongoDB Atlas (Free)

1. Go to https://mongodb.com/atlas
2. Click **"Try Free"** and create an account
3. Choose **"Free"** plan (M0 Sandbox)
4. Pick any cloud provider and region close to you → click **"Create"**
5. Set up a database user:
   - Username: choose anything (e.g. `tictactoeuser`)
   - Password: generate a secure one — **SAVE IT**
   - Click **"Create User"**
6. Set up network access:
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** → Confirm
7. Get your connection string:
   - Click **"Connect"** on your cluster
   - Choose **"Drivers"**
   - Select Driver: **Node.js**, Version: **5.5 or later**
   - Copy the connection string — it looks like:
     ```
     mongodb+srv://tictactoeuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Add the database name before `?`:
     ```
     mongodb+srv://tictactoeuser:yourpassword@cluster0.xxxxx.mongodb.net/tictactoe?retryWrites=true&w=majority
     ```

---

## STEP 3 — Run the Backend Locally

1. Open terminal in the `tictactoe/backend` folder:
   ```
   cd tictactoe/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create your `.env` file:
   - Copy `.env.example` and rename it to `.env`
   - Fill in your MongoDB URI:
   ```
   PORT=4000
   MONGODB_URI=mongodb+srv://tictactoeuser:yourpassword@cluster0.xxxxx.mongodb.net/tictactoe?retryWrites=true&w=majority
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the backend:
   ```
   npm run dev
   ```
   You should see:
   ```
   ✅ MongoDB connected
   🚀 Server running on port 4000
   ```

---

## STEP 4 — Run the Frontend Locally

Open a **new terminal window** (keep the backend running).

1. Navigate to frontend:
   ```
   cd tictactoe/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create your `.env` file:
   - Copy `.env.example` and rename it to `.env`
   ```
   REACT_APP_BACKEND_URL=http://localhost:4000
   REACT_APP_SOCKET_URL=http://localhost:4000
   ```

4. Start the frontend:
   ```
   npm start
   ```
   Browser will open at http://localhost:3000 automatically.

---

## STEP 5 — Test Locally

1. Open http://localhost:3000 in **two different browser tabs** (or two browsers)
2. In Tab 1: Wait for the room to be created, copy the **Team Code**
3. In Tab 2: Paste the Team Code in the "Join" field → click Join
4. Both tabs should now show the game board — play!

---

## STEP 6 — Deploy Backend to Render

1. Push your project to GitHub:
   - Create a free account at https://github.com
   - Create a new repository named `tictactoe`
   - Upload your project (or use GitHub Desktop)

2. Go to https://render.com and sign up (free)

3. Click **"New +"** → **"Web Service"**

4. Connect your GitHub repository

5. Configure the service:
   - **Name:** `tictactoe-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

6. Add Environment Variables (click "Environment"):
   ```
   PORT = 4000
   MONGODB_URI = (your full MongoDB Atlas URI)
   FRONTEND_URL = https://your-frontend.vercel.app
   ```
   ⚠️ You'll update FRONTEND_URL after deploying frontend in Step 7.

7. Click **"Create Web Service"**

8. Wait for deploy (~3 minutes). Copy your Render URL:
   ```
   https://tictactoe-backend-xxxx.onrender.com
   ```

---

## STEP 7 — Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up (free, use GitHub login)

2. Click **"New Project"**

3. Import your GitHub repository

4. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App

5. Add Environment Variables:
   ```
   REACT_APP_BACKEND_URL = https://tictactoe-backend-xxxx.onrender.com
   REACT_APP_SOCKET_URL = https://tictactoe-backend-xxxx.onrender.com
   ```

6. Click **"Deploy"**

7. Wait (~2 minutes). Copy your Vercel URL:
   ```
   https://tictactoe-frontend-xxxx.vercel.app
   ```

---

## STEP 8 — Update Backend CORS

Go back to Render → your backend service → Environment:

Update:
```
FRONTEND_URL = https://tictactoe-frontend-xxxx.vercel.app
```

Click **"Save Changes"** — Render will redeploy automatically.

---

## ✅ You're Live!

Share `https://tictactoe-frontend-xxxx.vercel.app` with your friend and play!

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| "Room not found" error | Check backend is running and MONGODB_URI is correct |
| Can't connect to backend | Make sure REACT_APP_BACKEND_URL points to Render URL |
| Moves not syncing | Check FRONTEND_URL in backend .env matches your Vercel URL exactly |
| MongoDB connection error | Check IP whitelist — set to Allow Access from Anywhere |
| Render backend sleeping | Free tier sleeps after 15min — first load is slow (30-60s) |

---

## 💡 Tips

- **Render free tier** sleeps after 15 minutes of inactivity. The first game of the day may take 30-60 seconds to connect. This is normal!
- To avoid the sleep, you can upgrade to Render's $7/month plan.
- MongoDB Atlas free tier gives you 512MB — plenty for thousands of games.
