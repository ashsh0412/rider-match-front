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
} from "@chakra-ui/react";
import { FaReceipt, FaUser } from "react-icons/fa";

interface RideRequestProps {
  onSubmit?: (pickupLocation: string, dropoffLocation: string) => void;
}

const NavBar: React.FC = () => {
  return (
    <Flex
      w="100%"
      h="64px"
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      px={4}
      align="center"
      position="fixed"
      top={0}
      zIndex={1000}
    >
      <Flex
        flex={1}
        maxW="95%"
        mx="auto"
        justify="space-between"
        align="center"
      >
        {/* Logo */}
        <Text fontSize="2xl" fontWeight="bold">
          DriverMatch
        </Text>

        {/* User Profile */}
        <Flex>
          <HStack spacing={2}>
            {/* Trip History Button */}
            <Button variant="ghost" leftIcon={<FaReceipt />} size="md">
              Trip History
            </Button>

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
                <MenuItem>Setting</MenuItem>
                <MenuItem>Log out</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  );
};

const RideRequest: React.FC<RideRequestProps> = ({ onSubmit }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box>
      <NavBar />
      <Flex minH="100vh" bg="gray.50" pt="64px">
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
                bg="gray.100"
                border="none"
                _hover={{ bg: "gray.200" }}
                _focus={{ bg: "gray.200", boxShadow: "none" }}
              />
            </Box>

            {/* 구글 자동 완성 & 전 페이지에서 정보가져오기 */}
            <Box position="relative">
              <Input
                placeholder="Destination"
                size="lg"
                bg="gray.100"
                border="none"
                _hover={{ bg: "gray.200" }}
                _focus={{ bg: "gray.200", boxShadow: "none" }}
              />
            </Box>

            {/* 누르면 박스 바뀌게 */}
            <Select
              placeholder="Pickup Now"
              size="lg"
              bg="gray.100"
              border="none"
              _hover={{ bg: "gray.200" }}
              _focus={{ bg: "gray.200", boxShadow: "none" }}
            >
              <option value="now">Pickup Now</option>
              <option value="schedule">Schedule a Ride</option>
            </Select>

            {/* 내용 다 안채워지면 작동 안하게 */}
            <Button
              colorScheme="gray"
              size="lg"
              w="100%"
              bg="gray.100"
              _hover={{ bg: "gray.200" }}
            >
              Search
            </Button>
          </VStack>
        </Box>

        {/* Map Container */}
        <Box flex={1} bg="gray.200">
          {/* Map component would go here */}
        </Box>
      </Flex>
    </Box>
  );
};

export default RideRequest;
