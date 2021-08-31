import React from 'react';
import {
  Dropdown,
  DropdownImageInput,
  DropdownImageItem,
  Stack
} from 'bonde-components';
import { useSession } from '../SessionProvider';
import CommunityMenu from './CommunityMenu';

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
    <Stack direction="row" spacing={4}>
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
    </Stack>
  );
};

export default CommunitiesDropdown;
