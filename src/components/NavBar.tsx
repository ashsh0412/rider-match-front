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
import { useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bg = useColorModeValue("white", "gray.800");
  const navigate = useNavigate();

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
      <Text
        fontSize="2xl"
        fontWeight="bold"
        onClick={() => {
          navigate("/rider-page");
        }}
        _hover={{ cursor: "pointer" }}
      >
        DriverMatch
      </Text>

      <HStack spacing={2}>
        <Button variant="ghost" leftIcon={<FaReceipt />} size="md">
          Trip History
        </Button>

        <IconButton
          onClick={toggleColorMode}
          variant={"ghost"}
          aria-label="Toggle dark mode"
          icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
        />

        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FaUser />}
            variant="ghost"
            size="md"
            aria-label="User menu"
          />
          <MenuList>
            <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
            <MenuItem onClick={logOut}>Log out</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  );
};

export default NavBar;
