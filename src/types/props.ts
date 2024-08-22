import { APIMeme, APIUser } from './apiData';
import { ClientMemeCommentData, ClientMemeData } from './clientData';

export interface MemeProps {
  meme: ClientMemeData;
  user?: APIUser;
  onNewComment?: () => void;
}

export interface MemePictureProps {
  pictureUrl: string;
  texts: APIMeme['texts'];
  dataTestId?: string;
  editMode?: boolean;
  updateTexts?: (texts: APIMeme['texts']) => void;
}

export interface MemeEditorProps {
  onDrop: (file: File) => void;
  memePicture?: MemePictureProps;
  editMode?: boolean;
  updateTexts?: (texts: APIMeme['texts']) => void;
}

export interface MemeCommentProps {
  meme: ClientMemeData;
  comment: ClientMemeCommentData;
}
