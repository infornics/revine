export type MiddlewareRequest = {
  pathname: string;
  searchParams: URLSearchParams;
};

export type MiddlewareResponse =
  | { type: "next" }
  | { type: "redirect"; destination: string };

export const middlewareResponse = {
  next: (): MiddlewareResponse => ({ type: "next" }),
  redirect: (destination: string): MiddlewareResponse => ({
    type: "redirect",
    destination,
  }),
};

export type MiddlewareFn = (
  request: MiddlewareRequest,
) => MiddlewareResponse | Promise<MiddlewareResponse>;

export type MiddlewareConfig = {
  publicPaths?: string[]; // paths accessible WITHOUT login
  authPaths?: string[];   // paths only for GUESTS (login, register)
  redirects?: {
    whenAuthenticated?: string; // redirect auth pages to (default: "/")
    whenUnauthenticated?: string; // redirect private pages to (default: "/login")
  };
};