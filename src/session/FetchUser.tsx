import React from 'react';
import { useQuery, gql } from '@apollo/client';

const FETCH_USER = gql`
  query CurrentUser {
    currentUser {
      id
      firstName
      lastName
      email
      createdAt
      avatar
      isAdmin
    }
  }
`;

export default ({ children, loading: Loading, logout }: any) => {
  const { loading, error, data } = useQuery(FETCH_USER);

  if (loading) return <Loading fetching="user" />;

  if (error || !data.currentUser) {
    console.log('error', { error, data });
    logout();
  }

  return children({ user: data.currentUser });
};
