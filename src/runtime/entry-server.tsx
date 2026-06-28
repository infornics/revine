import React from "react";
import ReactDOMServer from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom/server";
import { routes } from "revine/routing";
// Re-export getPageMetadata so the server bundle exposes it
export { getPageMetadata } from "revine/routing";

export async function render(url: string) {
  const handler = createStaticHandler(routes);
  const fetchRequest = new Request(url, { method: "GET" });

  const context = await handler.query(fetchRequest);

  // If context is a Response (e.g. redirect from a loader), return it directly
  if (context instanceof Response) {
    return {
      html: "",
      statusCode: context.status,
      headers: Object.fromEntries(context.headers.entries()),
      redirect: context.headers.get("Location") || "/",
    };
  }

  const router = createStaticRouter(handler.dataRoutes, context);

  const html = ReactDOMServer.renderToString(
    <StaticRouterProvider router={router} context={context} />
  );

  return {
    html,
    statusCode: context.statusCode ?? 200,
    headers: {},
    redirect: null,
  };
}
