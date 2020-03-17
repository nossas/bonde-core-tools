import React from 'react';
import {
  Dropdown,
  DropdownImageItem,
  Spacing,
  Icon,
  Flexbox2 as Flexbox,
} from 'bonde-styleguide';
import { Community } from '../types';

interface CommunitiesDropdownProps {
  communities?: Community[];
  community?: Community;
  onChange: Function;
}

const CommunitiesDropdown = ({
  communities = [],
  community,
  onChange,
}: CommunitiesDropdownProps) => {
  return (
    <Flexbox horizontal align="center">
      <Spacing margin={{ right: 10 }}>
        <Icon name="bonde" size={20} />
      </Spacing>
      <Dropdown
        placeholder="Selecione uma comunidade"
        item={community ? { label: community.name } : undefined}
        list={communities.map(c => ({
          img: {
            src: c.image || 'https://via.placeholder.com/35',
            alt: c.name,
          },
          label: c.name,
          id: c.id,
        }))}
        onSelect={({ id }: any) =>
          onChange(communities.filter(c => c.id === id)[0])
        }
        dropdownItem={DropdownImageItem}
      />
    </Flexbox>
  );
};

export default CommunitiesDropdown;
