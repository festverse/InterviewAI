const { Queue } = require('bullmq');

const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
};

const submissionQueue = new Queue('submissions', { connection: redisOptions });

const enqueueSubmission = async (roomId, userId, code, testCases) => {
  const job = await submissionQueue.add('evaluate-code', {
    roomId,
    userId,
    code,
    testCases
  });
  return job.id;
};

module.exports = {
  submissionQueue,
  enqueueSubmission,
  redisOptions
};
