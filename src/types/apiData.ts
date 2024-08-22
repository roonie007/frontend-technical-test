export interface APIUser {
  id: string;
  pictureUrl: string;
  username: string;
}

export interface APIMeme {
  authorId: string;
  commentsCount: string;
  createdAt: string;
  description: string;
  id: string;
  pictureUrl: string;
  texts: Array<{
    content: string;
    x: number;
    y: number;
  }>;
}

export interface APIMemeComment {
  authorId: string;
  content: string;
  createdAt: string;
  id: string;
  memeId: string;
}

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
