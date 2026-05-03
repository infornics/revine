import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  return {
    // Current route info
    pathname: location.pathname,
    params,
    searchParams,
    setSearchParams,

    // Navigation methods
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    prefetch: (_path: string) => {
      // Reserved for future prefetch support
    },
  };
}