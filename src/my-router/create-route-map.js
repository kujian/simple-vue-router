function iterate (routes, pathMap, parent) {
  routes.forEach(route => {
    const { path, children, ...rest } = route;
    const normalizedPath = parent ? parent.path + '/' + path : path;
    pathMap[normalizedPath] = rest;
    if (children) {
      iterate(children, pathMap, route);
    }
  });
}

const createRouteMap = (routes, pathMap = {}) => {
  iterate(routes, pathMap);
  return pathMap;
};

export default createRouteMap;
