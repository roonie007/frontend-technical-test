import 'react-intersection-observer/test-utils';

import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthenticationContext } from '../../../contexts/authentication';
import { MemeFeedPage } from '../../../routes/_authentication/index';
import { renderWithRouter } from '../../utils';

// We mock the LazyLoadImage component to avoid rendering the actual image
vi.mock('react-lazy-load-image-component', () => ({
  LazyLoadImage: vi.fn(props => <img {...props} />),
}));

describe('routes/_authentication/index', () => {
  describe('MemeFeedPage', () => {
    function renderMemeFeedPage() {
      return renderWithRouter({
        component: MemeFeedPage,
        Wrapper: ({ children }) => (
          <ChakraProvider>
            <QueryClientProvider client={new QueryClient()}>
              <AuthenticationContext.Provider
                value={{
                  state: {
                    isAuthenticated: true,
                    userId: 'dummy_user_id',
                    token: 'dummy_token',
                  },
                  authenticate: () => {},
                  signout: () => {},
                }}
              >
                {children}
              </AuthenticationContext.Provider>
            </QueryClientProvider>
          </ChakraProvider>
        ),
      });
    }

    it('should fetch the memes and display them with their comments', async () => {
      renderMemeFeedPage();

      await waitFor(() => {
        // We check that the right author's username is displayed
        expect(screen.getByTestId('meme-author-dummy_meme_id_1')).toHaveTextContent('dummy_user_1');

        // We check that the right meme's picture is displayed
        expect(screen.getByTestId('meme-picture-dummy_meme_id_1')).toHaveAttribute('src', 'https://dummy.url/meme/1');

        // We check that the right texts are displayed at the right positions
        const text1 = screen.getByTestId('meme-picture-dummy_meme_id_1-text-0');
        const text2 = screen.getByTestId('meme-picture-dummy_meme_id_1-text-1');
        expect(text1).toHaveTextContent('dummy text 1');
        expect(text1).toHaveStyle({
          top: '0px',
          left: '0px',
        });
        expect(text2).toHaveTextContent('dummy text 2');
        expect(text2).toHaveStyle({
          top: '100px',
          left: '100px',
        });

        // We check that the right description is displayed
        expect(screen.getByTestId('meme-description-dummy_meme_id_1')).toHaveTextContent('dummy meme 1');

        // We check that the right number of comments is displayed
        expect(screen.getByTestId('meme-comments-count-dummy_meme_id_1')).toHaveTextContent('3 comments');

        // We click on the comments section
        screen.getByTestId('meme-comments-section-dummy_meme_id_1').click();

        // We check that the right comments with the right authors are displayed
        expect(screen.getByTestId('meme-comment-content-dummy_meme_id_1-dummy_comment_id_1')).toHaveTextContent(
          'dummy comment 1',
        );
        expect(screen.getByTestId('meme-comment-author-dummy_meme_id_1-dummy_comment_id_1')).toHaveTextContent(
          'dummy_user_1',
        );

        expect(screen.getByTestId('meme-comment-content-dummy_meme_id_1-dummy_comment_id_2')).toHaveTextContent(
          'dummy comment 2',
        );
        expect(screen.getByTestId('meme-comment-author-dummy_meme_id_1-dummy_comment_id_2')).toHaveTextContent(
          'dummy_user_2',
        );

        expect(screen.getByTestId('meme-comment-content-dummy_meme_id_1-dummy_comment_id_3')).toHaveTextContent(
          'dummy comment 3',
        );
        expect(screen.getByTestId('meme-comment-author-dummy_meme_id_1-dummy_comment_id_3')).toHaveTextContent(
          'dummy_user_3',
        );
      });
    });

    it('should refetch the comments when a new comment is added', async () => {
      renderMemeFeedPage();

      // Wait for the memes to be displayed
      await waitFor(() => {
        expect(screen.getByTestId('meme-picture-dummy_meme_id_1')).toHaveAttribute('src', 'https://dummy.url/meme/1');
      });

      const commentSection = screen.getByTestId('meme-comments-section-dummy_meme_id_1');
      const commentForm = screen.getByTestId('meme-comment-form-dummy_meme_id_1');
      const commentInput = screen.getByTestId('meme-comment-input-dummy_meme_id_1');

      act(() => {
        // We click on the comments section
        commentSection.click();

        // We add a new comment
        fireEvent.change(commentInput, {
          target: { value: 'new test comment' },
        });

        fireEvent.submit(commentForm);
      });

      await waitFor(
        () => {
          // We check that the right number of comments is displayed
          expect(screen.getByTestId('meme-comments-count-dummy_meme_id_1')).toHaveTextContent('4 comments');

          // We check that the right comment with the right author is displayed
          expect(screen.getByTestId('meme-comment-content-dummy_meme_id_1-dummy_comment_id_4')).toHaveTextContent(
            'new test comment',
          );
          expect(screen.getByTestId('meme-comment-author-dummy_meme_id_1-dummy_comment_id_4')).toHaveTextContent(
            'dummy_user_1',
          );
        },
        {
          timeout: 4000,
        },
      );
    });
  });
});
