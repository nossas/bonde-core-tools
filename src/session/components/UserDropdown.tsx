import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuGroup,
	CloseIcon,
	Text,
	Stack,
	Heading
} from "bonde-components"
import { useSession } from '../SessionProvider';

import React from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const ChakraDropdown = () => {
	const { user, logout } = useSession();
	const name = `${user.firstName} ${user.lastName}`;

	const title = (
		<Stack spacing={2}>
			<Heading as="h3" size="md" textTransform="capitalize">{name}</Heading>
			<Text fontSize="md">{user.email}</Text>
		</Stack>
	)
	return (
		<Menu>
			<MenuButton aria-label="User Menu" color="white" textTransform="uppercase">
				{name}
			</MenuButton>
			
			<MenuList>
				<MenuGroup title={title}>
					<MenuItem onClick={logout} icon={<CloseIcon boxSize={3}/>}>
						Logout
					</MenuItem>
				</MenuGroup>
			</MenuList>
		</Menu>
	)
}

export default ChakraDropdown;


