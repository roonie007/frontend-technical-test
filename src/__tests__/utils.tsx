import React from 'react';

import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import { render } from '@testing-library/react';

import type { ListenerFn, RouterEvents } from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';

function createTestRouter(component: (...args: any) => React.ReactNode, currentUrl: string) {
  const rootRoute = createRootRoute({
    component: Outlet,
  });

  const componentRoute = createRoute({
    component,
    getParentRoute: () => rootRoute,
    path: currentUrl.split('?')[0],
  });

  const router = createRouter({
    history: createMemoryHistory({ initialEntries: [currentUrl] }),
    routeTree: rootRoute.addChildren([componentRoute]),
  });

  return router;
}

type RenderWithRouterParams = {
  component: (...args: any) => React.ReactNode;
  currentUrl?: string;
  onNavigate?: ListenerFn<RouterEvents['onBeforeNavigate']>;
  Wrapper?: React.ComponentType<PropsWithChildren>;
};

export function renderWithRouter({
  component,
  currentUrl = '/',
  onNavigate = () => {},
  Wrapper = React.Fragment,
}: RenderWithRouterParams) {
  const router = createTestRouter(component, currentUrl);
  router.subscribe('onBeforeNavigate', onNavigate);
  const renderResult = render(
    <Wrapper>
      {/* @ts-expect-error EXPLICATION-NEEDED */}
      <RouterProvider router={router} />;
    </Wrapper>,
  );

  return {
    renderResult,
    router,
  };
}
