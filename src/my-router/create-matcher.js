import createRouteMap from '@/my-router/create-route-map';

function createMatcher (routes) {
  const pathMap = createRouteMap(routes);
  const match = (path) => {
    return pathMap[path];
  };
  return {
    match
  };
}

export default createMatcher;
