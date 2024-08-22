import type { AuthenticationState } from '../contexts/authentication';

export interface Picture {
  file: File;
  url: string;
}

export interface Inputs {
  password: string;
  username: string;
}

export interface RouterContext {
  authState: AuthenticationState;
}

export interface SearchParams {
  redirect?: string;
}
