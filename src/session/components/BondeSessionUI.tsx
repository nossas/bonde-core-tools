import React from 'react';
import CommunitiesDropdown from './CommunitiesDropdown';
import { Main, Footer, Navbar, Body } from 'bonde-components';

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
