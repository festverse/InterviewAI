const { Worker } = require('bullmq');
const { redisOptions } = require('../services/queueService');
const PeerRoom = require('../models/PeerRoom');
const eloService = require('../services/eloService');

const initWorker = (io) => {
  const worker = new Worker('submissions', async job => {
    const { roomId, userId, code, testCases } = job.data;
    console.log(`[Worker] Processing job ${job.id} for room ${roomId}`);

    // Mock Judge0 Execution Service
    const executionTime = Math.floor(Math.random() * 1500) + 500; // 500ms - 2000ms delay
    
    await new Promise(resolve => setTimeout(resolve, executionTime));

    // Simple mock evaluation
    // We check if code contains "return [0, 1]" or similar for Two Sum to mock a pass
    let passed = false;
    let message = "Wrong Answer";

    // Basic heuristic to mock passing Two Sum
    const cleanCode = code.replace(/\s+/g, '');
    if (cleanCode.includes('return[0,1]') || cleanCode.includes('return[1,2]')) {
      // Just a mock! In reality we would run Judge0 against each test case.
      passed = true;
      message = "Accepted";
    }

    let eloChange = 0;

    if (passed) {
      // If passed, they win the match against the other person (who hasn't finished yet)
      const room = await PeerRoom.findOne({ roomId }).populate('participants');
      
      if (room && room.status !== 'completed') {
        const winnerId = userId;
        const loser = room.participants.find(p => p._id.toString() !== winnerId);
        
        if (loser) {
          const winnerUser = room.participants.find(p => p._id.toString() === winnerId);
          const results = await eloService.updateRatings(winnerUser._id, loser._id, 1); // 1 = winner wins
          eloChange = results.winner.ratingChange;
        }

        room.status = 'completed';
        await room.save();
      }
    }

    // Emit result back to the room
    io.to(roomId).emit('submission-result', {
      userId,
      passed,
      message,
      executionTime,
      eloChange
    });

    console.log(`[Worker] Finished job ${job.id} - ${message}`);

  }, { connection: redisOptions });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job.id} failed:`, err);
  });

  return worker;
};

module.exports = initWorker;
