import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { RouterProvider } from "revine";
import { router } from "revine/routing";
import "./styles/global.css";

const container = document.getElementById("root")!;

// If the server already rendered HTML into #root, hydrate it.
// Otherwise fall back to client-side rendering (CSR mode).
const isSSR = container.hasAttribute("data-ssr");

const app = (
  <React.StrictMode>
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  </React.StrictMode>
);

if (isSSR) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
