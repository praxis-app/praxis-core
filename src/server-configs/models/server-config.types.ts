export interface UpdateServerConfigReq {
  botClientId?: string | null;
  botApiUrl?: string | null;
}

export interface ConnectBotReq {
  botClientId: string;
  botApiUrl: string;
}

export interface RegisterPraxisInstanceRes {
  botApiKey: string;
}
