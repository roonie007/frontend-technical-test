import { Button, Flex, Heading, HStack, Icon, StackDivider } from '@chakra-ui/react';
import { Plus } from '@phosphor-icons/react';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';

import { UserDropdown } from '../components/user-dropdown';
import { useAuthentication } from '../contexts/authentication';

import type { RouterContext } from '../types/common';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    const { state } = useAuthentication();
    return (
      <Flex direction="column" height="full" width="full">
        {/* Header */}
        <Flex bgColor="cyan.600" boxShadow="md" justifyContent="space-between" p={2}>
          {/* Title */}
          <Heading color="white" size="lg">
            MemeFactory
          </Heading>
          {state.isAuthenticated && (
            <HStack alignItems="center" divider={<StackDivider border="white" />}>
              <Button as={Link} leftIcon={<Icon as={Plus} />} size="sm" to="/create">
                Create a meme
              </Button>
              <UserDropdown />
            </HStack>
          )}
        </Flex>
        <Flex flexGrow={1} height={0}>
          <Outlet />
        </Flex>
      </Flex>
    );
  },
});
