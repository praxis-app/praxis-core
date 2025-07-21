import * as dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config();

const cacheClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

cacheClient.on('error', (error) => {
  console.error('Redis error', error);
});

export const initializeCache = async () => {
  await cacheClient.connect();
};

export const getSetMembers = async (key: string) => {
  return cacheClient.sMembers(key);
};

export const addSetMember = async (key: string, value: string) => {
  return cacheClient.sAdd(key, value);
};

export const removeSetMember = async (key: string, value: string) => {
  return cacheClient.sRem(key, value);
};
