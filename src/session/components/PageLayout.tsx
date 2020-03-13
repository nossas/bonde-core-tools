import React from 'react';
import styled from 'styled-components';
import { Header, Page, Flexbox2 as Flexbox, Footer } from 'bonde-styleguide';
import { useSession } from '../SessionProvider';
import UserDropdown from './UserDropdown';
import CommunitiesDropdown from './CommunitiesDropdown';

const SessionHeader = () => {
  const {
    user,
    logout,
    communities,
    community,
    onChangeCommunity,
  } = useSession();

  return (
    <Header>
      <Flexbox horizontal spacing="between">
        <CommunitiesDropdown
          communities={communities}
          community={community}
          onChange={onChangeCommunity}
        />
        <UserDropdown user={user} logout={logout} />
      </Flexbox>
    </Header>
  );
};

const Main = styled.main`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
`;
const StyledFooter = styled(Footer)`
  position: relative;
`;

export const SessionPage = ({ children, ...props }: any) => (
  <Main>
    <SessionHeader />
    <Page {...props}>{children}</Page>
    <StyledFooter fixed />
  </Main>
);
