import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  Select,
  Stack,
  Text,
  Badge,
  Divider,
  VStack,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  ButtonGroup,
  useColorModeValue,
  Tag,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  CalendarIcon,
  TimeIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { MapPin, Users } from "lucide-react";
import NavBar from "../components/NavBar";

type DateFilter = "3 months" | "6 months" | "1 year";
type StatusFilter = "All" | "Completed" | "Cancelled" | "Pending";
type SortField = "date" | "price" | "rating";
type SortOrder = "asc" | "desc";

interface Guest {
  id: number;
  name: string;
}

interface Location {
  name: string;
  type: "pickup" | "waypoint" | "dropoff";
  pickupTime?: string; // pickup time 추가
}

interface Trip {
  id: number;
  date: string;
  time: string;
  locations: Location[];
  guests: Guest[];
  driverName: string;
  status: "Completed" | "Cancelled" | "Pending";
}

const TripHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("3 months");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const bg = useColorModeValue("white", "gray.800");

  const allTrips: Trip[] = [
    {
      id: 1,
      date: "2024-03-15",
      time: "14:30",
      locations: [
        { name: "Seoul Station", type: "pickup", pickupTime: "14:30" },
        { name: "Hongdae Station", type: "waypoint", pickupTime: "15:00" },
        { name: "Gangnam Station", type: "dropoff" },
      ],
      guests: [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
        { id: 3, name: "Mike Johnson" },
      ],
      driverName: "Kim Chul-soo",
      status: "Completed",
    },
    {
      id: 2,
      date: "2024-03-14",
      time: "09:15",
      locations: [
        { name: "Hongdae Station", type: "pickup", pickupTime: "09:15" },
        { name: "Yeouido", type: "dropoff" },
      ],
      guests: [
        { id: 4, name: "Sarah Wilson" },
        { id: 5, name: "Tom Brown" },
      ],
      driverName: "Lee Young-hee",
      status: "Pending",
    },
    {
      id: 3,
      date: "2024-03-13",
      time: "11:30",
      locations: [
        { name: "Incheon Airport", type: "pickup", pickupTime: "11:30" },
        { name: "Gimpo Airport", type: "waypoint", pickupTime: "12:15" },
        { name: "Myeongdong", type: "dropoff" },
      ],
      guests: [
        { id: 6, name: "Alice Johnson" },
        { id: 7, name: "Bob Wilson" },
        { id: 8, name: "Carol Smith" },
        { id: 9, name: "David Brown" },
      ],
      driverName: "Park Min-ji",
      status: "Pending",
    },
    {
      id: 4,
      date: "2024-03-12",
      time: "16:45",
      locations: [
        { name: "Gangnam Station", type: "pickup", pickupTime: "16:45" },
        { name: "Itaewon", type: "dropoff" },
      ],
      guests: [{ id: 10, name: "Emma Davis" }],
      driverName: "Choi Jun-ho",
      status: "Cancelled",
    },
  ];

  const months: Record<DateFilter, number> = {
    "3 months": 3,
    "6 months": 6,
    "1 year": 12,
  };

  const getStatusColor = (status: Trip["status"]) => {
    switch (status) {
      case "Completed":
        return "green";
      case "Cancelled":
        return "red";
      case "Pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  const filteredAndSortedTrips = useMemo(() => {
    let filtered = [...allTrips];

    if (searchTerm) {
      filtered = filtered.filter(
        (trip) =>
          trip.locations.some((location) =>
            location.name.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          trip.guests.some((guest) =>
            guest.name.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          trip.driverName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((trip) => trip.status === statusFilter);
    }

    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - months[dateFilter]);

    filtered = filtered.filter((trip) => {
      const tripDate = new Date(trip.date);
      return tripDate >= monthsAgo;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
      }
      return sortOrder === "desc" ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, dateFilter, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedTrips.length / itemsPerPage);
  const currentTrips = filteredAndSortedTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <Box>
      <NavBar />
      <Box pt="80px" minH="100vh" bg={bg}>
        <Container maxW="container.xl" py={8}>
          <Stack spacing={6}>
            <Flex justify="space-between" align="center">
              <Heading size="lg">Trip History</Heading>
            </Flex>

            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <InputGroup maxW={{ base: "full", md: "300px" }}>
                <InputLeftElement>
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search place, guest or driver"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <Select
                maxW={{ base: "full", md: "150px" }}
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
              >
                <option>All</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </Select>

              <Select
                maxW={{ base: "full", md: "150px" }}
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              >
                <option>3 months</option>
                <option>6 months</option>
                <option>1 year</option>
              </Select>
            </Stack>
          </Stack>

          <Text mt={4} color="gray.600">
            {filteredAndSortedTrips.length} trips found
          </Text>

          <VStack spacing={4} align="stretch" mt={4}>
            {currentTrips.map((trip) => (
              <Card
                key={trip.id}
                variant="outline"
                _hover={{
                  shadow: "lg",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
              >
                <CardBody>
                  <Flex
                    justify="space-between"
                    flexDir={{ base: "column", md: "row" }}
                    gap={4}
                  >
                    <Stack spacing={4} flex={1}>
                      <HStack spacing={6} flexWrap="wrap" gap={2}>
                        <HStack color="gray.600">
                          <Icon as={CalendarIcon} />
                          <Text>{trip.date}</Text>
                        </HStack>
                        <HStack color="gray.600">
                          <Icon as={TimeIcon} />
                          <Text>{trip.time}</Text>
                        </HStack>
                        <HStack color="gray.600">
                          <Icon as={Users} />
                          <Text>{trip.guests.length} guests</Text>
                        </HStack>
                      </HStack>

                      <Stack spacing={2}>
                        {trip.locations.map((location, index) => (
                          <React.Fragment key={index}>
                            <HStack>
                              <Icon
                                as={MapPin}
                                color={
                                  location.type === "pickup"
                                    ? "green.500"
                                    : location.type === "waypoint"
                                    ? "blue.500"
                                    : "red.500"
                                }
                              />
                              <Text>
                                {location.name}
                                {location.type !== "dropoff" && (
                                  <Badge ml={2} colorScheme="gray">
                                    {location.type === "pickup"
                                      ? "Pickup"
                                      : "Waypoint"}
                                  </Badge>
                                )}
                                {location.pickupTime && (
                                  <Badge ml={2} colorScheme="purple">
                                    {location.pickupTime}
                                  </Badge>
                                )}
                              </Text>
                            </HStack>
                            {index < trip.locations.length - 1 && (
                              <Box pl="6px">
                                <Divider
                                  orientation="vertical"
                                  h="20px"
                                  borderColor="gray.300"
                                />
                              </Box>
                            )}
                          </React.Fragment>
                        ))}
                      </Stack>

                      <Wrap spacing={2}>
                        {trip.guests.map((guest) => (
                          <WrapItem key={guest.id}>
                            <Tag size="md" borderRadius="full" variant="subtle">
                              {guest.name}
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Stack>

                    <Stack
                      align={{ base: "flex-start", md: "flex-end" }}
                      spacing={2}
                    >
                      <Badge
                        colorScheme={getStatusColor(trip.status)}
                        fontSize="sm"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {trip.status}
                      </Badge>
                      <Text fontSize="sm" color="gray.600">
                        Driver: {trip.driverName}
                      </Text>
                    </Stack>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </VStack>

          {totalPages > 1 && (
            <Flex justify="center" mt={8}>
              <ButtonGroup variant="outline" spacing={2}>
                <Button
                  leftIcon={<ChevronLeftIcon />}
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 1}
                >
                  Prev
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    colorScheme={currentPage === i + 1 ? "blue" : "gray"}
                    variant={currentPage === i + 1 ? "solid" : "outline"}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  rightIcon={<ChevronRightIcon />}
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </ButtonGroup>
            </Flex>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default TripHistory;
