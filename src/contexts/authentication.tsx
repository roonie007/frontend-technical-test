import { jwtDecode } from 'jwt-decode';
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import localToken from '../helpers/localToken';
import { FError } from '../helpers/error';

export type AuthenticationState =
  | {
      isAuthenticated: true;
      token: string;
      userId: string;
    }
  | {
      isAuthenticated: false;
    };

export type Authentication = {
  state: AuthenticationState;
  authenticate: (token: string) => void;
  signout: () => void;
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

  const contextValue = useMemo(() => ({ state, authenticate, signout }), [state, authenticate, signout]);

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
