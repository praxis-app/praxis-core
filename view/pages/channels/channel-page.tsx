import { api } from '@/client/api-client';
import { ChannelSkeleton } from '@/components/channels/channel-skeleton';
import { ChannelView } from '@/components/channels/channel-view';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export const ChannelPage = () => {
  const { channelId } = useParams();
  const { t } = useTranslation();

  const { data: channelData, isLoading: isChannelLoading } = useQuery({
    queryKey: ['channels', channelId],
    queryFn: () => api.getChannel(channelId!),
    enabled: !!channelId,
  });

  if (isChannelLoading) {
    return <ChannelSkeleton />;
  }

  if (!channelData) {
    return <p>{t('errors.somethingWentWrong')}</p>;
  }

  return <ChannelView channel={channelData.channel} />;
};
