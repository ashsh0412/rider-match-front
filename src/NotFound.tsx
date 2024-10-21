import React from "react";
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";

export default function NotFound() {
  const handleGoHome = () => {
    window.location.href = "http://127.0.0.1:5500/index.html";
  };

  return (
    <Box bg="black" minH="100vh" color="white">
      <VStack justifyContent="center" spacing={8} minH="100vh" px={4}>
        <Heading size="2xl">404</Heading>
        <Heading size="xl">Page not found</Heading>
        <Text fontSize="xl">Oops! It seems you've taken a wrong turn.</Text>
        <Button
          onClick={handleGoHome}
          bg="white"
          color="black"
          size="lg"
          _hover={{ bg: "gray.200" }}
          fontWeight="bold"
        >
          Go Home
        </Button>
      </VStack>
    </Box>
  );
}
