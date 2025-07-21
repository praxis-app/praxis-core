import { NavigationPaths } from '@/constants/shared.constants';
import { useAppStore } from '@/store/app.store';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthType, ClientEvent, createClient, SyncState } from 'matrix-js-sdk';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { LoginForm } from '../login-form';

vi.mock('@/store/app.store');
vi.mock('react-router-dom');
vi.mock('react-i18next');
vi.mock('matrix-js-sdk');

describe('LoginForm', () => {
  const mockSetMatrixClient = vi.fn();
  const mockNavigate = vi.fn();
  const mockTranslate = vi.fn((key: string) => key);
  const mockLoginRequest = vi.fn();
  const mockStartClient = vi.fn();
  const mockOnce = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useAppStore
    (useAppStore as unknown as Mock).mockReturnValue({
      setMatrixClient: mockSetMatrixClient,
    });

    // Mock useNavigate
    (useNavigate as Mock).mockReturnValue(mockNavigate);

    // Mock useTranslation
    (useTranslation as Mock).mockReturnValue({
      t: mockTranslate,
    });

    // Mock createClient - always return same object with all methods
    (createClient as Mock).mockReturnValue({
      loginRequest: mockLoginRequest,
      startClient: mockStartClient,
      once: mockOnce,
    });

    // Reset localStorage mock
    localStorage.setItem = vi.fn();
  });

  it('handles successful login flow', async () => {
    const user = userEvent.setup();
    const mockUserData = {
      user_id: '@test:example.com',
      access_token: 'mock_token',
      device_id: 'mock_device',
    };

    mockLoginRequest.mockResolvedValue(mockUserData);
    mockStartClient.mockResolvedValue(undefined);

    // Mock the once method to immediately call the callback with SyncState.Prepared
    mockOnce.mockImplementation(
      (event: string, callback: (state: SyncState) => void) => {
        if (event === ClientEvent.Sync) {
          callback(SyncState.Prepared);
        }
      },
    );

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('auth.labels.email');
    const passwordInput = screen.getByLabelText('auth.labels.password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLoginRequest).toHaveBeenCalledWith({
        user: 'test@example.com',
        password: 'password123',
        type: AuthType.Password,
      });
    });

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user_id',
        mockUserData.user_id,
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'access_token',
        mockUserData.access_token,
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'device_id',
        mockUserData.device_id,
      );
    });

    await waitFor(() => {
      expect(createClient).toHaveBeenCalledTimes(2);
      expect(createClient).toHaveBeenNthCalledWith(1, {
        baseUrl: import.meta.env.VITE_SERVER_BASE_URL,
      });
      expect(createClient).toHaveBeenNthCalledWith(2, {
        baseUrl: import.meta.env.VITE_SERVER_BASE_URL,
        accessToken: mockUserData.access_token,
        userId: mockUserData.user_id,
        deviceId: mockUserData.device_id,
      });
    });

    await waitFor(() => {
      expect(mockStartClient).toHaveBeenCalledWith({
        initialSyncLimit: 10,
      });
    });

    await waitFor(() => {
      expect(mockSetMatrixClient).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(NavigationPaths.Home);
    });
  });

  it('handles failed login and displays an error message', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid email or password. Please try again.';

    mockLoginRequest.mockRejectedValue(new Error('Login failed'));

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('auth.labels.email');
    const passwordInput = screen.getByLabelText('auth.labels.password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    // Suppress console.error during test to prevent error output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      return;
    });

    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLoginRequest).toHaveBeenCalledWith({
        user: 'wrong@example.com',
        password: 'wrongpassword',
        type: AuthType.Password,
      });
    });

    // Restore console.error
    consoleSpy.mockRestore();

    await waitFor(() => {
      const errorElement = screen.getByText(errorMessage);
      expect(errorElement).toBeInTheDocument();
    });

    expect(mockSetMatrixClient).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
