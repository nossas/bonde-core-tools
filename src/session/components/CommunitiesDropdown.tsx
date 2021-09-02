import React from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ArrowDownIcon,
  ArrowUpIcon,
  Image,
  Stack,
  Heading
} from "bonde-components"
import { useSession } from '../SessionProvider';
import CommunityMenu from './CommunityMenu';

const CommunitiesDropdown = () => {
  const { community, communities } = useSession();

  return (
    <Stack direction="row" spacing={2}>
      <Menu>
        {({ isOpen }: any) => (
          <>
            <MenuButton
              aria-label="User Menu"
              as={Button}
              variant="dropdown"
              color="white"
              rightIcon={isOpen ? <ArrowUpIcon boxSize={3} /> : <ArrowDownIcon boxSize={3} />}
            >
              {community?.name ? (
                <Stack direction="row" spacing={4} alignItems="center">
                  <Image
                    src={community.image || `https://via.placeholder.com/100?text=${community.name.substring(0, 1)}`}
                    boxSize={6}
                    rounded="50%"
                  />
                  <Heading as="h6" size="xs">{community.name}</Heading>
                </Stack>
              ) : "Selecione uma comunidade"}
            </MenuButton>

            <MenuList maxH="300px" overflowY="scroll">
              {communities.map((community) => (
                <MenuItem key={community.id}>
                  <Stack direction="row" spacing={4}>
                    <Image
                      src={community.image || `https://via.placeholder.com/100?text=${community.name.substring(0, 1)}`}
                      boxSize={8}
                      rounded="50%"
                    />
                    <Heading as="h5" size="sm">{community.name}</Heading>
                  </Stack>
                </MenuItem>
              ))}
            </MenuList>
          </>
        )}
      </Menu>
      {community && <CommunityMenu community={community} inverted />}
    </Stack>
  )
};

export default CommunitiesDropdown;
