import type { ReactNode } from "react";
import {
  NavLink as RouterNavLink,
  type NavLinkProps as RouterNavLinkProps,
} from "react-router-dom";

export interface NavLinkProps extends Omit<RouterNavLinkProps, "to"> {
  href: string;
  children?: ReactNode;
}

export function NavLink({ href, children, ...rest }: NavLinkProps) {
  return (
    <RouterNavLink to={href} {...rest}>
      {children}
    </RouterNavLink>
  );
}
