import { LocalStorageKeys } from '@/constants/shared.constants';
import { useInView } from '@/hooks/use-in-view';
import { useScrollDirection } from '@/hooks/use-scroll-direction';
import { debounce, throttle } from '@/lib/shared.utils';
import { useAppStore } from '@/store/app.store';
import { Message as MessageType } from '@/types/message.types';
import {
  RefObject,
  UIEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WelcomeMessage } from '../invites/welcome-message';
import { Message } from '../messages/message';

interface Props {
  messages: MessageType[];
  feedBoxRef: RefObject<HTMLDivElement>;
  onLoadMore: () => void;
}

export const ChannelFeed = ({ messages, feedBoxRef, onLoadMore }: Props) => {
  const { isLoggedIn, isAppLoading } = useAppStore((state) => state);

  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollDirection = useScrollDirection(feedBoxRef, 800);
  const feedTopRef = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  // Create throttled function once and reuse it
  const throttledOnLoadMore = useRef(
    throttle(() => {
      onLoadMoreRef.current();
      console.log('⭐️ loading more');
    }, 1500),
  ).current;

  const { setViewed } = useInView(feedTopRef, '50px', () => {
    if (scrollPosition < -50 && scrollDirection === 'up') {
      setViewed(false);
      throttledOnLoadMore();
    }
  });

  // Debounced scroll handler to improve performance
  const debouncedSetScrollPosition = useMemo(
    () => debounce((position: number) => setScrollPosition(position), 16),
    [setScrollPosition],
  );

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    debouncedSetScrollPosition(target.scrollTop);
  };

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSetScrollPosition.clear();
    };
  }, [debouncedSetScrollPosition]);

  useEffect(() => {
    if (
      !isLoggedIn &&
      !isAppLoading &&
      !localStorage.getItem(LocalStorageKeys.HideWelcomeMessage)
    ) {
      setShowWelcomeMessage(true);
    }
  }, [isLoggedIn, isAppLoading]);

  return (
    <div
      ref={feedBoxRef}
      className="flex flex-1 flex-col-reverse gap-4.5 overflow-y-scroll p-2.5 pb-4"
      onScroll={handleScroll}
    >
      {showWelcomeMessage && (
        <WelcomeMessage onDismiss={() => setShowWelcomeMessage(false)} />
      )}

      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {/* Bottom is top due to `column-reverse` */}
      <div ref={feedTopRef} className="pb-0.5" />
    </div>
  );
};
