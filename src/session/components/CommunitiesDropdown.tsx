import React from 'react';
import {
  Dropdown,
  DropdownImageInput,
  DropdownImageItem,
} from 'bonde-components';
import styled from 'styled-components';
import { useSession } from '../SessionProvider';
import CommunityMenu from './CommunityMenu';

const WithMenu = styled.div`
  display: flex;
  flex-direction: row;

  ${DropdownImageItem} {
    img {
      border-radius: 30px;
    }

    &:hover {
      background-color: rgb(247, 247, 247);
    }
  }
`;

const toItem = (c: any) =>
  !!c
    ? {
        img: {
          src:
            c.image ||
            `https://via.placeholder.com/100?text=${c.name.substring(0, 1)}`,
          alt: c.name,
        },
        label: c.name,
        id: c.id,
      }
    : undefined;

const CommunitiesDropdown = () => {
  const { community, communities, onChange } = useSession();

  return (
    <WithMenu>
      <Dropdown
        placeholder="Selecione uma comunidade"
        item={toItem(community)}
        items={communities.map(toItem)}
        onSelect={(value: any) => {
          onChange({
            community: communities.find((c: any) => c.id === value.id),
          });
        }}
        dropdownInput={DropdownImageInput}
        dropdownItem={DropdownImageItem}
      />
      {community && <CommunityMenu community={community} inverted />}
    </WithMenu>
  );
};

export default CommunitiesDropdown;
