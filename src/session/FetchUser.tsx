import React from 'react';
import { useQuery, gql } from '@apollo/client';

const FETCH_USER = gql`
  query {
    currentUser: get_current_user {
      id
      email
      avatar
      firstName: first_name
      lastName: last_name
      createdAt: created_at
      isAdmin: is_admin
    }
  }
`;

export default ({ children, loading: Loading, logout }: any) => {
  const { loading, error, data } = useQuery(FETCH_USER);

  console.log("loading, error, data", { loading, error, data });
  if (loading) return <Loading fetching="user" />;

  if (error || !data.currentUser) {
    console.log('error', { error, data });
    logout();
  }

  return children({ user: data.currentUser[0] });
};
