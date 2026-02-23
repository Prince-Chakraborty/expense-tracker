const Redis = require('ioredis');
require('dotenv').config();

const redisConfig = process.env.REDIS_URL
  ? process.env.REDIS_URL
  : {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    };

const redis = new Redis(redisConfig);

redis.on('connect', () => {
  console.log('Redis connected successfully');
});
redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

module.exports = redis;