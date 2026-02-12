import Queue from 'bull';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const eventQueue = new Queue('event-processing', redisUrl, {
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: true,
    removeOnFail: false
  }
});

// ✅ THIS IS CRITICAL - DEFAULT EXPORT
export default eventQueue;