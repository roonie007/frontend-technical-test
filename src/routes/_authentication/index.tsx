import React from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';

import { Flex, StackDivider, VStack } from '@chakra-ui/react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { getMemes, getUserById } from '../../api';
import { Loader } from '../../components/loader';
import { Meme } from '../../components/meme';
import { useUserId } from '../../contexts/authentication';

import type { ClientMemeDataList } from '../../types/clientData';

export const MemeFeedPage: React.FC = () => {
  const userId = useUserId();

  const {
    data: memes,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    refetch,
  } = useInfiniteQuery<ClientMemeDataList, Error>({
    getNextPageParam: lastPage => {
      return lastPage.nextPage;
    },
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const memesPageData = await getMemes(pageParam as number);

      // Fetch the author for each meme
      const memesPromises = memesPageData.results.map(async meme => {
        const author = await getUserById(meme.authorId);
        return {
          ...meme,
          author,
          comments: [],
        };
      });

      return {
        nextPage: memesPageData.nextPage,
        pageSize: memesPageData.pageSize,
        results: await Promise.all(memesPromises),
        total: memesPageData.total,
      };
    },
    queryKey: ['memes'],
  });

  const [sentryRef] = useInfiniteScroll({
    disabled: isLoading || isFetching,
    hasNextPage,
    loading: isLoading,
    onLoadMore: () => {
      fetchNextPage();
    },
    rootMargin: '0px 0px 400px 0px',
  });

  const { data: user } = useQuery({
    queryFn: () => getUserById(userId),
    queryKey: ['user'],
  });

  if (isLoading) {
    return <Loader data-testid="meme-feed-loader" />;
  }
  return (
    <Flex height="full" justifyContent="center" overflowY="auto" width="full">
      <VStack divider={<StackDivider border="gray.200" />} maxWidth={800} p={4} width="full">
        {memes?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.results.map(meme => (
              <Meme key={meme.id} meme={meme} onNewComment={refetch} user={user} />
            ))}
          </React.Fragment>
        ))}
        {(isLoading || isFetching || hasNextPage) && (
          <span ref={sentryRef}>
            <Loader />{' '}
          </span>
        )}
      </VStack>
    </Flex>
  );
};

export const Route = createFileRoute('/_authentication/')({
  component: MemeFeedPage,
});
