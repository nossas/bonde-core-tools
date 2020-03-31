import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Redirect, Route, Switch } from "react-router";
import { Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import { Loading, Header, Text } from 'bonde-components';
import { BondeSessionProvider, BondeSessionUI, useSession } from '../../.';
import modules from './config';

const history = createBrowserHistory();

const TextLoading = ({ fetching }) => {
  const messages = {
    session: 'Carregando sessão...',
    user: 'Carregando usuário...',
    communities: 'Carregando communities...',
    redirect: 'Redirecionando para login...'
  }
  return <Loading fullsize message={messages[fetching]} />
}

const ModulePublic = () => {
  const { user, community } = useSession()

  return (
    <div>
      <Header.h3>Welcome {user.firstName}!</Header.h3>
      {!!community && <Text>{community.name}</Text>}
    </div>
  )
}

const extraConfig = {
  apiGraphql: 'https://api-graphql.staging.bonde.org/v1/graphql'
}

const App = () => {
  return (
    <BondeSessionProvider
      fetchData
      extraConfig={extraConfig}
      loading={TextLoading}
    >
      <BondeSessionUI.Main indexRoute='/'>
        <BondeSessionUI.Content>
          <ModulePublic />
        </BondeSessionUI.Content>
      </BondeSessionUI.Main>
    </BondeSessionProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
