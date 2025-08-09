import { api } from '@/client/api-client';
import { GENERAL_CHANNEL_NAME } from '@/constants/channel.constants';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useMeQuery } from '@/hooks/use-me-query';
import { useSubscription } from '@/hooks/use-subscription';
import { useAppStore } from '@/store/app.store';
import { Channel, FeedItem, FeedQuery } from '@/types/channel.types';
import { Message } from '@/types/message.types';
import { Proposal } from '@/types/proposal.types';
import { PubSubMessage } from '@/types/shared.types';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { MessageForm } from '../messages/message-form';
import { LeftNavDesktop } from '../nav/left-nav-desktop';
import { ChannelFeed } from './channel-feed';
import { ChannelTopNav } from './channel-top-nav';

enum MessageType {
  MESSAGE = 'message',
  IMAGE = 'image',
  PROPOSAL = 'proposal',
}

interface NewMessagePayload {
  type: MessageType.MESSAGE;
  message: Message;
}

interface NewProposalPayload {
  type: MessageType.PROPOSAL;
  proposal: Proposal;
}

interface ImageMessagePayload {
  type: MessageType.IMAGE;
  isPlaceholder: boolean;
  messageId: string;
  imageId: string;
}

interface Props {
  channel?: Channel;
  isGeneralChannel?: boolean;
}

export const ChannelView = ({ channel, isGeneralChannel }: Props) => {
  const { isLoggedIn } = useAppStore();
  const [isLastPage, setIsLastPage] = useState(false);

  const queryClient = useQueryClient();
  const feedBoxRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  const resolvedChannelId = isGeneralChannel
    ? GENERAL_CHANNEL_NAME
    : channel?.id;

  const { data: meData } = useMeQuery({
    enabled: isLoggedIn,
  });

  const { data: feedData, fetchNextPage } = useInfiniteQuery({
    queryKey: ['feed', resolvedChannelId],
    queryFn: async ({ pageParam }) => {
      const result = await api.getChannelFeed(resolvedChannelId!, pageParam);
      const isLast = result.feed.length === 0;
      if (isLast) {
        setIsLastPage(true);
      }
      return result;
    },
    getNextPageParam: (_lastPage, pages) => {
      return pages.flatMap((page) => page.feed).length;
    },
    initialPageParam: 0,
    enabled: !!resolvedChannelId,
  });

  useSubscription(`new-message-${channel?.id}-${meData?.user.id}`, {
    onMessage: (event) => {
      const { body }: PubSubMessage<NewMessagePayload | ImageMessagePayload> =
        JSON.parse(event.data);
      if (!body) {
        return;
      }

      // Update cache with new message, images are placeholders
      if (body.type === MessageType.MESSAGE) {
        const newFeedItem: FeedItem = {
          ...body.message,
          type: 'message',
        };
        queryClient.setQueryData<FeedQuery>(
          ['feed', resolvedChannelId],
          (oldData) => {
            if (!oldData) {
              return {
                pages: [{ feed: [newFeedItem] }],
                pageParams: [0],
              };
            }
            const pages = oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  feed: [newFeedItem, ...page.feed],
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
        queryClient.setQueryData<FeedQuery>(
          ['feed', resolvedChannelId],
          (oldData) => {
            if (!oldData) {
              return { pages: [], pageParams: [] };
            }

            const pages = oldData.pages.map((page) => {
              const feed = page.feed.map((item) => {
                if (item.type !== 'message') {
                  return item;
                }
                if (item.id !== body.messageId || !item.images) {
                  return item;
                }
                const images = item.images.map((image) =>
                  image.id === body.imageId
                    ? { ...image, isPlaceholder: false }
                    : image,
                );
                return { ...item, images } as FeedItem;
              });
              return { feed };
            });

            return { pages, pageParams: oldData.pageParams };
          },
        );
      }

      scrollToBottom();
    },
    enabled: !!meData && !!channel && !!resolvedChannelId,
  });

  useSubscription(`new-proposal-${channel?.id}-${meData?.user.id}`, {
    onMessage: (event) => {
      const { body }: PubSubMessage<NewProposalPayload> = JSON.parse(
        event.data,
      );
      if (!body) {
        return;
      }
      if (body.type === MessageType.PROPOSAL) {
        const newFeedItem: FeedItem = {
          ...(body.proposal as FeedItem & { type: 'proposal' }),
          type: 'proposal',
        };
        queryClient.setQueryData<FeedQuery>(
          ['feed', resolvedChannelId],
          (oldData) => {
            if (!oldData) {
              return { pages: [{ feed: [newFeedItem] }], pageParams: [0] };
            }
            const pages = oldData.pages.map((page, index) => {
              if (index === 0) {
                const exists = page.feed.some(
                  (it) => it.type === 'proposal' && it.id === newFeedItem.id,
                );
                if (exists) {
                  return page;
                }
                return { feed: [newFeedItem, ...page.feed] };
              }
              return page;
            });
            return { pages, pageParams: oldData.pageParams };
          },
        );
      }
      scrollToBottom();
    },
    enabled: !!meData && !!channel && !!resolvedChannelId,
  });

  // Reset isLastPage when switching channels
  useEffect(() => {
    if (resolvedChannelId) {
      setIsLastPage(false);
    }
  }, [resolvedChannelId]);

  const scrollToBottom = () => {
    if (feedBoxRef.current && feedBoxRef.current.scrollTop >= -200) {
      feedBoxRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 flex">
      {isDesktop && <LeftNavDesktop me={meData?.user} />}

      <div className="flex flex-1 flex-col">
        <ChannelTopNav channel={channel} />

        <ChannelFeed
          channelId={channel?.id}
          feedBoxRef={feedBoxRef}
          onLoadMore={fetchNextPage}
          feed={feedData?.pages.flatMap((page) => page.feed) ?? []}
          isLastPage={isLastPage}
        />

        <MessageForm
          channelId={channel?.id}
          isGeneralChannel={isGeneralChannel}
          onSend={scrollToBottom}
        />
      </div>
    </div>
  );
};
