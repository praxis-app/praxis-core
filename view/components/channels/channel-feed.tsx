import { LocalStorageKeys } from '@/constants/shared.constants';
import { useInView } from '@/hooks/use-in-view';
import { useScrollDirection } from '@/hooks/use-scroll-direction';
import { useAppStore } from '@/store/app.store';
import { Message as MessageType } from '@/types/message.types';
import { RefObject, UIEvent, useRef, useState } from 'react';
import { Message } from '../messages/message';
import WelcomeMessage from '../invites/welcome-message';

interface Props {
  messages: MessageType[];
  feedBoxRef: RefObject<HTMLDivElement>;
  onLoadMore: () => void;
}

export const ChannelFeed = ({ messages, feedBoxRef, onLoadMore }: Props) => {
  const { isLoggedIn } = useAppStore((state) => state);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(
    !isLoggedIn && !localStorage.getItem(LocalStorageKeys.HideWelcomeMessage),
  );

  const scrollDirection = useScrollDirection(feedBoxRef, 800);
  const feedTopRef = useRef<HTMLDivElement>(null);

  const { setViewed } = useInView(feedTopRef, '50px', () => {
    if (scrollPosition < -50 && scrollDirection === 'up') {
      setViewed(false);
      onLoadMore();
    }
  });

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollPosition(target.scrollTop);
  };

  return (
    <div
      ref={feedBoxRef}
      className="flex flex-1 flex-col-reverse overflow-y-scroll p-2.5 pb-4"
      onScroll={handleScroll}
    >
      {showWelcomeMessage && (
        <WelcomeMessage onDismiss={() => setShowWelcomeMessage(false)} />
      )}

      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {/* Bottom is top due to `column-reverse` */}
      <div ref={feedTopRef} className="pb-2.5" />
    </div>
  );
};
