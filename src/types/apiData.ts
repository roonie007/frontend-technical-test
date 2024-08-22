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
