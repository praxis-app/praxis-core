import { api } from '@/client/api-client';
import { ChannelView } from '@/components/channels/channel-view';
import { NavigationPaths } from '@/constants/shared.constants';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

export const ChannelPage = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();

  const { data: channelData } = useQuery({
    queryKey: ['channels', channelId],
    queryFn: async () => {
      try {
        const result = await api.getChannel(channelId!);
        return result;
      } catch (error) {
        await navigate(NavigationPaths.Home);
        console.error(error);
        return null;
      }
    },
    enabled: !!channelId,
  });

  return <ChannelView channel={channelData?.channel} />;
};
