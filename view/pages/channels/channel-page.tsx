import { api } from '@/client/api-client';
import { ChannelView } from '@/components/channels/channel-view';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export const ChannelPage = () => {
  const { channelId } = useParams();

  const { data: channelData } = useQuery({
    queryKey: ['channels', channelId],
    queryFn: () => api.getChannel(channelId!),
    enabled: !!channelId,
  });

  return <ChannelView channel={channelData?.channel} />;
};
