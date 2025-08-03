import { useAppStore } from '@/store/app.store';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { MessageForm } from '../message-form';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('@/store/app.store');
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
vi.mock('@/lib/shared.utils', () => ({
  throttle: vi.fn((fn) => fn),
  debounce: vi.fn((fn) => Object.assign(fn, { clear: vi.fn() })),
  cn: vi.fn((...args) => args.join(' ')),
  t: vi.fn((key) => key),
}));
vi.mock('@tanstack/react-query', async () => {
  const original = await vi.importActual('@tanstack/react-query');
  return {
    ...original,
    useQueryClient: () => ({
      setQueryData: vi.fn(),
    }),
    useQuery: vi.fn(() => ({ data: null, isPending: false })),
    useMutation: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  };
});

describe('MessageForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as unknown as Mock).mockClear();
  });

  it('should have a disabled textarea when the user is not logged in', () => {
    (useAppStore as unknown as Mock).mockReturnValue({
      isLoggedIn: false,
    });

    render(<MessageForm channelId="1" />);

    const textarea = screen.getByPlaceholderText('messages.placeholders.sendMessage');
    expect(textarea).toBeInTheDocument();
  });

  it('should enable the textarea and allow typing when the user is logged in', () => {
    (useAppStore as unknown as Mock).mockReturnValue({
      isLoggedIn: true,
    });

    render(<MessageForm channelId="1" />);

    const textarea = screen.getByPlaceholderText('messages.placeholders.sendMessage');
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: 'Hello, world!' } });
    expect(textarea).toHaveValue('Hello, world!');
  });
});
