import React from 'react';
import {
  Dropdown,
  DropdownImageInput,
  DropdownImageItem,
} from 'bonde-components';
import { useSession } from '../SessionProvider';

const toItem = (c: any) =>
  !!c
    ? {
        img: { src: c.image || 'https://via.placeholder.com/100', alt: c.name },
        label: c.name,
        id: c.id,
      }
    : undefined;

const CommunitiesDropdown = () => {
  const { community, communities, onChange } = useSession();

  return (
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
  );
};

export default CommunitiesDropdown;
