import { Box, VStack, Flex, useColorModeValue } from "@chakra-ui/react";
import MapComponent from "../maps/LoadingMap";
import "react-datepicker/dist/react-datepicker.css";
import NavBar from "../components/NavBar";
import RecentLocations from "../components/RecentLocations";
import RideRequestForm from "../components/RiderRequestForm";

interface RideRequestProps {
  onSubmit?: (pickupLocation: string, dropoffLocation: string) => void;
}

const RideRequest: React.FC<RideRequestProps> = ({ onSubmit }) => {
  const mainBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box>
      <NavBar />
      <Flex minH="100vh" bg={mainBg} pt="64px">
        <Box flex="0 0 400px" p={6} h="calc(100vh - 64px)" overflowY="auto">
          <VStack spacing={4} align="stretch">
            <RideRequestForm />
            <RecentLocations />
          </VStack>
        </Box>

        {/* Map Container */}
        <Box flex={1} bg={useColorModeValue("gray.200", "gray.700")}>
          <MapComponent />
        </Box>
      </Flex>
    </Box>
  );
};

export default RideRequest;
