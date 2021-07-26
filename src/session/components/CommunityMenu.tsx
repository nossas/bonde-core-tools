import React from 'react';
import styled from 'styled-components';
import { Button, Icon } from 'bonde-components';
// import { Module } from '../../settings/types';
import { useSession } from '../SessionProvider';
import { Community } from '../types';

interface MenuStyledProps {
  inverted?: boolean;
}

const MenuStyled = styled.div<MenuStyledProps>`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  button {
    border: none;
    padding: 0;

    ${props =>
      props.inverted &&
      `
      &.active {
        ${Icon} {
          &.stroke {
            path {
              stroke: #ee0099;
            }
          }
          &.fill {
            path {
              fill: #ee0099;
            }
          }
        }
      }
    `}
  }

  ${Icon} {
    margin-left: 10px;
  }
`;

MenuStyled.defaultProps = {
  inverted: false,
};

interface MenuItemProps {
  active?: boolean;
  icon: any; // eslint-disable-line react/prop-types
  title: string;
  onClick: any; // eslint-disable-line react/prop-types
  inverted?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  onClick,
  inverted,
  active,
}) => (
  <Button
    className={active ? 'active' : ''}
    dark={!inverted}
    light={inverted}
    onClick={onClick}
    title={title}
  >
    <Icon name={icon} size="small" />
  </Button>
);

MenuItem.defaultProps = {
  inverted: false,
  active: false,
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
    await onChange({ community, url });
  };

  return (
    <MenuStyled inverted={inverted}>
      {Object.keys(modules)
        .filter((key: string) => !!modules[key])
        .map((key: any) => {
          const moduleHost: string = new URL('', config[key]).host;
          const baseHost: string = new URL('', window.location.href).host;

          return (
            <MenuItem
              active={moduleHost === baseHost}
              inverted={inverted}
              key={key}
              icon={items[key][0]}
              title={items[key][1]}
              onClick={click(config[key])}
            />
          );
        })}
    </MenuStyled>
  );
};

CommunityMenu.defaultProps = {
  inverted: false,
};

export default CommunityMenu;
