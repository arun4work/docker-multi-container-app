import { keys } from './keys.js';

import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { Pool } from 'pg';
import redis from 'redis';

// Express App setup
const PORT = 3000;
const app = express();
app.use(cors);
app.use(bodyParser.json());

// Postgress Client setup
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: Number(keys.pgPort),
  ssl:
    process.env.NODE_ENV !== 'production'
      ? false
      : { rejectUnauthorized: false },
});

pgClient.on('connect', (client) => {
  client
    .query('CREATE TABLE IF NOT EXIST values (number INT)')
    .catch((err) => console.error(err));
});

pgClient.on('error', () => console.error('Lost PG Connection.'));

// Redis Client setup
const redisClient = redis.createClient({
  socket: {
    host: keys.redisHost,
    port: Number(keys.redisPort),
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new Error('Retry attempts exhausted');
      }
      return 1000;
    },
  },
});

const redisPublisher = redisClient.duplicate();
// with type: module in package.json, we can use await outside of async function
await redisPublisher.connect(); // Remember: v4 requires manual connection

// Express route handlers

app.get('/', (req, res) => {
  res.send('Hi');
});

app.get('/api/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');
  res.send(values.rows);
});

app.get('/api/values/current', async (req, res) => {
  const values = await redisClient.hGetAll('values');
  res.send(values);
});

app.post('/api/values', async (req, res) => {
  const index = req.body.index;
  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }
  redisClient.hSet('values', index, '');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ message: 'Successful' });
});

app
  .listen(PORT, () => {
    console.log(`Server listening to port: ${PORT}`);
  })
  .on('error', (error) => {
    console.error(`Server failed to start: `, error);
  });
