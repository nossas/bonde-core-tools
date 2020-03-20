import React, { createContext, useContext } from 'react';
import FetchUser from './FetchUser';
import FetchCommunities from './FetchCommunities';
import { useSession } from './SessionProvider';
import { UserContext } from './types';

/**
 * Responsible to control session used on cross-storage
 **/
interface UserProviderProps {
  children: any;
}

const Context = createContext({});

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { isLogged, loading: Loading, logout } = useSession();

  return isLogged ? (
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
  ) : (
    <h3>Redirecionar para Módulo de Autenticação</h3>
  );
};

export const useUser = (): UserContext => useContext(Context) as UserContext;

export default UserProvider;
