import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  CloseIcon,
  Text,
  Stack,
  Heading,
  ArrowDownIcon,
  ArrowUpIcon
} from "bonde-components"
import { useSession } from '../SessionProvider';

import React from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const UserDropdown = () => {
  const { user, logout } = useSession();
  const name = `${user.firstName} ${user.lastName}`;

  const title = (
    <Stack spacing={1}>
      <Heading as="h3" size="md" fontWeight="extrabold" textTransform="capitalize">{name}</Heading>
      <Text fontSize="md" color="gray.200">{user.email}</Text>
    </Stack>
  )
  return (
    <Menu variant="link" colorScheme="pink">
      {({ isOpen }: any) => (
        <>
          <MenuButton
            aria-label="User Menu"
            as={Button}
            variant="dropdown"
            color="white"
            rightIcon={isOpen ? <ArrowUpIcon boxSize={3} /> : <ArrowDownIcon boxSize={3} />}
          >
            {name}
          </MenuButton>
          <MenuList>
            <MenuGroup title={title}>
              <MenuItem onClick={logout} icon={<CloseIcon boxSize={3} />}>
                Logout
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </>
      )}
    </Menu>
  )
}

export default UserDropdown;


