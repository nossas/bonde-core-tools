import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Switch } from "react-router";
import { Router } from "react-router-dom";
import { createBrowserHistory } from 'history'
import { SessionProvider, useSession, SessionPage } from '../.';

const history = createBrowserHistory()

const UserInfo = () => {
  const { user } = useSession()

  return <p>Logged with {user.firstName}</p>
}

const App = () => {
  return (
    <SessionProvider SessionLayout={SessionPage}>
      <Router history={history}>
        <Route path="/" component={UserInfo} />
      </Router>
    </SessionProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
