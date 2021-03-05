import React from 'react';
import {
  Dropdown,
  DropdownIconItem,
  DropdownImageItem,
  Header,
} from 'bonde-components';
import { useSession } from '../SessionProvider';

const UserDropdown = () => {
  const { user, logout } = useSession();
  const name = `${user.firstName} ${user.lastName}`;

  console.log('UserDropdown render');

  return (
    <Dropdown
      selectable={false}
      direction="right"
      placeholder={name}
      items={[
        {
          clickable: false,
          img: {
            src: user.avatar || 'http://via.placeholder.com/35x35?text=U',
            alt: name,
          },
          name: 'user',
          label: (
            <div>
              {/* eslint-disable-next-line react/jsx-pascal-case */}
              <Header.H4>{name}</Header.H4>
              {/* eslint-disable-next-line react/jsx-pascal-case */}
              <Header.H5>{user.email}</Header.H5>
            </div>
          ),
        },
        {
          icon: 'Close',
          label: 'Logout',
          name: 'logout',
        },
      ]}
      onSelect={({ name }: any) => {
        console.log('UserDropdown onSelect', { name });
        if (name === 'logout') return logout();
        if (name === 'profile') return 'asdasdasd';
      }}
      dropdownItem={(props: any) => {
        if (props.value.img) return <DropdownImageItem {...props} />;
        else return <DropdownIconItem {...props} />;
      }}
    />
  );
};

export default UserDropdown;
