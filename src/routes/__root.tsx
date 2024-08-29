import "../style.css";

import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  createRootRouteWithContext,
  ErrorComponent,
  Link,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// @ts-expect-error no types
import jsesc from "jsesc";

import type { RootRouterContext } from "@/router.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<RootRouterContext>()({
  component: RootComponent,
  errorComponent: RootErrorComponent,
});

function RootComponent() {
  const router = useRouter();
  const { bodyTags, headTags  } = router.options.context
  
  
  

  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {headTags?.()}
      </head>

      <body>
        <NavBar />

        <hr />

        <div className="root-content">
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </div>

        <DehydrateRouter />

        <TanStackRouterDevtools />

        {bodyTags?.()}
      </body>
    </html>
  );
}

function NavBar() {
  return (
    <div className="py-2 px-4 flex gap-5">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>
      <Link className="[&.active]:font-bold" to="/expenses">
        expenses
      </Link>
      <Link className="[&.active]:font-bold" to="/create-expense">
        create expenses
      </Link>
    </div>
  );
}

function RootErrorComponent({ error }: ErrorComponentProps) {
  if (error instanceof Error) {
    return <div>{error.message}</div>;
  }

  return <ErrorComponent error={error} />;
}

export function DehydrateRouter() {
  const router = useRouter();

  const dehydrated = router.dehydratedData || {
    router: router.dehydrate(),
    payload: router.options.dehydrate?.(),
  };

  // Use jsesc to escape the stringified JSON for use in a script tag
  const stringified = jsesc(router.options.transformer.stringify(dehydrated), {
    isScriptContext: true,
    wrap: true,
  });

  return (
    <script
      id="__TSR_DEHYDRATED__"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          window.__TSR_DEHYDRATED__ = {
            data: ${stringified}
          }
        `,
      }}
    />
  );
}
