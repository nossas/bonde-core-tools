import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SessionProvider, SessionHOC } from '../.';

const UserInfo = SessionHOC(({ session }: any) => {
  console.log('session', session)
  return (
    <div>
      <p>Logged with {session.user.firstName}.</p>
    </div>
  )
})

const App = () => {
  return (
    <SessionProvider>
      <UserInfo />
    </SessionProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
