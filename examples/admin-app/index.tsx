import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Redirect, Route, Switch } from "react-router";
import { Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import { Loading } from 'bonde-components';
import { BondeSessionProvider, BondeSessionUI, useSession } from '../../.';
import HomePage from './HomePage';

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
          <HomePage />
        </BondeSessionUI.Content>
      </BondeSessionUI.Main>
    </BondeSessionProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
