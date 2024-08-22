import { useForm } from 'react-hook-form';

import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Navigate } from '@tanstack/react-router';

import { login } from '../api';
import { useAuthentication } from '../contexts/authentication';
import { FError } from '../helpers/error';

import type { Inputs, SearchParams } from '../types/common';
import type { SubmitHandler } from 'react-hook-form';

function renderError(error: Error) {
  if (error instanceof FError && error.code === 401) {
    return <FormErrorMessage>Wrong credentials</FormErrorMessage>;
  }
  return <FormErrorMessage>An unknown error occured, please try again later</FormErrorMessage>;
}

export const LoginPage: React.FC = () => {
  const { redirect } = Route.useSearch();
  const { authenticate, state } = useAuthentication();
  const { error, isPending, mutate } = useMutation({
    mutationFn: (data: Inputs) => login(data.username, data.password),
    onSuccess: ({ jwt }) => {
      authenticate(jwt);
    },
  });
  const { handleSubmit, register } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async data => {
    mutate(data);
  };

  if (state.isAuthenticated) {
    return <Navigate to={redirect ?? '/'} />;
  }

  return (
    <Flex alignItems="center" height="full" justifyContent="center" width="full">
      <Flex bgGradient="linear(to-br, cyan.100, cyan.200)" borderRadius={16} direction="column" p={8}>
        <Heading as="h2" mb={4} size="md" textAlign="center">
          Login
        </Heading>
        <Text mb={4} textAlign="center">
          Welcome back! 👋
          <br />
          Please enter your credentials.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input bg="white" placeholder="Enter your username" size="sm" type="text" {...register('username')} />
          </FormControl>
          <FormControl isInvalid={error !== null}>
            <FormLabel>Password</FormLabel>
            <Input bg="white" placeholder="Enter your password" size="sm" type="password" {...register('password')} />
            {error !== null && renderError(error)}
          </FormControl>
          <Button color="white" colorScheme="cyan" isLoading={isPending} mt={4} size="sm" type="submit" width="full">
            Login
          </Button>
        </form>
      </Flex>
    </Flex>
  );
};

export const Route = createFileRoute('/login')({
  component: LoginPage,
  validateSearch: (search): SearchParams => {
    return {
      redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    };
  },
});
