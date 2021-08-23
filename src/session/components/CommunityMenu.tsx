import React from 'react';
import { IconButton, Icon, Stack } from 'bonde-components';
import { useSession } from '../SessionProvider';
import { Community } from '../types';

interface ItemsConfig {
  [index: string]: string[];
}

const items: ItemsConfig = {
  settings: ['Settings', 'Configurações'],
  mobilization: ['Window', 'Mobilizações'],
  redes: ['Network', 'Redes'],
  chatbot: ['Bot', 'Chatbot'],
};

interface CommunityMenuProps {
  community: Community;
  inverted?: boolean;
  size?: string | string[]
}

const CommunityNavigation = ({ community, size }: CommunityMenuProps): React.ReactElement => {
  const { onChange, config } = useSession();
  const { modules } = community;

  const handleClick = (url: string) => async () => {
    await onChange({ community, url });
  };

  return (
    <Stack direction="row" size={size}>
      {Object.keys(modules)
          .filter((key: string) => !!modules[key])
          .map((key: any, index: number) => {
            const moduleHost: string = new URL('', config[key]).host;
            const baseHost: string = new URL('', window.location.href).host;

            return (
              <IconButton
                key={`community-navigation-${index}`}
                variant="link"
                title={items[key][1]}
                icon={<Icon name={items[key][0]} />}
                onClick={handleClick(config[key])}
                active={moduleHost === baseHost}
              />
            );
          })
      }
    </Stack>
  );
}

export default CommunityNavigation;
