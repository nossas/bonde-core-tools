import React, { createContext, useState, useContext } from 'react';
import { ApolloProvider } from '@apollo/client';
import Cookies from 'js-cookie';
// import SessionStorage from './SessionStorage';
import createGraphQLClient from './graphql-client';
import FetchUser from './FetchUser';
import FetchCommunities from './FetchCommunities';
import { SessionContext } from './types';
// import nextURI from './nextURI';
import settings from '../settings';
import { Config, Environment } from '../settings/types';

/**
 * Responsible to control session used on cross-storage
 **/
const Context = createContext({
  // signing: true,
  // isLogged: false,
});

interface LoadingProps {
  fetching: 'session' | 'redirect' | 'module';
}

interface SessionProviderProps {
  children: any;
  loading: React.FC<LoadingProps>;
  environment: Environment;
  // For props fetchData true, userInfo and communities are fetched. Default: false
  fetchData?: boolean;
  extraConfig?: Config;
  policies?: Record<string, any>
}

const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
  environment,
  extraConfig,
  fetchData,
  loading: Loading,
  policies
}) => {
  // 0. Start controller states
  // const [redirecting, setRedirecting] = useState(false);
  const [token, setToken] = useState(Cookies.get('session'));
  // const [signing, setSigning] = useState(true);
  // const [refetch, setRefetch] = useState(0);
  // const [community, setCommunity] = useState<any>(undefined);

  // 1. Merge settings to start BondeSessionProvider requests
  const config = Object.assign({}, settings(environment), extraConfig);

  // 2. Create a SessionStorage client connect on cross-storage
  // const storage = new SessionStorage(config.crossStorage);

  // const fetchSession = () => {
    // console.log('fetchSession')
    // Function to fetch a shared session
    // const token = Cookies.get('session');

    // if (!token) {
    //   throw Error('unauthorized');
    // } else {
    //   setToken(token as any);
    //   setSigning(false);
    // }
    // storage
    //   .getAsyncSession()
    //   .then(({ token: stoken, community: scommunity }: any = {}) => {
    //     if (!stoken) throw Error('unauthorized');

    //     setToken(stoken);
    //     setSigning(false);
    //     setCommunity(
    //       !!Object.keys(scommunity || {}).length ? scommunity : undefined
    //     );
    //     return Promise.resolve();
    //   })
    //   .catch((err: any) => {
    //     // TODO: change url admin-canary
    //     if (err && err.message === 'unauthorized') {
    //       if (config && config.accounts) {
    //         window.location.href = nextURI(config.accounts);
    //       }

    //       setToken(undefined);
    //       setSigning(false);
    //     } else {
    //       // reload fetchSession when error not authorized
    //       console.log('err', err.message);
    //       setRefetch(refetch + 1);
    //       if (refetch < 3) fetchSession();
    //     }
    //   });
  // };

  // useEffect(() => {
  //   if (!token) return fetchSession();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [token]);

  const login = (user: any) => new Promise((resolve) => {
    console.log("login", { user });
    setToken(user.token);

    return resolve(user.token);
  });

  const logout = () =>
    // Cookies.remove('session');
    console.log('logout');
    // setToken(undefined);

    // storage
    //   .logout()
    //   .then(() => {
    //     if (config && config.accounts) {
    //       window.location.href = config.accounts;
    //     }

    //     return Promise.resolve();
    //   })
    //   .catch((err: any) => console.log('err', err)); // TODO: Tratar erros */

  const onChange = (props: any) => {
    if (!!props.community) {
      console.log("add community on session");
      // storage.setAsyncItem('community', props.community);
      // setCommunity(props.community);
    }
    if (!!props.url) {
      window.location.href = props.url;
      // setRedirecting(true);
    }
  };

  const onChangeAsync = async (props: any) => {
    return new Promise((resolve: any) => {
      console.log("onChange promise", props);
      onChange(props);

      return resolve();
    });
  };

  const session = {
    // storage,
    // signing,
    token,
    // community,
    onChange,
    onChangeAsync,
    login,
    logout,
    config,
    // isLogged: !!token,
    // loading: Loading,
  };

  console.log("session", session);
  console.log("Cookie", Cookies.get('session'));

  // return signing ? (
    // <Loading fetching="session" />
  // ) : redirecting ? (
    // <Loading fetching="module" />
  // ) : 
  return (
    <ApolloProvider client={createGraphQLClient(config.apiGraphql, session, policies)}>
      {fetchData && token ? (
        <FetchUser loading={Loading} logout={logout}>
          {/* Check token validate and recovery user infos */}
          {(user: any) => (
            <FetchCommunities loading={Loading}>
              {(communities: any) => {
                console.log("communities", { communities });
                return (
                  <Context.Provider
                    value={{ ...session, ...user, ...communities }}
                  >
                    {children}
                  </Context.Provider>
                )
              }}
            </FetchCommunities>
          )}
        </FetchUser>
      ) : (
        <Context.Provider value={session}>{children}</Context.Provider>
      )}
    </ApolloProvider>
  );
};

SessionProvider.defaultProps = {
  environment: 'development',
  fetchData: false,
};

export const useSession = (): SessionContext =>
  useContext(Context) as SessionContext;

export default SessionProvider;
