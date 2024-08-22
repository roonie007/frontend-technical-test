import { APIMeme, APIMemeComment, APIUser } from './apiData';

export interface LoginResponse {
  jwt: string;
}

export interface ListResponse<T> {
  total: number;
  pageSize: number;
  nextPage?: number;
  results: Array<T>;
}

// Define the alias types for the API responses
export type GetUserByIdResponse = APIUser;
export type GetMemesResponse = ListResponse<APIMeme>;
export type GetMemeCommentsResponse = ListResponse<APIMemeComment>;
export type CreateCommentResponse = APIMemeComment;
