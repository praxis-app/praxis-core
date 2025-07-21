import { List } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';
import { api } from '../../client/api-client';
import { GENERAL_CHANNEL_NAME } from '../../constants/channel.constants';
import { NavigationPaths } from '../../constants/shared.constants';
import { CurrentUser } from '../../types/user.types';
import ChannelListItem from './channel-list-item';

interface Props {
  me?: CurrentUser;
}

/**
 * Channel list component for the left navigation panel on desktop
 */
const ChannelList = ({ me }: Props) => {
  const { channelId } = useParams();
  const { pathname } = useLocation();

  const isRegistered = !!me && !me.anonymous;

  const { data: channelsData } = useQuery({
    queryKey: ['channels'],
    queryFn: api.getChannels,
    enabled: isRegistered,
  });

  const { data: generalChannelData } = useQuery({
    queryKey: ['channels', GENERAL_CHANNEL_NAME],
    queryFn: () => api.getGeneralChannel(),
    enabled: !isRegistered,
  });

  if (generalChannelData && !isRegistered) {
    return (
      <List sx={{ flex: 1, overflowX: 'scroll' }}>
        <ChannelListItem
          channel={generalChannelData.channel}
          isGeneralChannel
          isActive
        />
      </List>
    );
  }

  if (!channelsData) {
    return null;
  }

  return (
    <List sx={{ flex: 1, overflowY: 'scroll' }}>
      {channelsData.channels.map((channel) => {
        const isHome = pathname === NavigationPaths.Home;
        const isGeneral = channel.name === GENERAL_CHANNEL_NAME;
        const isActive = channelId === channel.id || (isHome && isGeneral);

        return (
          <ChannelListItem
            key={channel.id}
            channel={channel}
            isActive={isActive}
          />
        );
      })}
    </List>
  );
};

export default ChannelList;
