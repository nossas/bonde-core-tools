import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

const FETCH_RELATED_COMMUNITIES = gql`
  query RelatedCommunities($userId: Int!) {
    communities(where: { community_users: { user_id: { _eq: $userId } } }) {
      id
      name
      city
      description
      image
      created_at
      updated_at
      mailchimp_api_key
      mailchimp_list_id
      mailchimp_group_id
      fb_link
      twitter_link
      facebook_app_id
      email_template_from
      modules
      recipient {
        id
        transfer_day: recipient(path: "transfer_day")
        transfer_interval: recipient(path: "transfer_interval")
        transfer_enabled: recipient(path: "transfer_enabled")
        bank_account: recipient(path: "bank_account")
      }
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
