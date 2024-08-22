import urlJoin from 'url-join';
import localToken from './helpers/localToken';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

export class NotFoundError extends Error {
  constructor() {
    super('Not Found');
  }
}

export type LoginResponse = {
  jwt: string;
};

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
      ...options?.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    if (response.url.includes('authentication/login')) {
      throw new UnauthorizedError();
    }

    localToken.remove();
    document.location.reload();
  }

  if (response.status === 404) {
    throw new NotFoundError();
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

export type GetUserByIdResponse = {
  id: string;
  username: string;
  pictureUrl: string;
};

/**
 * Get a user by their id
 * @param id
 * @returns
 */
export const getUserById = (id: string) => apiHandler<GetUserByIdResponse>(`/users/${id}`);

export type GetMemesResponse = {
  total: number;
  pageSize: number;
  nextPage?: number;
  results: {
    id: string;
    authorId: string;
    pictureUrl: string;
    description: string;
    commentsCount: string;
    texts: {
      content: string;
      x: number;
      y: number;
    }[];
    createdAt: string;
  }[];
};

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

export type GetMemeCommentsResponse = {
  total: number;
  pageSize: number;
  nextPage?: number;
  results: {
    id: string;
    authorId: string;
    memeId: string;
    content: string;
    createdAt: string;
  }[];
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

export type CreateCommentResponse = {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  memeId: string;
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
 * Create a meme
 * @param formData
 */

export const createMeme = async (formData: FormData) =>
  fetch(`/memes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localToken.load()}`,
    },
    body: formData,
  });
