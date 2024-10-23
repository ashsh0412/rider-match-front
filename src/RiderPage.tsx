import React from "react";
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  IconButton,
  Flex,
  useColorModeValue,
  Select,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
} from "@chakra-ui/react";
import { FaMoon, FaReceipt, FaSun, FaUser } from "react-icons/fa";

interface RideRequestProps {
  onSubmit?: (pickupLocation: string, dropoffLocation: string) => void;
}

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
            <MenuItem>Settings</MenuItem>
            <MenuItem>Log out</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  );
};

const RideRequest: React.FC<RideRequestProps> = ({ onSubmit }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const inputHoverBg = useColorModeValue("gray.200", "gray.600");
  const mainBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box>
      <NavBar />
      <Flex minH="100vh" bg={mainBg} pt="64px">
        <Box
          w="400px"
          bg={bgColor}
          p={6}
          borderRight="1px"
          borderColor={borderColor}
          h="calc(100vh - 64px)"
        >
          <VStack spacing={4} align="stretch" mt={10}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Request a Ride
            </Text>

            {/* 구글 자동 완성 & 전 페이지에서 정보가져오기 */}
            <Box position="relative">
              <Input
                placeholder="Pickup Location"
                size="lg"
                bg={inputBg}
                border="none"
                _hover={{ bg: inputHoverBg }}
                _focus={{ bg: inputHoverBg, boxShadow: "none" }}
              />
            </Box>

            {/* 구글 자동 완성 & 전 페이지에서 정보가져오기 */}
            <Box position="relative">
              <Input
                placeholder="Destination"
                size="lg"
                bg={inputBg}
                border="none"
                _hover={{ bg: inputHoverBg }}
                _focus={{ bg: inputHoverBg, boxShadow: "none" }}
              />
            </Box>

            {/* 누르면 박스 바뀌게 */}
            <Select
              placeholder="Pickup Now"
              size="lg"
              bg={inputBg}
              border="none"
              _hover={{ bg: inputHoverBg }}
              _focus={{ bg: inputHoverBg, boxShadow: "none" }}
            >
              <option value="now">Pickup Now</option>
              <option value="schedule">Schedule a Ride</option>
            </Select>

            {/* 내용 다 안채워지면 작동 안하게 */}
            <Button
              size="lg"
              w="100%"
              bg={inputBg}
              _hover={{ bg: inputHoverBg }}
            >
              Search
            </Button>
          </VStack>
        </Box>

        {/* Map Container */}
        <Box flex={1} bg={useColorModeValue("gray.200", "gray.700")}>
          {/* Map component would go here */}
        </Box>
      </Flex>
    </Box>
  );
};

export default RideRequest;
