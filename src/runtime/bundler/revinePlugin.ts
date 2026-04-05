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

const notFoundModules = import.meta.glob("/src/NotFound.tsx", { eager: true });
const NotFoundComponent = Object.values(notFoundModules)[0]?.default;

const pages = import.meta.glob("/src/pages/**/*.tsx");

// Static literal array — Vite requires this to be a static string, not dynamic
const layoutModules = import.meta.glob("/src/pages/**/layout.tsx", { eager: true });

// Debug — remove after confirming it works
console.log("[revine] layoutModules found:", Object.keys(layoutModules));
console.log("[revine] pages found:", Object.keys(pages));

function getLayoutForPath(filePath) {
  // Walk up directories looking for a layout.tsx
  // e.g. /src/pages/about/index.tsx → check /src/pages/about/layout.tsx
  //                                 → then /src/pages/layout.tsx
  const parts = filePath.split("/");
  
  // Remove the filename, keep the directory parts
  parts.pop();
  
  while (parts.length >= 2) {
    const layoutKey = parts.join("/") + "/layout.tsx";
    if (layoutModules[layoutKey]?.default) {
      return layoutModules[layoutKey].default;
    }
    parts.pop();
  }
  return null;
}

function toRoutePath(filePath) {
  let cleaned = filePath.replace(/\\\\/g, "/");
  cleaned = cleaned.replace(/.*\\/pages\\//, "");
  cleaned = cleaned.replace(/\\.tsx$/i, "");
  cleaned = cleaned.replace(/\\/index$/, "");
  cleaned = cleaned.replace(/\\([^)]+\\)\\//g, "");
  cleaned = cleaned.replace(/\\[(\\w+)\\]/g, ":$1");
  if (cleaned === "index") cleaned = "";
  return cleaned === "" ? "/" : \`/\${cleaned}\`;
}

const pageEntries = Object.entries(pages).filter(
  ([filePath]) => !filePath.endsWith("/layout.tsx")
);

const routes = pageEntries.map(([filePath, component]) => {
  const routePath = toRoutePath(filePath);
  const Component = lazy(component);
  const Layout = getLayoutForPath(filePath);

  console.log("[revine] route:", routePath, "| layout:", Layout ? "yes" : "none");

  const pageElement = createElement(
    Suspense,
    { fallback: createElement("div", null, "Loading\u2026") },
    createElement(Component)
  );

  return {
    path: routePath,
    element: Layout
      ? createElement(Layout, null, pageElement)
      : pageElement,
  };
});

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
