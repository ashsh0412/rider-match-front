import React, { useEffect } from "react";
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
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  FaHistory,
  FaMapMarkerAlt,
  FaMapPin,
  FaMoon,
  FaReceipt,
  FaRegClock,
  FaSun,
  FaUser,
} from "react-icons/fa";

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
  const iconColor = useColorModeValue("gray.500", "gray.400");
  const sectionBg = useColorModeValue("gray.50", "gray.700");

  const recentLocations = [
    { title: "집", address: "서울시 강남구 역삼동" },
    { title: "회사", address: "서울시 서초구 서초동" },
    { title: "학교", address: "서울시 관악구 신림동" },
  ];

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
          overflowY="auto"
        >
          <VStack spacing={4} align="stretch">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Request a Ride
            </Text>

            <Box position="relative">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FaMapMarkerAlt color={iconColor} />
                </InputLeftElement>
                <Input
                  placeholder="Pickup Location"
                  size="lg"
                  bg={inputBg}
                  border="none"
                  pl="40px"
                  _hover={{ bg: inputHoverBg }}
                  _focus={{ bg: inputHoverBg, boxShadow: "none" }}
                />
              </InputGroup>
            </Box>

            <Box position="relative">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FaMapPin color={iconColor} />
                </InputLeftElement>
                <Input
                  placeholder="Destination"
                  size="lg"
                  bg={inputBg}
                  border="none"
                  pl="40px"
                  _hover={{ bg: inputHoverBg }}
                  _focus={{ bg: inputHoverBg, boxShadow: "none" }}
                />
              </InputGroup>
            </Box>

            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaRegClock color={iconColor} />
              </InputLeftElement>
              <Select
                placeholder="Pickup Now"
                size="lg"
                bg={inputBg}
                border="none"
                pl="40px"
                _hover={{ bg: inputHoverBg }}
                _focus={{ bg: inputHoverBg, boxShadow: "none" }}
              >
                <option value="now">Pickup Now</option>
                <option value="schedule">Schedule a Ride</option>
              </Select>
            </InputGroup>

            <Button
              size="lg"
              w="100%"
              bg={inputBg}
              _hover={{ bg: inputHoverBg }}
            >
              Search
            </Button>

            {/* Recent Locations */}
            <Box mt={6}>
              <HStack mb={3}>
                <FaHistory />
                <Text fontWeight="bold">Recent Locations</Text>
              </HStack>
              <VStack
                spacing={3}
                align="stretch"
                bg={sectionBg}
                p={4}
                borderRadius="md"
              >
                {recentLocations.map((location, index) => (
                  <Box
                    key={index}
                    p={3}
                    bg={bgColor}
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: inputHoverBg }}
                  >
                    <Text fontWeight="semibold">{location.title}</Text>
                    <Text fontSize="sm" color={iconColor}>
                      {location.address}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>

            {/* Popular Destinations */}
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
