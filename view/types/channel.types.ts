export interface Channel {
  id: string;
  name: string;
  description: string | null;
}

export interface CreateChannelReq {
  name: string;
  description?: string;
}

export interface UpdateChannelReq {
  name: string;
  description?: string;
}
