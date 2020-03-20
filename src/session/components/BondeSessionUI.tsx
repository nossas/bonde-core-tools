import React from 'react';
import { Main, Footer, Navbar, Body } from 'bonde-components';
import CommunitiesDropdown from './CommunitiesDropdown';
import UserDropdown from './UserDropdown';

interface BondeSessionUIProps {
  indexRoute: string;
}

const BondeSessionUI: React.FC<BondeSessionUIProps> = ({
  children,
  indexRoute,
}) => {
  return (
    <Main>
      <Navbar indexRoute={indexRoute} brand="small">
        <CommunitiesDropdown />
        <UserDropdown />
      </Navbar>
      {children}
      <Footer />
    </Main>
  );
};

export default {
  Main: BondeSessionUI,
  Content: Body,
};
