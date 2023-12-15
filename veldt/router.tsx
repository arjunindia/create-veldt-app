/**
 * @module veldt/router
 * @desc Veldt router module.
 * @since 0.0.1
 *
 */
import veldt from "veldt";
type RouteProps = {
  path?: string;
  Component?: any;
  exact?: boolean;
  strict?: boolean;
  children?: any;
};
const Route = ({
  path,
  Component,
  exact = false,
  strict = false,
  children,
}: RouteProps) => {
  const url = window.location.pathname;
  const parsedPath = path?.split("/");
  const parsedUrl = url.split("/");
  let match = true;
  let params: { [key: string]: string } = {};
  parsedPath?.forEach((path, index) => {
    if (path.substring(0, 1) === ":") {
      params[path.substring(1)] = parsedUrl[index];
    }
    if (path !== parsedUrl[index]) {
      return (match = false);
    }
  });
  if (match) {
    if (Component) {
      return <Component />;
    } else {
      return <>{children}</>;
    }
  }
};

const Link = ({ to, children }: { to: string; children?: any }) => {
  return (
    <a
      href={to}
      onClick={(e: any) => {
        e.preventDefault();
        window.history.pushState({}, "", to);
        window.dispatchEvent(new Event("popstate"));
      }}
    >
      {children}
    </a>
  );
};

export { Route, Link };
