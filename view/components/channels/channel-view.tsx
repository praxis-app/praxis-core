import { useIsDesktop } from '@/hooks/use-is-desktop';
import { MessageForm } from '../messages/message-form';
import { LeftNavDesktop } from '../nav/left-nav-desktop';
import { ChannelFeed } from './channel-feed';
import { ChannelTopNav } from './channel-top-nav';
import { Channel } from '@/types/channel.types';
import { Message, MessagesQuery } from '@/types/message.types';
import { useAppStore } from '@/store/app.store';
import { useRef } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { GENERAL_CHANNEL_NAME } from '@/constants/channel.constants';
import { useMeQuery } from '@/hooks/use-me-query';
import { api } from '@/client/api-client';
import { useSubscription } from '@/hooks/use-subscription';
import { PubSubMessage } from '@/types/shared.types';
import { ChannelSkeleton } from './channel-skeleton';
import { debounce } from '@/lib/shared.utils';

enum MessageType {
  MESSAGE = 'message',
  IMAGE = 'image',
}

interface NewMessagePayload {
  type: MessageType.MESSAGE;
  message: Message;
}

interface ImageMessagePayload {
  type: MessageType.IMAGE;
  isPlaceholder: false;
  messageId: string;
  imageId: string;
}

interface Props {
  channel: Channel;
  isGeneralChannel?: boolean;
}

export const ChannelView = ({ channel, isGeneralChannel }: Props) => {
  const { isLoggedIn } = useAppStore();

  const queryClient = useQueryClient();
  const feedBoxRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  const resolvedChannelId = isGeneralChannel
    ? GENERAL_CHANNEL_NAME
    : channel.id;

  const { data: meData } = useMeQuery({
    enabled: isLoggedIn,
  });

  const { data: messagesData, fetchNextPage } = useInfiniteQuery({
    queryKey: ['messages', resolvedChannelId],
    queryFn: ({ pageParam }) => {
      return api.getChannelMessages(resolvedChannelId!, pageParam);
    },
    getNextPageParam: (_lastPage, pages) => {
      return pages.flatMap((page) => page.messages).length;
    },
    initialPageParam: 0,
    enabled: !!resolvedChannelId,
  });

  useSubscription(`new-message-${channel.id}-${meData?.user.id}`, {
    onMessage: (event) => {
      const { body }: PubSubMessage<NewMessagePayload | ImageMessagePayload> =
        JSON.parse(event.data);
      if (!body) {
        return;
      }

      // Update cache with new message, images are placeholders
      if (body.type === MessageType.MESSAGE) {
        queryClient.setQueryData<MessagesQuery>(
          ['messages', resolvedChannelId],
          (oldData) => {
            if (!oldData) {
              return {
                pages: [{ messages: [body.message] }],
                pageParams: [0],
              };
            }
            const pages = oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  messages: [body.message, ...page.messages],
                };
              }
              return page;
            });
            return { pages, pageParams: oldData.pageParams };
          },
        );
      }

      // Update cache with image status once uploaded
      if (body.type === MessageType.IMAGE) {
        queryClient.setQueryData<MessagesQuery>(
          ['messages', resolvedChannelId],
          (oldData) => {
            if (!oldData) {
              return { pages: [], pageParams: [] };
            }

            const pages = oldData.pages.map((page) => {
              const messages = page.messages.map((message) => {
                if (message.id !== body.messageId || !message.images) {
                  return message;
                }
                const images = message.images.map((image) => {
                  if (image.id !== body.imageId) {
                    return image;
                  }
                  return { ...image, isPlaceholder: false };
                });
                return { ...message, images };
              });
              return { messages };
            });

            return { pages, pageParams: oldData.pageParams };
          },
        );
      }

      scrollToBottom();
    },
    enabled: !!meData && !!resolvedChannelId,
  });

  const scrollToBottom = () => {
    if (feedBoxRef.current && feedBoxRef.current.scrollTop >= -200) {
      feedBoxRef.current.scrollTop = 0;
    }
  };

  if (!messagesData) {
    return <ChannelSkeleton />;
  }

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 flex">
      {isDesktop && <LeftNavDesktop />}

      <div className="flex flex-1 flex-col">
        <ChannelTopNav />

        <ChannelFeed
          feedBoxRef={feedBoxRef}
          onLoadMore={debounce(fetchNextPage, 500)}
          messages={messagesData.pages.flatMap((page) => page.messages)}
        />

        <MessageForm
          channelId={channel.id}
          isGeneralChannel={isGeneralChannel}
        />
      </div>
    </div>
  );
};
