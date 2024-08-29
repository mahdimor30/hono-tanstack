import { serve } from "@hono/node-server";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { Hono } from "hono";

import { expensesRoute } from "./server/router/expenses";
import { handlePage } from "./lib/strimer";

const server = new Hono()
  .use("*", logger())
  .use("/assets/*", serveStatic({ root: "./dist/public" }))
  .use("/favicon.ico", serveStatic({ path: "./dist/public/favicon.ico" }));

const apiRoutes = server.route("/api/expenses", expensesRoute);
server.get("*", handlePage);
if (import.meta.env.PROD) {
  const port = Number(process.env["PORT"] || 3000);

  // Bun.serve({
  //   port: 3000,
  //   fetch: server.fetch,

  // })
  serve(
    {
      port,
      fetch: server.fetch,
    },
    () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    },
  );
}

export default server;

export type ApiRoutes = typeof apiRoutes;
