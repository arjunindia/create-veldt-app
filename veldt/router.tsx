/**
 * @module veldt/router
 * @desc Veldt router module.
 * @since 0.0.1
 *
 */
import veldt from "veldt";
type RouteProps = {
  path?: string | string[];
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
  const match = path === url;

  if (match) {
    if (Component) {
      return <Component />;
    } else {
      return <>{children}</>;
    }
  }
};

export { Route };
