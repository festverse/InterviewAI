const PeerRoom = require('../models/PeerRoom');

module.exports = (io, socket) => {
  socket.on('join-room', async (roomId) => {
    try {
      const room = await PeerRoom.findOne({ roomId }).populate('participants', 'name email');
      if (!room) {
        return socket.emit('room-error', { message: 'Room not found' });
      }

      socket.join(roomId);
      socket.currentRoomId = roomId;

      socket.emit('room-joined', { room });

      const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
      if (socketsInRoom && socketsInRoom.size === 2) {
        io.to(roomId).emit('both-joined');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('room-error', { message: 'Server error joining room' });
    }
  });

  socket.on('start-interview', async (roomId) => {
    try {
      await PeerRoom.findOneAndUpdate({ roomId }, { status: 'active' });
      io.to(roomId).emit('interview-started');
    } catch (error) {
      console.error('Error starting interview:', error);
    }
  });

  socket.on('next-question', async (roomId) => {
    try {
      const room = await PeerRoom.findOneAndUpdate(
        { roomId },
        { $inc: { currentQuestion: 1 } },
        { new: true }
      );
      if (room) {
        io.to(roomId).emit('question-changed', { currentQuestion: room.currentQuestion });
      }
    } catch (error) {
      console.error('Error changing question:', error);
    }
  });

  socket.on('swap-roles', async (roomId) => {
    try {
      const room = await PeerRoom.findOne({ roomId });
      if (room && !room.swapped) {
        const temp = room.roles.interviewer;
        room.roles.interviewer = room.roles.interviewee;
        room.roles.interviewee = temp;
        room.swapped = true;
        await room.save();
        
        // Re-populate if needed, but the client mostly needs roles update
        io.to(roomId).emit('roles-swapped', { room });
      }
    } catch (error) {
      console.error('Error swapping roles:', error);
    }
  });

  socket.on('submit-transcript', ({ roomId, data }) => {
    socket.to(roomId).emit('transcript-updated', data);
  });

  socket.on('sync-code', ({ roomId, code }) => {
    socket.to(roomId).emit('code-sync', { userId: socket.userId, code });
  });

  socket.on('submit-code', async ({ roomId, code }) => {
    try {
      const room = await PeerRoom.findOne({ roomId });
      if (room && room.status === 'active') {
        const { enqueueSubmission } = require('../services/queueService');
        // Currently hardcoding test cases from the competitive assignment in matchmaking
        const currentQuestionObj = room.questions[0]; 
        
        await enqueueSubmission(roomId, socket.userId, code, currentQuestionObj?.testCases || []);
        
        // Let the client know it's in the queue
        socket.emit('submission-queued');
      }
    } catch (error) {
      console.error('Submit code error:', error);
    }
  });

  socket.on('end-interview', async (roomId) => {
    try {
      await PeerRoom.findOneAndUpdate({ roomId }, { status: 'completed' });
      io.to(roomId).emit('interview-ended');
    } catch (error) {
      console.error('Error ending interview:', error);
    }
  });

  socket.on('disconnect', () => {
    if (socket.currentRoomId) {
      socket.to(socket.currentRoomId).emit('partner-disconnected');
    }
  });
};
