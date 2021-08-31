import React from 'react';
import styled from 'styled-components';
import { Main, Footer, Navbar, Flex } from 'bonde-components';

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
  languageTool?: any;
}

const BondeSessionUI: React.FC<BondeSessionUIProps> = ({
  children,
  bgColor,
  disableNavigation,
  indexRoute,
  languageTool: LanguageTool,
}) => {
  return (
    <Main>
      <Navbar
        indexRoute={indexRoute}
        brand={disableNavigation ? 'default' : 'small'}
      >
        <Flex direction="row" grow={1} justify="space-between">
          {disableNavigation ? <div /> : <CommunitiesDropdown />}
          <UserDropdown />
        </Flex>
      </Navbar>
      <Content bgColor={bgColor || 'rgb(247,247,247)'}>{children}</Content>
      {LanguageTool ? (
        <Footer>
          <LanguageTool />
        </Footer>
      ) : (
        <Footer />
      )}
    </Main>
  );
};

BondeSessionUI.defaultProps = {
  disableNavigation: false,
};

export default BondeSessionUI;
