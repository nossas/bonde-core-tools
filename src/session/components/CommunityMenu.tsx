import React from 'react';
import styled from 'styled-components';
import { Button, Icon } from 'bonde-components';
import { useSession } from '../SessionProvider';
import { Community } from '../types';

const MenuStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  button {
    border: none;
    padding: 0;
  }

  ${Icon} {
    margin-left: 10px;
  }
`;

interface MenuItemProps {
  icon: any;
  title: string;
  onClick: Function;
  inverted?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  onClick,
  inverted,
}) => (
  <Button dark={!inverted} light={inverted} onClick={onClick} title={title}>
    <Icon name={icon} size="small" />
  </Button>
);

MenuItem.defaultProps = {
  inverted: false,
};

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
}

const CommunityMenu: React.FC<CommunityMenuProps> = ({
  community,
  inverted,
}) => {
  const { onChange, config } = useSession();
  const { modules } = community;

  const click = (url: string) => async () => {
    await onChange({ community });
    window.location.href = url;
  };
  return config ? (
    <MenuStyled>
      {Object.keys(modules)
        .filter((key: string) => !!modules[key])
        .map((key: string) => (
          <MenuItem
            inverted={inverted}
            key={key}
            icon={items[key][0]}
            title={items[key][1]}
            onClick={click(config[key])}
          />
        ))}
    </MenuStyled>
  ) : null;
};

CommunityMenu.defaultProps = {
  inverted: false,
};

export default CommunityMenu;
