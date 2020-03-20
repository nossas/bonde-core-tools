import React, { createContext, useState, useEffect, useContext } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import SessionStorage from './SessionStorage';
import createGraphQLClient from './graphql-client';
import FetchUser from './FetchUser';
import FetchCommunities from './FetchCommunities';
import { SessionContext, Config } from './types';
import nextURI from './nextURI';

/**
 * Responsible to control session used on cross-storage
 **/
const Context = createContext({
  signing: true,
  isLogged: false,
} as SessionContext);

interface LoadingProps {
  fetching: 'session';
}

interface SessionProviderProps {
  children: any;
  loading: React.FC<LoadingProps>;
  fetchData: boolean;
  config: Config;
}

const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
  loading: Loading,
  fetchData,
  config,
}) => {
  const [token, setToken] = useState(undefined);
  const [signing, setSigning] = useState(true);
  const [refetch, setRefetch] = useState(0);
  const [community, setCommunity] = useState(undefined);

  const storage = new SessionStorage(config.crossStorageUrl);

  const fetchSession = () => {
    storage
      .getAsyncSession()
      .then(({ token: stoken, community: scommunity }: any = {}) => {
        if (!stoken) throw Error('unauthorized');

        setToken(stoken);
        setSigning(false);
        setCommunity(
          !!Object.keys(scommunity || {}).length ? scommunity : undefined
        );
        return Promise.resolve();
      })
      .catch((err: any) => {
        // TODO: change url admin-canary
        if (err && err.message === 'unauthorized') {
          if (!!config.loginUrl) {
            window.location.href = nextURI(config.loginUrl);
          }

          setToken(undefined);
          setSigning(false);
        } else {
          // reload fetchSession when error not authorized
          console.log('err', err.message);
          setRefetch(refetch + 1);
          if (refetch < 3) fetchSession();
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
      .then(() => {
        if (config.loginUrl) {
          window.location.href = nextURI(config.loginUrl);
        }

        return Promise.resolve();
      })
      .catch((err: any) => console.log('err', err)); // TODO: Tratar erros */

  const onChange = ({ community }: any) => {
    if (!!community) {
      storage.setAsyncItem('community', community);
      setCommunity(community);
    }
  };

  const session = {
    signing,
    token,
    community,
    onChange,
    logout,
    isLogged: !!token,
    loading: Loading,
  };

  return signing ? (
    <Loading fetching="session" />
  ) : (
    <ApolloProvider client={createGraphQLClient(config.graphqlApiUrl, session)}>
      {fetchData && session.isLogged ? (
        <FetchUser loading={Loading} logout={logout}>
          {/* Check token validate and recovery user infos */}
          {(user: any) => (
            <FetchCommunities
              loading={Loading}
              variables={{ userId: user.user.id }}
            >
              {(communities: any) => (
                <Context.Provider value={{ ...user, ...communities }}>
                  {children}
                </Context.Provider>
              )}
            </FetchCommunities>
          )}
        </FetchUser>
      ) : fetchData && !session.isLogged ? (
        <h3>Redirecionar para Módulo de Autenticação</h3>
      ) : (
        <Context.Provider value={session}>{children}</Context.Provider>
      )}
    </ApolloProvider>
  );
};

export const useSession = () => useContext(Context);

export default SessionProvider;
