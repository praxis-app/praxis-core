import { Box, debounce } from '@mui/material';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { api } from '../../client/api-client';
import ChannelTopNav from '../../components/channels/channel-top-nav';
import MessageFeed from '../../components/messages/message-feed';
import MessageForm from '../../components/messages/message-form';
import LeftNav from '../../components/nav/left-nav/left-nav';
import { GENERAL_CHANNEL_NAME } from '../../constants/channel.constants';
import { useAboveBreakpoint, useSubscription } from '../../hooks/shared.hooks';
import { useMeQuery } from '../../hooks/user.hooks';
import { useAppStore } from '../../store/app.store';
import { Channel } from '../../types/channel.types';
import { Message, MessagesQuery } from '../../types/message.types';
import { PubSubMessage } from '../../types/shared.types';
import ChannelSkeleton from './channel-skeleton';

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

const ChannelView = ({ channel, isGeneralChannel }: Props) => {
  const { isLoggedIn } = useAppStore((state) => state);

  const queryClient = useQueryClient();
  const feedBoxRef = useRef<HTMLDivElement>(null);
  const isAboveMd = useAboveBreakpoint('md');

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
    <Box display="flex" position="fixed" top={0} left={0} bottom={0} right={0}>
      {isAboveMd && <LeftNav me={meData?.user} />}

      <Box display="flex" flexDirection="column" flex={1}>
        <ChannelTopNav channel={channel} />
        <MessageFeed
          feedBoxRef={feedBoxRef}
          onLoadMore={debounce(fetchNextPage, 500)}
          messages={messagesData.pages.flatMap((page) => page.messages)}
        />
        <MessageForm
          channelId={channel.id}
          onSend={scrollToBottom}
          isGeneralChannel={isGeneralChannel}
        />
      </Box>
    </Box>
  );
};

export default ChannelView;
