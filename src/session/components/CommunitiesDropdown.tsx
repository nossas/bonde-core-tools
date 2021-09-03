import React from "react";
import {
  Stack,
  Image,
  Text,
  PerformDropdown,
  PerformDropdownList,
  PerformDropdownItem,
  PerformDropdownButton
} from "bonde-components";
import { useSession } from "../SessionProvider";
import CommunityMenu from "./CommunityMenu";

const CommunitiesDropdown = () => {
  const { community, communities, onChange } = useSession();
  
  return (
    <Stack direction="row" spacing={2}>
      <PerformDropdown>
        <PerformDropdownButton variant="link" color="white">
          {community ? (
            <Stack direction="row" spacing={4} alignItems="center">
              <Image
                boxSize={6}
                rounded="50%"
                src={community?.image || `https://via.placeholder.com/100?text=${community.name.substring(0, 1)}`}
              />
              <Text fontSize="sm" fontWeight="extrabold" textTransform="uppercase">{community?.name}</Text>
            </Stack>
          ) : "Selecione uma comunidade"}
        </PerformDropdownButton>
        <PerformDropdownList scroll={communities.length > 10}>
          {communities.map((c: any) => (
            <PerformDropdownItem
              key={c.id}
              onClick={() => {
                onChange({ community: c });
              }}
            >
              <Stack direction="row" spacing={4} p={4}>
                <Image boxSize={8} rounded="50%" src={c.image || `https://via.placeholder.com/100?text=${c.name.substring(0, 1)}`} />
                <Text>{c.name}</Text>
              </Stack>
            </PerformDropdownItem>
          ))}
        </PerformDropdownList>
      </PerformDropdown>
      {community && <CommunityMenu community={community} inverted />}
    </Stack>
  )
};

export default CommunitiesDropdown;