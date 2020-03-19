import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Switch } from "react-router";
import { Router } from "react-router-dom";
import { createBrowserHistory } from 'history'
import { SessionProvider, useSession, SessionPage } from '../.';

const history = createBrowserHistory()

const UserInfo = () => {
  const { community, user } = useSession()

  return (
    <ul>
      <li><b>User:</b> <span>{user.firstName}</span></li>
      {!!community && (
        <li><b>Community:</b> <span>{community.name}</span></li>
      )}
    </ul>
}

const config = {
  loginUrl: 'http://admin-canary.bonde.devel:5002/auth/login',
  crossStorageUrl: 'http://cross-storage.bonde.devel',
  graphqlApiUrl: 'https://api-graphql.staging.bonde.org/v1/graphql'
}

const App = () => {
  return (
    <SessionProvider baseLayout={SessionPage} config={config}>
      <Router history={history}>
        <Route path="/" component={UserInfo} />
      </Router>
    </SessionProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
