require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const initWorker = require('./src/workers/judgeWorker');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

const initSocket = require('./src/socket/index');
const io = initSocket(server);
initWorker(io);

// Start server
const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health\n`);
  });
};

startServer();
