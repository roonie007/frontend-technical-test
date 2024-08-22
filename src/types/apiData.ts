export interface APIUser {
  id: string;
  username: string;
  pictureUrl: string;
}

export interface APIMeme {
  id: string;
  authorId: string;
  pictureUrl: string;
  description: string;
  commentsCount: string;
  texts: Array<{
    content: string;
    x: number;
    y: number;
  }>;
  createdAt: string;
}

export interface APIMemeComment {
  id: string;
  authorId: string;
  memeId: string;
  content: string;
  createdAt: string;
}
