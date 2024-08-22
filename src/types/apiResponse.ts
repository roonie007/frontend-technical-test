import type { APIMeme, APIMemeComment, APIUser } from './apiData';

export interface LoginResponse {
  jwt: string;
}

export interface ListResponse<T> {
  nextPage?: number;
  pageSize: number;
  results: Array<T>;
  total: number;
}

// Define the alias types for the API responses
export type GetUserByIdResponse = APIUser;
export type GetMemesResponse = ListResponse<APIMeme>;
export type GetMemeCommentsResponse = ListResponse<APIMemeComment>;
export type CreateCommentResponse = APIMemeComment;
