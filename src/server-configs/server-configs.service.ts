import axios from 'axios';
import crypto from 'crypto';
import * as dotenv from 'dotenv';
import { dataSource } from '../database/data-source';
import { ServerConfig } from './models/server-config.entity';
import {
  ConnectBotReq,
  RegisterPraxisInstanceRes,
  UpdateServerConfigReq,
} from './models/server-config.types';

dotenv.config();

const serverConfigRepository = dataSource.getRepository(ServerConfig);

export const getServerConfig = async () => {
  const serverConfigs = await serverConfigRepository.find();
  if (!serverConfigs.length) {
    return initializeServerConfig();
  }
  return serverConfigs[0];
};

export const initializeServerConfig = async () => {
  return serverConfigRepository.save({});
};

export const updateServerConfig = async (data: UpdateServerConfigReq) => {
  const serverConfig = await getServerConfig();
  return serverConfigRepository.update(serverConfig.id, data);
};

const getInstanceApiUrl = () => {
  const appApiProtocol =
    process.env.NODE_ENV === 'production' ? 'https' : 'http';

  return `${appApiProtocol}://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`;
};

export const connectBot = async (data: ConnectBotReq) => {
  const serverConfig = await getServerConfig();

  const apiKey = crypto.randomBytes(32).toString('hex');
  const botApiUrl = data.botApiUrl.replace(/\/$/, '');

  const result = await axios.post<RegisterPraxisInstanceRes>(
    `${botApiUrl}/praxis-instances`,
    {
      serverConfigId: serverConfig.id,
      apiUrl: getInstanceApiUrl(),
      apiKey,
    },
    { headers: { 'Content-Type': 'application/json' } },
  );

  return serverConfigRepository.update(serverConfig.id, {
    botApiKey: result.data.botApiKey,
    botClientId: data.botClientId,
    botApiUrl,
    apiKey,
  });
};

export const disconnectBot = async () => {
  const serverConfig = await getServerConfig();

  // Remove the Praxis instance registration from the bot
  await axios.delete(`${serverConfig.botApiUrl}/praxis-instances`, {
    headers: { 'x-api-key': serverConfig.apiKey },
  });

  // Remove the Praxis instance registration from the server config
  return serverConfigRepository.update(serverConfig.id, {
    botApiKey: null,
    botClientId: null,
    botApiUrl: null,
    apiKey: null,
  });
};

export const checkBotConnection = async () => {
  const serverConfig = await getServerConfig();

  const { data } = await axios.get(
    `${serverConfig.botApiUrl}/praxis-instances/check-connection`,
    {
      headers: { 'x-api-key': serverConfig.apiKey },
    },
  );

  return data.isConnected;
};
