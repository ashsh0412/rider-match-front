import {
  VStack,
  Box,
  Text,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { Clock, AlertCircle, Users, CheckCircle } from "lucide-react";

const TimeInfoAlert = () => {
  const bgColor = useColorModeValue("blue.50", "blue.900");
  const borderColor = useColorModeValue("blue.100", "blue.700");
  const textColor = useColorModeValue("blue.800", "blue.100");
  const subTextColor = useColorModeValue("blue.600", "blue.200");

  return (
    <Box
      mt={6}
      mb={4}
      p={4}
      bg={bgColor}
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
    >
      <VStack spacing={4} align="stretch">
        {/* Time Information */}
        <Box display="flex" alignItems="flex-start">
          <Box
            as={Clock}
            color="blue.500"
            w={5}
            h={5}
            mt={1}
            mr={2}
            flexShrink={0}
          />
          <Box>
            <Text fontWeight="medium" color={textColor}>
              Pickup time may vary after driver matching
            </Text>
            <Text fontSize="sm" color={subTextColor} mt={1}>
              While your selected date is fixed, the exact pickup time may be
              adjusted according to the assigned driver's schedule.
            </Text>
          </Box>
        </Box>

        {/* Important Notices */}
        <Box display="flex" alignItems="flex-start">
          <Box
            as={AlertCircle}
            color="blue.500"
            w={5}
            h={5}
            mt={1}
            mr={2}
            flexShrink={0}
          />
          <Box>
            <Text fontWeight="medium" color={textColor}>
              Before Driver Matching
            </Text>
            <List spacing={2} mt={2}>
              <ListItem
                display="flex"
                alignItems="center"
                fontSize="sm"
                color={subTextColor}
              >
                <ListIcon as={CheckCircle} color="blue.500" />
                Smart matching with drivers who are available on your selected
                date
              </ListItem>
              <ListItem
                display="flex"
                alignItems="center"
                fontSize="sm"
                color={subTextColor}
              >
                <ListIcon as={CheckCircle} color="blue.500" />
                Optimized route provided based on driver's current location and
                all pickup points
              </ListItem>

              <ListItem
                display="flex"
                alignItems="center"
                fontSize="sm"
                color={subTextColor}
              >
                <ListIcon as={CheckCircle} color="blue.500" />
                The location is determined based on latitude and longitude, so
                the stored location may not be highly accurate. However, the
                margin of error on the map is very small, so it is fine to
                proceed to this location.
              </ListItem>
            </List>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default TimeInfoAlert;
