import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

const FETCH_RELATED_COMMUNITIES = gql`
  query RelatedCommunities($userId: Int!) {
    communities(where: { community_users: { user_id: { _eq: $userId } } }) {
      id
      name
      city
      image
      created_at
      updated_at
    }
  }
`;

export default ({ children, variables, loading: Loading }: any) => {
  const { loading, error, data } = useQuery(FETCH_RELATED_COMMUNITIES, {
    variables,
  });

  if (loading) return <Loading fetching="communities" />;

  if (error || !data.communities) {
    console.log('error', { error, data });
    return children({ communities: [] });
  }

  return children({ communities: data.communities });
};
