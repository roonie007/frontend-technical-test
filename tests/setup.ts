import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { afterEach } from 'vitest';

import { handlers } from './mocks/handlers';

import '@testing-library/jest-dom/vitest';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());
