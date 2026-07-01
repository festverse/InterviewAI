# InterviewAI 🎙️
*Your Personal AI Mock Interviewer & Peer-to-Peer Coding Platform*

InterviewAI is a comprehensive full-stack MERN application designed to help software engineers ace their next technical interview. Whether you want to practice answering behavioral questions with a real-time AI coach or battle a peer in a live competitive coding challenge, InterviewAI provides the perfect environment to hone your skills.

## 🌟 Key Features

* **Real-time AI Voice Interviews**: 
  * Uses the browser's native Web Speech API to seamlessly convert your voice to text.
  * AI evaluates your answers using Groq's ultra-fast Llama-3 API.
  * Receive instant, granular feedback on clarity, technical depth, structure, and filler words.
* **Peer-to-Peer Mock Interviews**:
  * Live WebSocket matchmaking queue connects you with engineers practicing similar skills.
  * Synchronized real-time interview rooms with split-screen roles.
* **Competitive Algorithm Battles (ELO System)**:
  * Integrated Monaco Editor (VS Code engine) for live coding.
  * Background code execution queues powered by Redis and BullMQ.
  * Earn ELO points and climb the global, real-time leaderboard!
* **Scalable Architecture**:
  * Asynchronous job processing to evaluate untrusted code safely.
  * JWT-based secure authentication.
  * Rate-limited API routes for robust security.

## 🛠️ Tech Stack

**Frontend**
- **React.js (Vite)**: Lightning fast UI.
- **Zustand**: Lightweight global state management.
- **Socket.io-client**: Real-time bidirectional event handling.
- **Monaco Editor**: Powerful in-browser IDE experience.
- **Recharts**: Data visualization for performance metrics.
- **CSS Modules**: Scoped, modular CSS styling.

**Backend**
- **Node.js & Express**: High-performance REST API.
- **MongoDB & Mongoose**: Flexible NoSQL database and ORM.
- **Redis & BullMQ**: In-memory data store for highly reliable background job queues.
- **Socket.io**: Real-time room synchronization and matchmaking.
- **Groq SDK (Llama-3)**: Blazing fast LLM inference.
- **Bcrypt & JWT**: Secure password hashing and stateless authentication.

## 📂 Project Structure

```
interview-coach/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Main route views (Dashboard, Solo, Peer, Leaderboard)
│   │   ├── store/              # Zustand global state stores
│   │   ├── styles/             # Global CSS variables and utility classes
│   │   └── utils/              # Helper functions (API requests, formatting)
│   └── vercel.json             # Vercel deployment configuration
└── server/                     # Node.js/Express Backend
    ├── src/
    │   ├── controllers/        # Request handlers for API routes
    │   ├── models/             # Mongoose database schemas (User, PeerRoom, Leaderboard)
    │   ├── routes/             # Express API route definitions
    │   ├── services/           # Business logic (Groq AI, BullMQ Queues, ELO Calculation)
    │   ├── socket/             # WebSocket event handlers for matchmaking and rooms
    │   └── workers/            # BullMQ background job processors
    └── server.js               # Application entry point
```

## 🚀 Deployment Architecture

This application is architected to be deployed entirely for free using the following stack:

* **Frontend (Vercel)**
  - Set the Root Directory to `client`.
  - Set `VITE_API_URL` to your backend production URL.
  - Vercel automatically uses the `vercel.json` file for client-side routing.
* **Backend (Render)**
  - Set the Root Directory to `server`.
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Set all environment variables (including `NODE_ENV=production`).
* **Database (MongoDB Atlas)**
  - Ensure your IP Access List is set to allow connections from `0.0.0.0/0`.
* **Queue (Upstash Redis)**
  - Provides the `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD` for background execution tasks.

## 💻 Local Development

### 1. Prerequisites
- Node.js (v18+)
- Local or Cloud MongoDB Database
- Local Redis Server (or an Upstash cloud Redis instance)

### 2. Installation
Clone the repository and install all dependencies for both client and server:
```bash
git clone https://github.com/festverse/InterviewAI.git
cd InterviewAI
npm run install:all
```

### 3. Environment Configuration
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=super_secret_jwt_key
GROQ_API_KEY=your_free_groq_api_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Redis Configuration (For BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_upstash_password_if_applicable
```

### 4. Run the App
Start both the React frontend and Express backend concurrently:
```bash
npm run dev
```
