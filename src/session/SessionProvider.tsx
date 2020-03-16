import React, { createContext, useState, useEffect, useContext } from 'react';
import { FullPageLoading } from 'bonde-styleguide';
import { ApolloProvider } from '@apollo/react-hooks';
import SessionStorage from './SessionStorage';
import createGraphQLClient from './graphql-client';
import FetchUser from './FetchUser';
import FetchCommunities from './FetchCommunities';
import redirectToLogin from './redirectToLogin';
import { Context } from './types';

/**
 * Responsible to control session used on cross-storage
 **/

const SessionContext = createContext({
  signing: true,
  authenticated: false,
} as Context);

interface SessionProviderProps {
  children: any;
  baseLayout: any;
}

export default function SessionProvider({
  children,
  baseLayout: BaseLayout,
}: SessionProviderProps) {
  const [defaultCommunity, setDefaultCommunity] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [session, setSession] = useState({
    signing: true,
    authenticated: false,
    refetchCount: 0,
  });

  const storage = new SessionStorage();

  const fetchSession = () => {
    storage
      .getAsyncSession()
      .then(({ token, community }: any = {}) => {
        if (!token) throw Error('unauthorized');

        setSession({ ...session, signing: false, authenticated: true });
        setToken(token);
        setDefaultCommunity(community);
        return Promise.resolve();
      })
      .catch((err: any) => {
        // TODO: change url admin-canary
        if (err && err.message === 'unauthorized') {
          redirectToLogin();
          setSession({ ...session, signing: false });
        } else {
          // reload fetchSession when error not authorized
          console.log('err', err.message);
          setSession({ ...session, refetchCount: session.refetchCount++ });
          if (session.refetchCount < 3) fetchSession();
        }
      });
  };

  useEffect(() => {
    if (!token) return fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const logout = () =>
    storage
      .logout()
      .then(() => redirectToLogin())
      .catch((err: any) => console.log('err', err)); // TODO: Tratar erros

  const setCommunityOnStorage = (community: any) =>
    storage.setAsyncItem('community', community);

  const sessionProps = {
    authenticated: session.authenticated,
    signing: session.signing,
    defaultCommunity,
    token,
    logout,
  };

  return session.signing ? (
    <FullPageLoading bgColor="#fff" message="Carregando sessão..." />
  ) : (
    <ApolloProvider client={createGraphQLClient(sessionProps)}>
      {/* Impplements provider with token recovered on cross-storage */}
      <FetchUser>
        {/* Check token validate and recovery user infos */}
        {(user: any) => (
          <FetchCommunities
            variables={{ userId: user.user.id }}
            defaultCommunity={defaultCommunity}
            onChange={setCommunityOnStorage}
          >
            {(communities: any) => (
              <SessionContext.Provider
                value={{ ...sessionProps, ...user, ...communities }}
              >
                {!!BaseLayout ? <BaseLayout>{children}</BaseLayout> : children}
              </SessionContext.Provider>
            )}
          </FetchCommunities>
        )}
      </FetchUser>
    </ApolloProvider>
  );
}

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionHOC = (WrappedComponent: any, opts?: any) =>
  class extends React.Component {
    static contextType = SessionContext;

    render() {
      return opts && opts.required && !this.context.community ? (
        <div>Você deve selecionar uma comunidade</div>
      ) : (
        <WrappedComponent {...this.props} session={this.context} />
      );
    }
  };
