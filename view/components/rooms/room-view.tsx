import { useIsDesktop } from '@/hooks/use-is-desktop';
import { Room } from 'matrix-js-sdk';
import { MessageForm } from '../messages/message-form';
import { LeftNavDesktop } from '../nav/left-nav-desktop';
import { RoomFeed } from './room-feed';
import { RoomTopNav } from './room-top-nav';

interface Props {
  room: Room;
}

export const RoomView = ({ room }: Props) => {
  const isDesktop = useIsDesktop();

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 flex">
      {isDesktop && <LeftNavDesktop />}

      <div className="flex flex-1 flex-col">
        <RoomTopNav room={room} />
        <RoomFeed room={room} />
        <MessageForm roomId={room.roomId} />
      </div>
    </div>
  );
};
