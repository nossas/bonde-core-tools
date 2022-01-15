import React, { createContext, useEffect, useState } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache, gql } from '@apollo/client';
import Cookies from 'js-cookie';
import { Community } from './types';

const FETCH_SESSION_QUERY = gql`
  query Session {
    currentUser: get_current_user {
      id
      email
      avatar
      firstName: first_name
      lastName: last_name
      createdAt: created_at
      isAdmin: is_admin
    }

    communities {
      id
      name
      city
      description
      image
      created_at
      updated_at
      mailchimp_api_key
      mailchimp_list_id
      mailchimp_group_id
      fb_link
      twitter_link
      facebook_app_id
      email_template_from
      modules
      signature

      recipient {
        id
        pagarme_recipient_id
        transfer_day: recipient(path: "transfer_day")
        transfer_interval: recipient(path: "transfer_interval")
        transfer_enabled: recipient(path: "transfer_enabled")
        bank_account: recipient(path: "bank_account")
      }
    }
  }
`;

const createGraphQLClient = (uri: string) => {
  const options = {
    uri,
    cache: new InMemoryCache(),
    credentials: 'include',
    headers: {
      'client-name': 'bonde-core-tools [web]',
      'client-version': '1.0.0'
    }
  };

  return new ApolloClient(options);
}

export const Context = createContext({});

interface ProviderProperties {
  uri: string;
  environment: 'development' | 'staging' | 'production';
  fetchData?: boolean;
}

const Provider: React.FC<ProviderProperties> = ({
  uri,
  fetchData,
  environment,
  children
}) => {
  const [fetching, setFetching] = useState(true);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [communities, setCommunities] = useState([]);
  const [community, setCommunity] = useState(Cookies.get('communiy') as any);
  // ApolloClient
  const client = createGraphQLClient(uri);
  // AppDomain
  const appDomain: string = environment === 'production' ? 'bonde.org' : 'staging.bonde.org';

  const fetch = async () => {
    try {
      const { data } = await client.query({ query: FETCH_SESSION_QUERY  });
      setCurrentUser(data.currentUser[0]);
      setCommunities(data.communities);
      setFetching(false);
    } catch (err) {
      if ((err as any).message === "field \"get_current_user\" not found in type: 'query_root'") {
        window.location.href = `https://accounts.${appDomain}/login`
      } else {
        console.log('Provider fetch:', err);
        setCurrentUser(undefined);
        setCommunities([]);
        setFetching(false);
      }
    }
  }

  useEffect(() => {
    if (fetchData) fetch();
  }, [fetchData])

  const session = {
    fetching,
    currentUser,
    communities,
    community,
    updateSession: (key: string, value: any) => new Promise((resolve) => {
      if (key === 'community') {
        Cookies.set('community', value, { path: '', domain: `.${appDomain}` });
        setCommunity(value);
      }
      return resolve(value);
    }),
    logout: () => {
      Cookies.remove('session', { path: '', domain: `.${appDomain}` });
      window.location.href = `https://accounts.${appDomain}/login`;
    },
    apps: {
      'settings': `https://admin-canary.${appDomain}/community/settings`,
      'redes': `https://redes.${appDomain}`,
      'chatbot': `https://chatbot.${appDomain}`,
      'mobilization': `https://app.${appDomain}`
    }
  }

  return (
    <ApolloProvider client={client}>
      {fetchData && fetching ? 'Carregando sessão....' : (
        <Context.Provider value={session}>
          {children}
        </Context.Provider>
      )}
    </ApolloProvider>
  );
}

export default Provider;