import React from 'react';
import CommunitiesDropdown from './CommunitiesDropdown';
import { Main, Footer, Navbar, Body } from 'bonde-components';

interface SessionPageProps {
  indexRoute: string;
}

export const SessionPage: React.FC<SessionPageProps> = ({
  children,
  indexRoute,
}) => {
  return (
    <Main>
      <Navbar indexRoute={indexRoute} brand="small">
        <CommunitiesDropdown />
      </Navbar>
      <Body>{children}</Body>
      <Footer />
    </Main>
  );
};
