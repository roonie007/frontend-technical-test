import type { APIMeme, APIUser } from './apiData';
import type { ClientMemeCommentData, ClientMemeData } from './clientData';

export interface MemeProps {
  meme: ClientMemeData;
  onNewComment?: () => void;
  user?: APIUser;
}

export interface MemePictureProps {
  dataTestId?: string;
  editMode?: boolean;
  pictureUrl: string;
  texts: APIMeme['texts'];
  updateTexts?: (texts: APIMeme['texts']) => void;
}

export interface MemeEditorProps {
  editMode?: boolean;
  memePicture?: MemePictureProps;
  onDrop: (file: File) => void;
  updateTexts?: (texts: APIMeme['texts']) => void;
}

export interface MemeCommentProps {
  comment: ClientMemeCommentData;
  meme: ClientMemeData;
}
