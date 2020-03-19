import { setContext } from 'apollo-link-context';
import { handleErrorMiddleware } from './GraphQLHandleError';

export default (session: any = {}) => {
  const context = setContext((_, { headers }: any): any => {
    if (session.token) {
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${session.token}`,
        },
      };
    }
  });

  const handleError = handleErrorMiddleware(({ networkError }: any) => {
    if (
      networkError &&
      (networkError.statusCode === 401 || networkError.statusCode === 403)
    ) {
      session.logout();
    }
  });

  return { context, handleError };
};
