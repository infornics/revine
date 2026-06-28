/**
 * Takes the built index.html shell and injects SSR-rendered content.
 * Adds `data-ssr` attribute so entry-client.tsx knows to hydrate.
 */
export function injectSSRContent(
  template: string,
  appHtml: string,
  head?: string
): string {
  let result = template;

  // Replace the empty #root div with SSR content + data-ssr marker
  result = result.replace(
    '<div id="root"></div>',
    `<div id="root" data-ssr="true">${appHtml}</div>`
  );

  // Optionally inject head tags (meta, title, etc.)
  if (head) {
    result = result.replace("</head>", `${head}</head>`);
  }

  return result;
}
