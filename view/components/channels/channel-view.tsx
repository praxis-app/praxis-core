import { useIsDesktop } from '@/hooks/use-is-desktop';
import { MessageForm } from '../messages/message-form';
import { LeftNavDesktop } from '../nav/left-nav-desktop';
import { ChannelFeed } from './channel-feed';
import { ChannelTopNav } from './channel-top-nav';
import { Channel } from '@/types/channel.types';

interface Props {
  channel: Channel;
  isGeneralChannel?: boolean;
}

export const ChannelView = ({ channel, isGeneralChannel }: Props) => {
  const isDesktop = useIsDesktop();

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 flex">
      {isDesktop && <LeftNavDesktop />}

      <div className="flex flex-1 flex-col">
        <ChannelTopNav />

        <ChannelFeed />

        <MessageForm
          channelId={channel.id}
          isGeneralChannel={isGeneralChannel}
        />
      </div>
    </div>
  );
};
