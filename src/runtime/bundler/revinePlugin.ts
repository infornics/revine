const VIRTUAL_ROUTING_ID = "\0revine:routing";

/**
 * The Revine Vite plugin.
 *
 * Provides a virtual module for `revine/routing` so that:
 *  - `import.meta.glob` is resolved by Vite in the *project* context (not node_modules)
 *  - React runtime is resolved from the project's own node_modules
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function revinePlugin(): any {
  return {
    name: "revine",

    resolveId(id: string) {
      if (id === "revine/routing") {
        return VIRTUAL_ROUTING_ID;
      }
    },

    // Return the routing source as a virtual module.
    // Because it's virtual (not inside node_modules), Vite processes
    // import.meta.glob and all imports normally in the project context.
    load(id: string) {
      if (id === VIRTUAL_ROUTING_ID) {
        return `
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense, createElement } from "react";

// Eagerly load NotFound from the project's src directory.
const notFoundModules = import.meta.glob("/src/NotFound.tsx", { eager: true });
const NotFoundComponent = Object.values(notFoundModules)[0]?.default;

// Lazily load all page components under /src/pages.
const pages = import.meta.glob("/src/pages/**/*.tsx");

const routes = Object.entries(pages).map(([filePath, component]) => {
  let cleaned = filePath.replace(/\\\\/g, "/");
  cleaned = cleaned.replace(/.*\\/pages\\//, "");
  cleaned = cleaned.replace(/\\.tsx$/i, "");
  cleaned = cleaned.replace(/\\/index$/, "");
  cleaned = cleaned.replace(/\\[(\\w+)\\]/g, ":$1");
  if (cleaned === "index") cleaned = "";

  const routePath = cleaned === "" ? "/" : \`/\${cleaned}\`;
  const Component = lazy(component);

  return {
    path: routePath,
    element: createElement(
      Suspense,
      { fallback: createElement("div", null, "Loading\u2026") },
      createElement(Component)
    ),
  };
});

// 404 fallback
routes.push({
  path: "*",
  element: NotFoundComponent
    ? createElement(NotFoundComponent)
    : createElement("div", null, "404 - Page Not Found"),
});

export const router = createBrowserRouter(routes);
`;
      }
    },
  };
}
