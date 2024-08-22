import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { format } from 'timeago.js';

import type { MemeCommentProps } from '../types/props';

export const MemeComment: React.FC<MemeCommentProps> = ({ comment, meme }) => {
  return (
    <Flex key={comment.id}>
      <Avatar
        borderColor="gray.300"
        borderWidth="1px"
        mr={2}
        name={comment.author.username}
        size="sm"
        src={comment.author.pictureUrl}
      />
      <Box bg="gray.50" borderRadius={8} flexGrow={1} p={2}>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex>
            <Text data-testid={`meme-comment-author-${meme.id}-${comment.id}`}>{comment.author.username}</Text>
          </Flex>
          <Text color="gray.500" fontSize="small" fontStyle="italic">
            {format(comment.createdAt)}
          </Text>
        </Flex>
        <Text color="gray.500" data-testid={`meme-comment-content-${meme.id}-${comment.id}`} whiteSpace="pre-line">
          {comment.content}
        </Text>
      </Box>
    </Flex>
  );
};
