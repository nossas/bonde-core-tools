import React from 'react';
import { useQuery, gql } from '@apollo/client';

const FETCH_RELATED_COMMUNITIES = gql`
  query RelatedCommunities {
    communities {
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
      signature

      recipient {
        id
        pagarme_recipient_id
        transfer_day: recipient(path: "transfer_day")
        transfer_interval: recipient(path: "transfer_interval")
        transfer_enabled: recipient(path: "transfer_enabled")
        bank_account: recipient(path: "bank_account")
      }
    }
  }
`;

export default ({ children, loading: Loading }: any) => {
  const { loading, error, data } = useQuery(FETCH_RELATED_COMMUNITIES, { fetchPolicy: "network-only" });

  if (loading) return <Loading fetching="communities" />;

  if (error || !data.communities) {
    console.log('error', { error, data });
    return children({ communities: [] });
  }

  return children({ communities: data.communities });
};
