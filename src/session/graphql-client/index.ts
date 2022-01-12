import { ApolloClient, InMemoryCache } from '@apollo/client';
import cookies from 'js-cookie';

export default (uri: string, session: any = {}, policies: any = {}): any => {
  console.log("cookies.session", cookies.get('session'));
  const apolloClientOpts: any = {
    uri,
    cache: new InMemoryCache(policies),
    credentials: 'include',
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
