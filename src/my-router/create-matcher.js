import createRouteMap from '@/my-router/create-route-map';

export const createRoute = (route, path) => {
  const matched = [];
  while (route) {
    matched.push(route);
    route = route.parent;
  }
  return {
    path,
    matched
  };
};

function createMatcher (routes) {
  const pathMap = createRouteMap(routes);
  // need to get all matched route, then find current routes by matched and router-view
  const match = (path) => {
    const route = pathMap[path];
    return createRoute(route, path);
  };
  return {
    match
  };
}

export default createMatcher;
