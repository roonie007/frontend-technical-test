import urlJoin from 'url-join';
import localToken from './helpers/localToken';
import type {
  CreateCommentResponse,
  GetMemeCommentsResponse,
  GetMemesResponse,
  GetUserByIdResponse,
  LoginResponse,
} from './types/apiResponse';
import { FError } from './helpers/error';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/**
 * Generic fetch handler that adds the Authorization header with the token
 * @param urlOrPath
 * @param options
 * @returns
 */
const apiHandler = async <T>(urlOrPath: string, options?: RequestInit): Promise<T> => {
  const url =
    urlOrPath.startsWith('http:') || urlOrPath.startsWith('https:') ? urlOrPath : urlJoin(BASE_URL, urlOrPath);
  const token = localToken.load();

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    },
  });

  if (response.status === 401) {
    if (response.url.includes('authentication/login')) {
      throw new FError('Unauthorized', 401);
    }

    localToken.remove();
    document.location.reload();
  }

  if (response.status === 404) {
    throw new FError('Not Found', 404);
  }

  return response.json();
};

/**
 * Authenticate the user with the given credentials
 * @param username
 * @param password
 * @returns
 */
export const login = (username: string, password: string) =>
  apiHandler<LoginResponse>('/authentication/login', { method: 'POST', body: JSON.stringify({ username, password }) });

/**
 * Get a user by their id
 * @param id
 * @returns
 */
export const getUserById = (id: string) => apiHandler<GetUserByIdResponse>(`/users/${id}`);

/**
 * Get the list of memes for a given page
 * @param page
 * @returns
 */

export const getMemes = async (page: number) => {
  const data = await apiHandler<GetMemesResponse>(`/memes?page=${page}`);

  return {
    ...data,
    nextPage: data.results.length > 0 ? page + 1 : undefined,
  };
};

/**
 * Get comments for a meme
 * @param token
 * @param memeId
 * @returns
 */
export const getMemeComments = async (memeId: string, page: number) => {
  const data = await apiHandler<GetMemeCommentsResponse>(`/memes/${memeId}/comments?page=${page}`);

  return {
    ...data,
    nextPage: data.results.length > 0 ? page + 1 : undefined,
  };
};

/**
 * Create a comment for a meme
 * @param memeId
 * @param content
 */

export const createMemeComment = async (memeId: string, content: string) =>
  apiHandler<CreateCommentResponse>(`/memes/${memeId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });

/**
 *
 * @param formData
 * @returns
 */
export const createMeme = async (formData: FormData) =>
  apiHandler(`/memes`, {
    method: 'POST',
    body: formData,
  });
