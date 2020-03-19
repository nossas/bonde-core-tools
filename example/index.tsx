import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Switch } from "react-router";
import { Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import { BondeSessionProvider, BondeSessionUI, useSession } from '../.';

const history = createBrowserHistory();

const UserInfo = () => {
  const { community, user } = useSession();

  return (
    <ul>
      <li><b>User:</b> <span>{user.firstName}</span></li>
      {!!community && (
        <li><b>Community:</b> <span>{community.name}</span></li>
      )}
    </ul>
  );
};

const TestSubNavbar = () => (
  <div style={{ width: '100%', height: '50px', background: 'gray' }}>
    <h3 style={{ color: '#fff' }}>Subnav</h3>
  </div>
)

const config = {
  loginUrl: 'http://admin-canary.bonde.devel:5002/auth/login',
  crossStorageUrl: 'http://cross-storage.bonde.devel',
  graphqlApiUrl: 'https://api-graphql.staging.bonde.org/v1/graphql'
}

const App = () => {
  return (
    <BondeSessionProvider config={config}>
      <Router history={history}>
        <BondeSessionUI.Main indexRoute='/'>
          <TestSubNavbar />
          <BondeSessionUI.Content>
            <Route path="/" component={UserInfo} />
          </BondeSessionUI.Content>
        </BondeSessionUI.Main>
      </Router>
    </BondeSessionProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
