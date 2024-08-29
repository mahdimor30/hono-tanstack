import { RouterProvider } from "@tanstack/react-router";
import { hydrateRoot } from "react-dom/client";

import { createRouter } from "@/router.tsx";
import { hydrate, QueryClient } from "@tanstack/react-query";

void render();

async function render() {
  const queryClient = new QueryClient();
  const router = createRouter({
    hydrate: (dehydrated: any) => {
      hydrate(queryClient, dehydrated["queryClient"]);
    },
    context: {
      headTags: undefined,
      bodyTags: undefined,
      queryClient,
    }
  }, queryClient);

  if (!router.state.matches.length) {
    // needed until https://github.com/TanStack/router/issues/1115 is resolved
    // do NOT need if not using lazy file routes
    await router.load();

    void router.hydrate();
  }

  hydrateRoot(
    document,

    <RouterProvider router={router} />,
  );
}
