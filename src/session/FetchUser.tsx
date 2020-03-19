import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { FullPageLoading } from 'bonde-styleguide';

const FETCH_USER = gql`
  query CurrentUser {
    currentUser {
      id
      firstName
      lastName
      email
      createdAt
      avatar
    }
  }
`;

export default ({ children, logout }: any) => {
  const { loading, error, data } = useQuery(FETCH_USER);

  if (loading)
    return <FullPageLoading bgColor="#fff" message="Carregando usuário..." />;

  if (error || !data.currentUser) {
    console.log('error', { error, data });
    logout();
  }

  return children({ user: data.currentUser });
};
