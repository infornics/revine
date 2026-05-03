import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { MiddlewareFn } from "../runtime/middleware.js";

type Props = {
    middleware: MiddlewareFn;
    children: React.ReactNode;
    loadingFallback?: React.ReactNode;
};

export function MiddlewareGuard({ middleware, children, loadingFallback }: Props) {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState<"pending" | "allowed" | "redirecting">("pending");

    useEffect(() => {
        setStatus("pending");

        const request = {
            pathname: location.pathname,
            searchParams: new URLSearchParams(location.search),
        };

        Promise.resolve(middleware(request)).then((response) => {
            if (response.type === "redirect") {
                setStatus("redirecting");
                navigate(response.destination, { replace: true });
            } else {
                setStatus("allowed");
            }
        });
    }, [location.pathname]);

    if (status === "pending" || status === "redirecting") {
        return <>{loadingFallback ?? null}</>;
    }

    return <>{children}</>;
}