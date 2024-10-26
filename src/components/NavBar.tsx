import {
  HStack,
  Text,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMoon, FaSun, FaReceipt, FaUser } from "react-icons/fa";
import logOut from "../api/Logout";

const NavBar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bg = useColorModeValue("white", "gray.800");

  return (
    <HStack
      w="100%"
      h="64px"
      borderBottom="2px"
      borderColor={borderColor}
      px={5}
      position="fixed"
      zIndex={1000}
      justifyContent={"space-between"}
      bg={bg}
    >
      {/* Logo */}
      <Text fontSize="2xl" fontWeight="bold">
        DriverMatch
      </Text>

      {/* User Profile */}
      <HStack spacing={2}>
        {/* Trip History Button */}
        <Button variant="ghost" leftIcon={<FaReceipt />} size="md">
          Trip History
        </Button>

        <IconButton
          onClick={toggleColorMode}
          variant={"ghost"}
          aria-label="Toggle dark mode"
          icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
        />

        {/* User Profile Menu */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FaUser />}
            variant="ghost"
            size="md"
            aria-label="User menu"
          />
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem onClick={logOut}>Log out</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  );
};

export default NavBar;
