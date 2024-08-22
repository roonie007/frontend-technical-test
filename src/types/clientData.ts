import type { APIMeme, APIMemeComment, APIUser } from './apiData';
import type { ListResponse } from './apiResponse';

export interface ClientMemeData extends APIMeme {
  author: APIUser;
  comments: Array<ClientMemeCommentData>;
}

export interface ClientMemeCommentData extends APIMemeComment {
  author: APIUser;
}

// Define the alias types for the client data
export type ClientMemeDataList = ListResponse<ClientMemeData>;
export type ClientMemeCommentDataList = ListResponse<ClientMemeCommentData>;
