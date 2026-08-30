const { Queue } = require('bullmq');

const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_PASSWORD ? {} : undefined,
  maxRetriesPerRequest: null,
};

// Lazy-initialize the queue so the server doesn't crash when Redis isn't running.
// Auth and core features work without Redis; only peer-coding features need it.
let submissionQueue = null;

const getQueue = () => {
  if (!submissionQueue) {
    try {
      submissionQueue = new Queue('submissions', { connection: redisOptions });
    } catch (err) {
      console.warn('[QueueService] Redis not available — peer coding features disabled.', err.message);
      return null;
    }
  }
  return submissionQueue;
};

const enqueueSubmission = async (roomId, userId, code, testCases) => {
  const queue = getQueue();
  if (!queue) {
    throw new Error('Queue service is unavailable (Redis not connected).');
  }
  const job = await queue.add('evaluate-code', {
    roomId,
    userId,
    code,
    testCases
  });
  return job.id;
};

module.exports = {
  getQueue,
  enqueueSubmission,
  redisOptions
};
