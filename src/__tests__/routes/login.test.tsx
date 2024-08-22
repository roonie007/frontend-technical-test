import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { AuthenticationContext } from '../../contexts/authentication';
import { LoginPage } from '../../routes/login';
import { renderWithRouter } from '../utils';

import type { AuthenticationState } from '../../contexts/authentication';
import type { ListenerFn, RouterEvents } from '@tanstack/react-router';

type RenderLoginPageParams = {
  authenticate?: (token: string) => void;
  authState?: AuthenticationState;
  currentPath?: string;
  onNavigate?: ListenerFn<RouterEvents['onBeforeNavigate']>;
};

describe('routes/login', () => {
  describe('LoginPage', () => {
    function renderLoginPage({
      authenticate = () => {},
      authState = { isAuthenticated: false },
      currentPath = '/login',
      onNavigate = () => {},
    }: RenderLoginPageParams = {}) {
      return renderWithRouter({
        component: LoginPage,
        currentUrl: currentPath,
        onNavigate,
        Wrapper: ({ children }) => (
          <ChakraProvider>
            <QueryClientProvider client={new QueryClient()}>
              <AuthenticationContext.Provider
                value={{
                  authenticate,
                  signout: () => {},
                  state: authState,
                }}
              >
                {children}
              </AuthenticationContext.Provider>
            </QueryClientProvider>
          </ChakraProvider>
        ),
      });
    }

    it('should update the token and redirect to the home page when the login is successful', async () => {
      const authenticateMock = vi.fn();
      renderLoginPage({ authenticate: authenticateMock });

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      act(() => {
        fireEvent.change(usernameInput, { target: { value: 'valid_user' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(authenticateMock).toHaveBeenCalledWith('dummy_token');
      });
    });

    it('should show an error message when the login is unsuccessful', async () => {
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      act(() => {
        fireEvent.change(usernameInput, { target: { value: 'invalid_user' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/wrong credentials/i)).toBeInTheDocument();
      });
    });

    it('should show an generic error message when an unknown error happens', async () => {
      renderLoginPage();

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      act(() => {
        fireEvent.change(usernameInput, { target: { value: 'error_user' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/an unknown error occured, please try again later/i)).toBeInTheDocument();
      });
    });

    it('should automatically redirect to the home page if the user is already authenticated if no redirect URL specified', async () => {
      const onBeforeNavigateMock = vi.fn();
      renderLoginPage({
        authState: {
          isAuthenticated: true,
          token: 'dummy_token',
          userId: 'dummy_user_id',
        },
        onNavigate: onBeforeNavigateMock,
      });

      await waitFor(() => {
        expect(onBeforeNavigateMock).toHaveBeenCalledWith(
          expect.objectContaining({
            toLocation: expect.objectContaining({ pathname: '/' }),
          }),
        );
      });
    });

    it('should automatically redirect to the specified redirect URL if the user is already authenticated', async () => {
      const onBeforeNavigateMock = vi.fn();
      renderLoginPage({
        authState: {
          isAuthenticated: true,
          token: 'dummy_token',
          userId: 'dummy_user_id',
        },
        currentPath: '/login?redirect=/profile',
        onNavigate: onBeforeNavigateMock,
      });

      await waitFor(() => {
        expect(onBeforeNavigateMock).toHaveBeenCalledWith(
          expect.objectContaining({
            toLocation: expect.objectContaining({ pathname: '/profile' }),
          }),
        );
      });
    });
  });
});
