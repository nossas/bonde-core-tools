import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Redirect, Route, Switch } from "react-router";
import { Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import { Loading, Header, Text } from 'bonde-components';
import {
  BondeSessionProvider,
  BondeSessionUI,
  useUser,
  useSession
} from '../.';
// import LoginForm from './LoginForm'

const history = createBrowserHistory();

const TextLoading = ({ fetching }) => {
  const messages = {
    session: 'Carregando sessão...',
    user: 'Carregando usuário...',
    communities: 'Carregando communities...'
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

const config = {
  loginUrl: 'http://app.bonde.devel:5000/auth/login',
  crossStorageUrl: 'http://cross-storage.bonde.devel',
  graphqlApiUrl: 'https://api-graphql.staging.bonde.org/v1/graphql'
}

const App = () => {
  return (
    <BondeSessionProvider loading={TextLoading} config={config} fetchData>
      <BondeSessionUI.Main indexRoute='/'>
        <BondeSessionUI.Content>
          <ModulePublic />
        </BondeSessionUI.Content>
      </BondeSessionUI.Main>
      {/* <Router history={history}>
        <IsLogged path='/'>
          <BondeSessionUI.Main indexRoute='/admin'>
            <BondeSessionUI.Content>
              <Redirect to='/admin' />
              <Route exact path='/admin' component={UserInfo} />
              <Route exact path='/admin/profile'>
                <Header.h2>Profile</Header.h2>
              </Route>
            </BondeSessionUI.Content>
          </BondeSessionUI.Main>
        </IsLogged>
        <NotAuthenticated path='/'>
          <Redirect to='/auth/login' />
        </NotAuthenticated>
        <Route exact path='/login'>
          <LoginForm />
        </Route>
      </Router> */}
    </BondeSessionProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
