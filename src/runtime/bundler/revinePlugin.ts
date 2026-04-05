const VIRTUAL_ROUTING_ID = "\0revine:routing";

export function revinePlugin(): any {
  return {
    name: "revine",

    resolveId(id: string) {
      if (id === "revine/routing") {
        return VIRTUAL_ROUTING_ID;
      }
    },

    load(id: string) {
      if (id === VIRTUAL_ROUTING_ID) {
        return `
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense, createElement } from "react";

const notFoundModules = import.meta.glob("/src/NotFound.tsx", { eager: true });
const NotFoundComponent = Object.values(notFoundModules)[0]?.default;

const pages = import.meta.glob("/src/pages/**/*.tsx");
const layoutModules = import.meta.glob("/src/pages/**/layout.tsx", { eager: true });

// Collect ALL layouts from root down to the page's directory
// e.g. /src/pages/about/team/index.tsx
//   → [/src/pages/layout.tsx, /src/pages/about/layout.tsx, /src/pages/about/team/layout.tsx]
function getLayoutsForPath(filePath) {
  const parts = filePath.split("/");
  parts.pop(); // remove filename

  const layouts = [];
  const accumulated = [];

  for (const part of parts) {
    accumulated.push(part);
    const layoutKey = accumulated.join("/") + "/layout.tsx";
    if (layoutModules[layoutKey]?.default) {
      layouts.push(layoutModules[layoutKey].default);
    }
  }

  return layouts; // ordered outermost → innermost
}

// Wrap element in layouts from innermost to outermost
// layouts = [RootLayout, AboutLayout] → RootLayout > AboutLayout > page
function wrapWithLayouts(element, layouts) {
  // wrap from right to left so outermost is the final outer wrapper
  return layouts.reduceRight((wrapped, Layout) => {
    return createElement(Layout, null, wrapped);
  }, element);
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
  const layouts = getLayoutsForPath(filePath);

  const pageElement = createElement(
    Suspense,
    { fallback: createElement("div", null, "Loading\u2026") },
    createElement(Component)
  );

  return {
    path: routePath,
    element: layouts.length > 0
      ? wrapWithLayouts(pageElement, layouts)
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
