import { LocalStorageKeys } from '@/constants/shared.constants';
import { useAppStore } from '@/store/app.store';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { ChannelFeed } from '../channel-feed';
import { Message } from '@/types/message.types';

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

  it('renders messages correctly', () => {
    render(
      <ChannelFeed
        messages={mockMessages}
        feedBoxRef={mockFeedBoxRef}
        onLoadMore={mockOnLoadMore}
      />,
    );

    // Test that the channel feed renders and shows user names
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    
    // Test that the scroll container is rendered with correct classes
    const scrollContainer = document.querySelector('.overflow-y-scroll');
    expect(scrollContainer).toBeInTheDocument();
  });

  it('shows welcome message when user is not logged in', () => {
    (useAppStore as unknown as Mock).mockReturnValue({
      isLoggedIn: false,
      isAppLoading: false,
    });
    localStorage.getItem = vi.fn().mockReturnValue(null);

    render(
      <ChannelFeed
        messages={mockMessages}
        feedBoxRef={mockFeedBoxRef}
        onLoadMore={mockOnLoadMore}
      />,
    );

    expect(screen.getByTestId('welcome-message')).toBeInTheDocument();
  });

  it('hides welcome message when dismissed', () => {
    (useAppStore as unknown as Mock).mockReturnValue({
      isLoggedIn: false,
      isAppLoading: false,
    });
    localStorage.getItem = vi.fn().mockReturnValue(null);

    render(
      <ChannelFeed
        messages={mockMessages}
        feedBoxRef={mockFeedBoxRef}
        onLoadMore={mockOnLoadMore}
      />,
    );

    const dismissButton = screen.getByText('Dismiss');
    fireEvent.click(dismissButton);

    expect(screen.queryByTestId('welcome-message')).not.toBeInTheDocument();
  });

  it('does not show welcome message when hideWelcomeMessage is in localStorage', () => {
    (useAppStore as unknown as Mock).mockReturnValue({
      isLoggedIn: false,
      isAppLoading: false,
    });
    localStorage.getItem = vi.fn().mockImplementation((key) => {
      if (key === LocalStorageKeys.HideWelcomeMessage) {
        return 'true';
      }
      return null;
    });

    render(
      <ChannelFeed
        messages={mockMessages}
        feedBoxRef={mockFeedBoxRef}
        onLoadMore={mockOnLoadMore}
      />,
    );

    expect(screen.queryByTestId('welcome-message')).not.toBeInTheDocument();
  });

  it('renders with correct scroll container class', () => {
    render(
      <ChannelFeed
        messages={mockMessages}
        feedBoxRef={mockFeedBoxRef}
        onLoadMore={mockOnLoadMore}
      />,
    );

    // Check that the main container has the expected classes for scrolling
    const scrollContainer = document.querySelector('.overflow-y-scroll');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('flex-col-reverse');
  });
});
