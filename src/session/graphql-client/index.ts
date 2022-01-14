import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, concat } from '@apollo/client';
import cookies from 'js-cookie';

export default (uri: string, _session: any = {}, policies: any = {}): any => {
  const apolloClientOpts: any = {
    cache: new InMemoryCache(policies),
    credentials: 'include',
    request: (args1: any, args2: any) => {
      console.log('request', { args1, args2 });
    },
    headers: {
      'client-name': 'bonde-core-tools [web]',
      'client-version': '1.0.0',
    },
  };


  const httpLink = new HttpLink({
    uri,
    credentials: 'include'
  })

  const cookieSessionMiddleware = new ApolloLink((operation, forward) => {
    console.log("cookies.session", cookies.get('session'));
    console.log('cookieSessionMiddleware context', operation.getContext());
    // add the authorization to the headers
    // operation.setContext({
    //   headers: {
    //     authorization: localStorage.getItem('token') || null,
    //   }
    // });
  
    return forward(operation);
  });

  // if (session.token) {
  //   apolloClientOpts.headers['authorization'] = `Bearer ${session.token}`;
  // }

  return new ApolloClient({
    ...apolloClientOpts,
    link: concat(cookieSessionMiddleware, httpLink)
  });
};
