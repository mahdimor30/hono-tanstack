import { renderAssets } from "@ssrx/react/server";
import { assetsForRequest } from "@ssrx/vite/runtime";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";

import { createRouter } from "@/router.tsx";
import { dehydrate, QueryClient } from "@tanstack/react-query";

export async function render(req: Request) {
  const queryClient = new QueryClient();
  const assets = await assetsForRequest(req.url);

  const url = new URL(req.url);
  const memoryHistory = createMemoryHistory({
    initialEntries: [url.pathname + url.search],
  });
  const router = createRouter(
    {
      context: {
        headTags: () => renderAssets(assets.headAssets),
        bodyTags: () => renderAssets(assets.bodyAssets),
        queryClient,
      },
      history: memoryHistory,
      dehydrate: () => {
        return {
          queryClient: dehydrate(queryClient),
        };
      },
    },
    queryClient,
  );

  // router.update({ history: memoryHistory });

  // Wait for critical, non-deferred data
  await router.load();

  const app = <RouterProvider router={router} />;

  return { app, router };
}
