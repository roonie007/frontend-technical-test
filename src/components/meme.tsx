import {
  Avatar,
  Box,
  Collapse,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
  Text,
  Input,
  VStack,
  Divider,
  Button,
} from '@chakra-ui/react';
import { CaretDown, CaretUp, Chat } from '@phosphor-icons/react';
import { format } from 'timeago.js';
import { MemePicture } from './meme-picture';
import { createMemeComment, getMemeComments, GetMemesResponse, getUserById, GetUserByIdResponse } from '../api';
import { useState } from 'react';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { MemeComment, MemeCommentData } from './meme-comment';
import React from 'react';

export type MemeData = GetMemesResponse['results']['0'] & {
  author: GetUserByIdResponse;
  comments: MemeCommentData[];
};

export type MemeProps = {
  meme: MemeData;
  user?: GetUserByIdResponse;
  onNewComment?: () => void;
};

type MemeCommentResponseData = {
  results: MemeCommentData[];
  total: number;
  pageSize: number;
  nextPage?: number;
};

export const Meme: React.FC<MemeProps> = ({ meme, user, onNewComment }) => {
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [commentContent, setCommentContent] = useState<string>('');

  const {
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    data: comments,
    refetch,
  } = useInfiniteQuery<MemeCommentResponseData>({
    queryKey: ['comments', meme.id],
    enabled: () => showCommentSection,
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      return lastPage.nextPage;
    },
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
        pageSize: commentsPageData.pageSize,
        total: commentsPageData.total,
        nextPage: commentsPageData.nextPage,
        results: await Promise.all(commentsPromises),
      };
    },
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
    <VStack key={meme.id} p={4} width="full" align="stretch">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <Avatar
            borderWidth="1px"
            borderColor="gray.300"
            size="xs"
            name={meme.author.username}
            src={meme.author.pictureUrl}
          />
          <Text ml={2} data-testid={`meme-author-${meme.id}`}>
            {meme.author.username}
          </Text>
        </Flex>
        <Text fontStyle="italic" color="gray.500" fontSize="small">
          {format(meme.createdAt)}
        </Text>
      </Flex>
      <MemePicture pictureUrl={meme.pictureUrl} texts={meme.texts} dataTestId={`meme-picture-${meme.id}`} />
      <Box>
        <Text fontWeight="bold" fontSize="medium" mb={2}>
          Description:{' '}
        </Text>
        <Box p={2} borderRadius={8} border="1px solid" borderColor="gray.100">
          <Text color="gray.500" whiteSpace="pre-line" data-testid={`meme-description-${meme.id}`}>
            {meme.description}
          </Text>
        </Box>
      </Box>
      <LinkBox as={Box} py={2} borderBottom="1px solid black">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <LinkOverlay
              data-testid={`meme-comments-section-${meme.id}`}
              cursor="pointer"
              onClick={() => setShowCommentSection(true)}
            >
              <Text data-testid={`meme-comments-count-${meme.id}`}>{meme.commentsCount} comments</Text>
            </LinkOverlay>
            <Icon as={showCommentSection ? CaretUp : CaretDown} ml={2} mt={1} />
          </Flex>
          <Icon as={Chat} />
        </Flex>
      </LinkBox>
      <Collapse in={showCommentSection} animateOpacity>
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
                borderWidth="1px"
                borderColor="gray.300"
                name={user?.username}
                src={user?.pictureUrl}
                size="sm"
                mr={2}
              />
              <Input
                placeholder="Type your comment here..."
                onChange={event => {
                  setCommentContent(event.target.value);
                }}
                value={commentContent}
                data-testid={`meme-comment-input-${meme.id}`}
              />
            </Flex>
          </form>
        </Box>
        <VStack align="stretch" spacing={4}>
          {comments?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.results.map(comment => (
                <MemeComment key={comment.id} meme={meme} comment={comment} />
              ))}
            </React.Fragment>
          ))}

          {hasNextPage && (
            <Button variant="link" onClick={() => fetchNextPage()} isLoading={isLoading || isFetching}>
              Load more comments
            </Button>
          )}
        </VStack>

        <Divider my={4} />
      </Collapse>
    </VStack>
  );
};
