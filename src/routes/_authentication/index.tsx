import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Flex, StackDivider, VStack } from '@chakra-ui/react';

import useInfiniteScroll from 'react-infinite-scroll-hook';
import { getMemes, getUserById } from '../../api';
import { useAuthToken } from '../../contexts/authentication';
import { Loader } from '../../components/loader';
import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Meme } from '../../components/meme';
import { ClientMemeDataList } from '../../types/clientData';

export const MemeFeedPage: React.FC = () => {
  const token = useAuthToken();

  const {
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    data: memes,
    refetch,
  } = useInfiniteQuery<ClientMemeDataList, Error>({
    queryKey: ['memes'],
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      return lastPage.nextPage;
    },
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
        pageSize: memesPageData.pageSize,
        total: memesPageData.total,
        nextPage: memesPageData.nextPage,
        results: await Promise.all(memesPromises),
      };
    },
  });

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage,
    disabled: isLoading || isFetching,
    onLoadMore: () => {
      fetchNextPage();
    },
    rootMargin: '0px 0px 400px 0px',
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUserById(jwtDecode<{ id: string }>(token).id),
  });

  if (isLoading) {
    return <Loader data-testid="meme-feed-loader" />;
  }
  return (
    <Flex width="full" height="full" justifyContent="center" overflowY="auto">
      <VStack p={4} width="full" maxWidth={800} divider={<StackDivider border="gray.200" />}>
        {memes?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.results.map(meme => (
              <Meme key={meme.id} meme={meme} user={user} onNewComment={refetch} />
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
