import { ApolloLink, Observable } from 'apollo-link';

export const handleErrorMiddleware = (errorHandler: any) => {
  return new ApolloLink((operation: any, forward: any) => {
    return new Observable((observer: any) => {
      let subscription: any;
      try {
        subscription = forward(operation).subscribe({
          next: (result: any) => {
            if (result.errors) {
              errorHandler({
                graphQLErrors: result.errors,
                response: result,
                operation,
              });
            }
            observer.next(result);
          },
          error: (error: any) => {
            errorHandler({
              operation,
              networkError: error,
              // Network errors can return GraphQL errors on for example a 403
              graphQLErrors: error.result && error.result.errors,
            });
          },
          complete: observer.complete.bind(observer),
        });
      } catch (error) {
        errorHandler({ networkError: error, operation });
      }
      return () => {
        if (subscription) subscription.unsubscribe();
      };
    });
  });
};

export class HandleErrorLink extends ApolloLink {
  link: any;

  constructor(errorHandler: any) {
    super();
    this.link = handleErrorMiddleware(errorHandler);
  }

  request(operation: any, forward: any) {
    return this.link.request(operation, forward);
  }
}
