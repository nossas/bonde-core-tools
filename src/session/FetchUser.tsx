import React from 'react';
import { useQuery, gql } from '@apollo/client';

const FETCH_USER = gql`
query CurrentUser {
  current_user  {
    id
    first_name
    last_name
    email
    created_at
    avatar
    is_admin
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
