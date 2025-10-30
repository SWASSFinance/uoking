// Script to clear Redis cache if it exists
const { createClient } = require('redis');

async function clearRedisCache() {
  try {
    // Only try to connect if REDIS_URL is set
    if (!process.env.REDIS_URL) {
      console.log('No REDIS_URL found - Redis not configured');
      return;
    }

    const redis = createClient({
      url: process.env.REDIS_URL,
    });

    await redis.connect();
    console.log('Connected to Redis');

    // Clear all cache keys
    const keys = await redis.keys('*');
    if (keys.length > 0) {
      await redis.del(keys);
      console.log(`Cleared ${keys.length} cache keys`);
    } else {
      console.log('No cache keys found');
    }

    await redis.disconnect();
    console.log('Redis cache cleared successfully');
  } catch (error) {
    console.log('Redis not available or error:', error.message);
  }
}

clearRedisCache();

