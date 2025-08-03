import { useAppStore } from '@/store/app.store';
import { Message } from '@/types/message.types';
import { render, screen, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { ChannelFeed } from '../channel-feed';

vi.mock('@/store/app.store');
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  initReactI18next: vi.fn(),
}));
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));
vi.mock('@/hooks/use-in-view', () => ({
  useInView: vi.fn(() => ({
    inView: false,
    setInView: vi.fn(),
    viewed: false,
    setViewed: vi.fn(),
  })),
}));
vi.mock('@/hooks/use-scroll-direction', () => ({
  useScrollDirection: vi.fn(() => 'down'),
}));
vi.mock('@/lib/shared.utils', () => ({
  throttle: vi.fn((fn) => fn),
  debounce: vi.fn((fn) => Object.assign(fn, { clear: vi.fn() })),
  cn: vi.fn((...args) => args.join(' ')),
  t: vi.fn((key) => key),
  getWebSocketURL: vi.fn(() => 'ws://localhost:3001/ws'),
  getRandomString: vi.fn(() => 'random-string'),
}));
vi.mock('../invites/welcome-message', () => ({
  WelcomeMessage: ({ onDismiss }: { onDismiss: () => void }) => (
    <div data-testid="welcome-message">
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  ),
}));
vi.mock('../messages/message', () => ({
  Message: ({ message }: { message: Message }) => (
    <div data-testid={`message-${message.id}`}>{message.body}</div>
  ),
}));
vi.mock('@/components/shared/formatted-text', () => ({
  FormattedText: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('ChannelFeed', () => {
  const mockOnLoadMore = vi.fn();
  const mockFeedBoxRef = { current: document.createElement('div') };
  const mockMessages: Message[] = [
    {
      id: '1',
      body: 'Hello world',
      user: { id: 'user1', name: 'John Doe' },
      createdAt: '2023-12-01T12:00:00Z',
    },
    {
      id: '2',
      body: 'Another message',
      user: { id: 'user2', name: 'Jane Smith' },
      createdAt: '2023-12-01T12:05:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useAppStore
    (useAppStore as unknown as Mock).mockReturnValue({
      isLoggedIn: true,
      isAppLoading: false,
    });

    // Reset localStorage mock
    localStorage.getItem = vi.fn();
    localStorage.setItem = vi.fn();
  });

  it('renders messages in feed correctly', () => {
    act(() => {
      render(
        <ChannelFeed
          messages={mockMessages}
          feedBoxRef={mockFeedBoxRef}
          onLoadMore={mockOnLoadMore}
        />,
      );
    });

    // Verify user names are displayed in the message feed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    // Verify the feed container has proper scroll styling for message feed
    const scrollContainer = document.querySelector('.overflow-y-scroll');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('flex-col-reverse');

    // Verify multiple messages are rendered (2 message containers)
    const messageContainers = document.querySelectorAll('.flex.gap-4');
    expect(messageContainers).toHaveLength(2);
  });
});
