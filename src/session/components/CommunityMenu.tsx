import React from 'react';
import {
  IconButton,
  Stack,
  SettingsIcon,
  PagesIcon,
  BotIcon,
  NetIcon
} from 'bonde-components';
import { useSession } from '../SessionProvider';
import { Community } from '../types';

interface ItemsConfig {
  [index: string]: string[];
}

const items: ItemsConfig = {
  settings: [SettingsIcon, 'Configurações'],
  mobilization: [PagesIcon, 'Mobilizações'],
  redes: [NetIcon, 'Redes'],
  chatbot: [BotIcon, 'Chatbot'],
};

interface CommunityMenuProps {
  community: Community;
  inverted?: boolean;
}

const CommunityNavigation = ({ community, inverted }: CommunityMenuProps): React.ReactElement => {
  const { onChange, config } = useSession();
  const { modules } = community;

  const handleClick = (url: string) => async () => {
    await onChange({ community, url });
  };

  return (
    <Stack direction="row" spacing={2}>
      {Object.keys(modules)
        .filter((key: string) => !!modules[key])
        .map((key: any, index: number) => {
          const moduleHost: string = new URL('', config[key]).host;
          const baseHost: string = new URL('', window.location.href).host;
          const IconComponent: any = items[key][0];

          return (
            <IconButton
              key={`community-navigation-${index}`}
              variant="link"
              colorScheme="gray"
              title={items[key][1]}
              icon={(
                <IconComponent
                  color={inverted ? "white" : "gray.300"}
                  _hover={{ color: "pink.100", stroke: "pink.100" }}
                  boxSize={4}
                />
              )}
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
