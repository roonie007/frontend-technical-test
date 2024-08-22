import { useState } from 'react';
import React from 'react';

import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Icon,
  Input,
  LinkBox,
  LinkOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CaretDown, CaretUp, Chat } from '@phosphor-icons/react';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { format } from 'timeago.js';

import { createMemeComment, getMemeComments, getUserById } from '../api';
import { MemeComment } from './meme-comment';
import { MemePicture } from './meme-picture';

import type { ClientMemeCommentDataList } from '../types/clientData';
import type { MemeProps } from '../types/props';

export const Meme: React.FC<MemeProps> = ({ meme, onNewComment, user }) => {
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [commentContent, setCommentContent] = useState<string>('');

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    refetch,
  } = useInfiniteQuery<ClientMemeCommentDataList>({
    enabled: () => showCommentSection,
    getNextPageParam: lastPage => {
      return lastPage.nextPage;
    },
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const commentsPageData = await getMemeComments(meme.id, pageParam as number);

      // Fetch the author for each meme comment
      const commentsPromises = commentsPageData.results.map(async comment => {
        const author = await getUserById(comment.authorId);
        return {
          ...comment,
          author,
        };
      });

      return {
        nextPage: commentsPageData.nextPage,
        pageSize: commentsPageData.pageSize,
        results: await Promise.all(commentsPromises),
        total: commentsPageData.total,
      };
    },
    queryKey: ['comments', meme.id],
  });

  const { mutate } = useMutation({
    mutationFn: async (data: string) => {
      await createMemeComment(meme.id, data);

      if (onNewComment) {
        await onNewComment();
      }

      setCommentContent('');
      await refetch();
    },
  });

  return (
    <VStack align="stretch" key={meme.id} p={4} width="full">
      <Flex alignItems="center" justifyContent="space-between">
        <Flex>
          <Avatar
            borderColor="gray.300"
            borderWidth="1px"
            name={meme.author.username}
            size="xs"
            src={meme.author.pictureUrl}
          />
          <Text data-testid={`meme-author-${meme.id}`} ml={2}>
            {meme.author.username}
          </Text>
        </Flex>
        <Text color="gray.500" fontSize="small" fontStyle="italic">
          {format(meme.createdAt)}
        </Text>
      </Flex>
      <MemePicture dataTestId={`meme-picture-${meme.id}`} pictureUrl={meme.pictureUrl} texts={meme.texts} />
      <Box>
        <Text fontSize="medium" fontWeight="bold" mb={2}>
          Description:{' '}
        </Text>
        <Box border="1px solid" borderColor="gray.100" borderRadius={8} p={2}>
          <Text color="gray.500" data-testid={`meme-description-${meme.id}`} whiteSpace="pre-line">
            {meme.description}
          </Text>
        </Box>
      </Box>
      <LinkBox as={Box} borderBottom="1px solid black" py={2}>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <LinkOverlay
              cursor="pointer"
              data-testid={`meme-comments-section-${meme.id}`}
              onClick={() => setShowCommentSection(true)}
            >
              <Text data-testid={`meme-comments-count-${meme.id}`}>{meme.commentsCount} comments</Text>
            </LinkOverlay>
            <Icon as={showCommentSection ? CaretUp : CaretDown} ml={2} mt={1} />
          </Flex>
          <Icon as={Chat} />
        </Flex>
      </LinkBox>
      <Collapse animateOpacity in={showCommentSection}>
        <Box mb={6}>
          <form
            data-testid={`meme-comment-form-${meme.id}`}
            onSubmit={event => {
              event.preventDefault();
              if (commentContent.trim().length === 0) {
                return;
              }

              mutate(commentContent);
            }}
          >
            <Flex alignItems="center">
              <Avatar
                borderColor="gray.300"
                borderWidth="1px"
                mr={2}
                name={user?.username}
                size="sm"
                src={user?.pictureUrl}
              />
              <Input
                data-testid={`meme-comment-input-${meme.id}`}
                onChange={event => {
                  setCommentContent(event.target.value);
                }}
                placeholder="Type your comment here..."
                value={commentContent}
              />
            </Flex>
          </form>
        </Box>
        <VStack align="stretch" spacing={4}>
          {comments?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.results.map(comment => (
                <MemeComment comment={comment} key={comment.id} meme={meme} />
              ))}
            </React.Fragment>
          ))}

          {hasNextPage && (
            <Button isLoading={isLoading || isFetching} onClick={() => fetchNextPage()} variant="link">
              Load more comments
            </Button>
          )}
        </VStack>

        <Divider my={4} />
      </Collapse>
    </VStack>
  );
};
