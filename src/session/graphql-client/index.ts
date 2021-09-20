import { ApolloClient, InMemoryCache } from '@apollo/client';

export default (uri: string, session: any = {}, policies: any = {}): any => {
  const apolloClientOpts: any = {
    uri,
    cache: new InMemoryCache(policies),
    headers: {
      'client-name': 'bonde-core-tools [web]',
      'client-version': '1.0.0',
    },
  };

  if (session.token) {
    apolloClientOpts.headers['authorization'] = `Bearer ${session.token}`;
  }

  return new ApolloClient(apolloClientOpts);
};
