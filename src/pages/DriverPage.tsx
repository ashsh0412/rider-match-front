// RiderPage.tsx
import { useState } from "react";
import { Box, VStack, Flex, useColorModeValue, Text } from "@chakra-ui/react";
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
      <Flex
        minH="100vh"
        bg={mainBg}
        pt="64px"
        direction={{ base: "column", md: "row" }}
      >
        {/* 폼 영역 - 모든 화면 크기에서 표시 */}
        <Box
          w={{ base: "full", md: "400px" }}
          h={{ base: "auto", md: "calc(100vh - 64px)" }}
          p={6}
          overflowY={{ base: "visible", md: "auto" }}
          bg={mainBg}
        >
          {isSuccess ? (
            <SuccessMessage
              setIsSuccess={setIsSuccess}
              setOptRoute={setOptRoute}
            />
          ) : (
            <VStack spacing={4} align="stretch">
              <RideRequestForm onSuccess={() => setIsSuccess(true)} />
            </VStack>
          )}
        </Box>

        {/* 지도 영역 - md 크기 이상에서만 표시 */}
        <Box
          flex={1}
          display={{ base: "none", md: "block" }}
          h="calc(100vh - 64px)"
          bg={useColorModeValue("gray.200", "gray.700")}
        >
          {optRoute ? <OptMapRenderer /> : <MapComponent />}
        </Box>
      </Flex>
    </Box>
  );
};

export default RiderPage;
