import { Image } from './image.types';

export interface Message {
  id: string;
  body: string;
  images?: Image[];
  user: { id: string; name: string };
  createdAt: string;
}

export interface MessagesQuery {
  pages: { messages: Message[] }[];
  pageParams: number[];
}
