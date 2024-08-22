import { Avatar, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { CaretDown, CaretUp, SignOut } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';

import { getUserById } from '../api';
import { useAuthentication } from '../contexts/authentication';

export const UserDropdown: React.FC = () => {
  const { signout, state } = useAuthentication();
  const { data: user, isLoading } = useQuery({
    enabled: state.isAuthenticated,
    queryFn: () => {
      if (state.isAuthenticated) {
        return getUserById(state.userId);
      }
      return null;
    },
    queryKey: ['user', state.isAuthenticated ? state.userId : 'anon'],
  });

  if (!state.isAuthenticated || isLoading) {
    return null;
  }

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton>
            <Flex alignItems="center" direction="row">
              <Avatar border="1px solid white" mr={2} name={user?.username} size="xs" src={user?.pictureUrl} />
              <Text color="white">{user?.username}</Text>
              <Icon as={isOpen ? CaretUp : CaretDown} color="white" ml={2} mt={1} />
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<Icon as={SignOut} />} onClick={signout}>
              Sign Out
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};
