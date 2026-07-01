# InterviewAI — Ace Your Next Interview

InterviewAI is a full-stack MERN application designed to act as your personal mock interview coach. Practice for your next big job by answering AI-generated questions in a Solo Interview, or pair up with a real human via our real-time Peer Matchmaking system!

## Features

- **Solo AI Interviews**: 
  - Dynamic question generation tailored to your target role (e.g., Frontend Engineer) and experience level.
  - In-browser Speech-to-Text records your answers automatically.
  - Intelligent feedback scoring your clarity, technical depth, structure, pacing, and filler words using Groq's ultra-fast Llama-3 API.
- **Peer-to-Peer Mock Interviews**:
  - Live matchmaking queue connects you with others practicing similar interview types.
  - Synchronized real-time interview room via Socket.io.
  - Live transcripts sync between peers, role swapping at the midpoint, and synchronized countdown timers.
- **Competitive Coding (ELO)**:
  - Battle other engineers in a live algorithm challenge.
  - Split-screen UI featuring the Monaco Editor (VS Code engine).
  - Background code execution queues powered by Redis and BullMQ.
  - Global ELO rating system and real-time paginated Leaderboard.

## Tech Stack

**Frontend (React/Vite)**
- React Router v6
- Zustand (State Management)
- Socket.io Client for real-time WebSockets
- Monaco Editor (`@monaco-editor/react`)
- Web Speech API for voice recognition and text-to-speech
- Recharts for data visualization
- CSS Modules for scoped styling

**Backend (Node.js/Express)**
- MongoDB + Mongoose for database
- Redis + BullMQ for background code execution queues
- Socket.io for matchmaking and room events
- Groq SDK (`llama-3.3-70b-versatile`) for AI generation and scoring
- JWT + bcrypt for secure authentication
- Helmet, Morgan, and Rate Limiting for security

## Getting Started (Local Development)

1. **Clone and Install**
   Navigate to the root directory and install dependencies for both client and server:
   ```bash
   npm run install:all
   ```

2. **Environment Variables**
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=super_secret_jwt_key
   GROQ_API_KEY=your_free_groq_api_key
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

3. **Run the Application**
   From the root directory, start both the frontend and backend concurrently:
   ```bash
   npm run dev
   ```

## Deployment

**Frontend (Vercel)**
- Connect your GitHub repo to Vercel.
- Set the Root Directory to `client/`.
- Vercel will automatically use the `vercel.json` file for client-side routing.
- Set `VITE_API_URL` to your backend production URL.

**Backend (Railway / Render)**
- Connect your GitHub repo to your platform of choice.
- Set the Root Directory to `server/`.
- The included `Procfile` and `package.json` will handle the build (`npm install`) and start (`npm start`) commands.
- Be sure to configure the Environment Variables in the platform dashboard.
