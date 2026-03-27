import { keys } from './keys.js';
import redis from 'redis';

const redisClient = redis.createClient({
  socket: {
    host: keys.redisHost,
    port: Number(keys.redisPort),
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new Error('Retry attempts exhausted');
      }
      return 1000; // reconnect after 1 second
    },
  },
});

const sub = redisClient.duplicate();
// with type: module in package.json, we can use await outside of async function
await redisClient.connect();
await sub.connect(); // Remember: v4 requires manual connection

function fib(index: number): number {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// sub.on('message', (channel: any, message: string) => {
//   redisClient.hSet('values', message, fib(parseInt(message)));
// });

// Provide the callback as the second argument
await sub.subscribe('insert', async (message, channel) => {
  console.log(`Received message: ${message} from ${channel}`);
  const index = parseInt(message);
  await redisClient.hSet('values', message, fib(index));
});
