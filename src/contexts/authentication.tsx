import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { jwtDecode } from 'jwt-decode';

import { FError } from '../helpers/error';
import localToken from '../helpers/localToken';

import type { PropsWithChildren } from 'react';

export type AuthenticationState =
  | {
      isAuthenticated: false;
    }
  | {
      isAuthenticated: true;
      token: string;
      userId: string;
    };

export type Authentication = {
  authenticate: (token: string) => void;
  signout: () => void;
  state: AuthenticationState;
};

export const AuthenticationContext = createContext<Authentication | undefined>(undefined);

export const AuthenticationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const localStoredToken = localToken.load();

  const [state, setState] = useState<AuthenticationState>({
    isAuthenticated: localStoredToken != null,
    token: localStoredToken ?? '',
    userId: localStoredToken ? jwtDecode<{ id: string }>(localStoredToken).id : '',
  });

  const authenticate = useCallback(
    (token: string) => {
      setState({
        isAuthenticated: true,
        token: token,
        userId: jwtDecode<{ id: string }>(token).id,
      });

      localToken.save(token);
    },
    [setState],
  );

  const signout = useCallback(() => {
    setState({ isAuthenticated: false });
    localToken.remove();
  }, [setState]);

  const contextValue = useMemo(() => ({ authenticate, signout, state }), [state, authenticate, signout]);

  return <AuthenticationContext.Provider value={contextValue}>{children}</AuthenticationContext.Provider>;
};

export function useAuthentication() {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new FError('useAuthentication must be used within an AuthenticationProvider');
  }
  return context;
}

export function useAuthToken() {
  const { state } = useAuthentication();
  if (!state.isAuthenticated) {
    throw new FError('User is not authenticated');
  }
  return state.token;
}

export function useUserId() {
  const { state } = useAuthentication();
  if (!state.isAuthenticated) {
    throw new FError('User is not authenticated');
  }
  return state.userId;
}
