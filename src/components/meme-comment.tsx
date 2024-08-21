import { Avatar, Flex, Box, Text } from '@chakra-ui/react';
import { GetMemeCommentsResponse, GetUserByIdResponse } from '../api';
import { format } from 'timeago.js';
import { MemeData } from './meme';

export type MemeCommentData = GetMemeCommentsResponse['results']['0'] & {
  author: GetUserByIdResponse;
};

export type MemeCommentProps = {
  meme: MemeData;
  comment: MemeCommentData;
};

export const MemeComment: React.FC<MemeCommentProps> = ({ meme, comment }) => {
  return (
    <Flex key={comment.id}>
      <Avatar
        borderWidth="1px"
        borderColor="gray.300"
        size="sm"
        name={comment.author.username}
        src={comment.author.pictureUrl}
        mr={2}
      />
      <Box p={2} borderRadius={8} bg="gray.50" flexGrow={1}>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex>
            <Text data-testid={`meme-comment-author-${meme.id}-${comment.id}`}>{comment.author.username}</Text>
          </Flex>
          <Text fontStyle="italic" color="gray.500" fontSize="small">
            {format(comment.createdAt)}
          </Text>
        </Flex>
        <Text color="gray.500" whiteSpace="pre-line" data-testid={`meme-comment-content-${meme.id}-${comment.id}`}>
          {comment.content}
        </Text>
      </Box>
    </Flex>
  );
};
