import React from 'react';
import styled from 'styled-components';
import { Main, Footer, Navbar } from 'bonde-components';

import CommunitiesDropdown from './CommunitiesDropdown';
import UserDropdown from './UserDropdown';

interface ContentProps {
  bgColor: string;
}

const Content = styled.div<ContentProps>`
  display: flex;
  flex-grow: 1;
  background-color: ${props => props.bgColor};
`;

interface BondeSessionUIProps {
  indexRoute: string;
  bgColor?: string;
  disableNavigation?: boolean;
}

const BondeSessionUI: React.FC<BondeSessionUIProps> = ({
  children,
  bgColor,
  disableNavigation,
  indexRoute,
}) => {
  return (
    <Main>
      <Navbar
        indexRoute={indexRoute}
        brand={disableNavigation ? 'default' : 'small'}
      >
        {disableNavigation ? <div /> : <CommunitiesDropdown />}
        <UserDropdown />
      </Navbar>
      <Content bgColor={bgColor || 'rgb(247,247,247)'}>{children}</Content>
      <Footer />
    </Main>
  );
};

BondeSessionUI.defaultProps = {
  disableNavigation: false,
};

export default BondeSessionUI;
