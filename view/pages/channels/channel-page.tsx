import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { api } from '../../client/api-client';
import ChannelSkeleton from '../../components/channels/channel-skeleton';
import ChannelView from '../../components/channels/channel-view';

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
    return <Typography>{t('errors.somethingWentWrong')}</Typography>;
  }

  return <ChannelView channel={channelData.channel} />;
};
