import { RouteDefinitions } from 'routes';
import { Stream } from 'xstream';

// Example of async layout loading
// This could be shared between the top level routes and this file
const getHeaderLayout = async () => {
  const { HeaderLayout } = await import(/* webpackChunkName: "HeaderLayout" */'layouts/HeaderLayout');
  return HeaderLayout;
};

export const Commits: RouteDefinitions = {
  '/': {
    getComponent: async () => {
      const { List } = await import(/* webpackChunkName: "CommitsList" */'./routes/List');
      return List;
    },
    getLayout: getHeaderLayout
  },
  // Example of providing additional sources based on route parameters
  '/:sha': sha => ({
    getComponent: async () => {
      const { Details } = await import(/* webpackChunkName: "CommitDetails" */'./routes/Details');
      return Details;
    },
    sources: {
      sha$: Stream.of(sha)
    },
    getLayout: getHeaderLayout
  })
};
