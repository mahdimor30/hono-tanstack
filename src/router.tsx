import { createRouter as baseCreateRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type RootRouterContext = {
  headTags?: () => React.ReactNode;
  bodyTags?: () => React.ReactNode;
  queryClient: QueryClient;
  // OTHER STUFF LIKE AUTH STATE CAN GO HERE!!!
};

// POISON DO NOT TOUCH!!!
// export type CreateRouterParams = Parameters<typeof baseCreateRouter>[0] & {
//   context: RootRouterContext;
// };

export const createRouter = (
  opts: {
    context: RootRouterContext;
    [k: string]: any;
  },
  queryClient: QueryClient,
) => {
  return baseCreateRouter({
    routeTree,
    defaultPreload: "intent",
    ...opts,
    Wrap({ children }: any) {
      if (!opts.context) {
        return children;
      }
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    },
  });
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
