import { type ApiRoutes } from "@/server";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

const server  = hc<ApiRoutes>("http://localhost:3000/")

export const api = client.api

export const serverApi = server.api;
