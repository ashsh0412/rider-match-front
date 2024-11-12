// RiderPage.tsx
import { useState } from "react";
import { Box, VStack, Flex, useColorModeValue } from "@chakra-ui/react";
import MapComponent from "../maps/LoadingMap";
import NavBar from "../components/NavBar";
import RideRequestForm from "../components/RequestForm";
import SuccessMessage from "../components/RequestSuccess";
import OptMapRenderer from "../maps/OptRouteRender";

const RiderPage: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [optRoute, setOptRoute] = useState(false); // Added this state
  const mainBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box>
      <NavBar />
      <Flex minH="100vh" bg={mainBg} pt="64px">
        <Box flex="0 0 400px" p={6} h="calc(100vh - 64px)" overflowY="auto">
          {isSuccess ? (
            <SuccessMessage
              setIsSuccess={setIsSuccess}
              setOptRoute={setOptRoute} // Added the required prop
            />
          ) : (
            <VStack spacing={4} align="stretch">
              <RideRequestForm onSuccess={() => setIsSuccess(true)} />
            </VStack>
          )}
        </Box>
        <Box flex={1} bg={useColorModeValue("gray.200", "gray.700")}>
          {optRoute ? <OptMapRenderer /> : <MapComponent />}
        </Box>
      </Flex>
    </Box>
  );
};

export default RiderPage;
