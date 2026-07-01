const crypto = require('crypto');
const PeerRoom = require('../models/PeerRoom');
const { generateQuestions } = require('../services/questionService');

const queues = {
  technical: [],
  behavioral: [],
  competitive: []
};

module.exports = (io, socket) => {
  socket.on('join-queue', async (type) => {
    if (!type || !queues[type]) {
      type = 'technical';
    }

    // Add to queue if not already in it
    const existingIndex = queues[type].findIndex(s => s.userId === socket.userId);
    if (existingIndex === -1) {
      queues[type].push(socket);
    }

    if (queues[type].length >= 2) {
      const socket1 = queues[type].shift();
      const socket2 = queues[type].shift();

      try {
        // Generate questions
        let questions = [];
        if (type === 'competitive') {
          // Hardcoded coding question for Phase 6
          questions = [{
            question: "Two Sum",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
            testCases: [
              { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
              { input: "[3,2,4]\n6", expectedOutput: "[1,2]" }
            ],
            type: 'competitive'
          }];
        } else {
          questions = await generateQuestions(type, 'Software Engineer', 'mid', 4);
        }

        // Assign roles randomly
        const isUser1Interviewer = Math.random() > 0.5;
        const interviewer = isUser1Interviewer ? socket1.userId : socket2.userId;
        const interviewee = isUser1Interviewer ? socket2.userId : socket1.userId;

        const roomId = crypto.randomUUID();
        const peerRoom = new PeerRoom({
          roomId,
          participants: [socket1.userId, socket2.userId],
          roles: {
            interviewer,
            interviewee
          },
          interviewType: type,
          questions
        });

        await peerRoom.save();

        socket1.emit('match-found', { roomId, type });
        socket2.emit('match-found', { roomId, type });

      } catch (error) {
        console.error("Error creating match:", error);
        socket1.emit('queue-error', { message: 'Failed to generate questions and create room.' });
        socket2.emit('queue-error', { message: 'Failed to generate questions and create room.' });
      }
    }
  });

  const removeFromQueue = () => {
    for (const t of Object.keys(queues)) {
      queues[t] = queues[t].filter(s => s.id !== socket.id);
    }
  };

  socket.on('leave-queue', () => {
    removeFromQueue();
  });

  socket.on('disconnect', () => {
    removeFromQueue();
  });
};
