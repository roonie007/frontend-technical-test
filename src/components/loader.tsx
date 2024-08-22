import { Flex, Spinner } from '@chakra-ui/react';

export const Loader: React.FC = () => {
  return (
    <Flex alignItems="center" height="full" justifyContent="center" width="full">
      <Spinner color="cyan.600" size="xl" />
    </Flex>
  );
};
