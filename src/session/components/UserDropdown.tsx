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
          label: name,
          email: user.email,
          render: ({ value }: any) => {
            const { img, label, email } = value;
            return (
              <DropdownImageItem
                value={{
                  img,
                  label: (
                    <div>
                      {/* eslint-disable-next-line react/jsx-pascal-case */}
                      <Header.h4>{label}</Header.h4>
                      {/* eslint-disable-next-line react/jsx-pascal-case */}
                      <Header.h5>{email}</Header.h5>
                    </div>
                  ),
                }}
              />
            );
          },
        },
        // {
        //   icon: 'User',
        //   label: 'Perfil',
        //   name: 'profile',
        // },
        {
          icon: 'Close',
          label: 'Logout',
          name: 'logout',
        },
      ]}
      onSelect={({ name }: any) => {
        if (name === 'logout') return logout();
        if (name === 'profile') return 'asdasdasd';
      }}
      dropdownItem={DropdownIconItem}
    />
  );
};

export default UserDropdown;
