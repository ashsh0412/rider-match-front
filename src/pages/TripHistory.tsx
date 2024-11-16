import React, { useState, useMemo, useEffect } from "react";
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
  Center,
  Spinner,
} from "@chakra-ui/react";
import {
  CalendarIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { MapPin, Users } from "lucide-react";
import NavBar from "../components/NavBar";
import { getBooking } from "../api/GetBooking";

type DateFilter = "3 months" | "6 months" | "1 year";
type StatusFilter = "All" | "Completed" | "Cancelled" | "Pending";
type SortField = "date" | "price" | "rating";
type SortOrder = "asc" | "desc";

interface Guest {
  id: number;
  name: string;
}

interface PickupWithTime {
  location: string;
  time: string;
  type: "pickup";
}

interface Location {
  name: string;
  type: "pickup" | "waypoint" | "dropoff";
  pickupTime?: string; // pickup time 추가
}

interface Trip {
  id: number;
  date: string;
  startingPoint: string;
  pickupTime: string;
  arrivalTime: string;
  locations: Location[];
  guests: { id: number; name: string }[];
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
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  const bg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await getBooking();
        const transformedTrips: Trip[] = response.map((booking: any) => {
          const locations: Location[] = [];

          // pickups와 시간을 함께 담은 배열 생성
          const pickupsWithTimes = booking.locations.pickups.map(
            (pickup: string, index: number) => ({
              location: pickup.split(",")[0].trim(),
              time: booking.pickup_times[index],
              type: "pickup" as const,
            })
          );

          // 시간순으로 정렬
          pickupsWithTimes.sort(
            (a: PickupWithTime, b: PickupWithTime) =>
              new Date(a.time).getTime() - new Date(b.time).getTime()
          );

          // 정렬된 pickup 위치들을 locations 배열에 추가
          pickupsWithTimes.forEach((item: PickupWithTime) => {
            locations.push({
              name: item.location,
              type: item.type,
              pickupTime: item.time,
            });
          });

          // destinations 추가
          if (booking.locations.destinations.length > 0) {
            const destination = booking.locations.destinations[0];
            const shortenedDestination = destination.split(",")[0].trim();
            locations.push({
              name: shortenedDestination,
              type: "dropoff",
            });
          }

          const guests: Guest[] = booking.passengers.map(
            (passenger: any, index: number) => ({
              id: index + 1,
              name: passenger.name,
            })
          );

          const riderDate = booking.pickup_times[0]
            .split(",")
            .slice(0, 2)
            .join(",");

          const startingPoint = booking.starting_point;
          const shortStartingPoint = startingPoint.split(",")[0].trim();

          const formatArrivalTime = (arrivalTime: string): string => {
            const date = new Date(arrivalTime);
            return new Intl.DateTimeFormat("en-US", {
              month: "short", // Nov
              day: "2-digit", // 17
              year: "numeric", // 2024
              hour: "2-digit", // 03
              minute: "2-digit", // 26
              hour12: true, // AM/PM
            }).format(date);
          };

          return {
            id: booking.id,
            date: riderDate,
            locations: locations,
            guests: guests,
            driverName: booking.driver_name,
            status: "Pending" as const,
            startingPoint: shortStartingPoint, // 추가된 부분
            arrivalTime: formatArrivalTime(booking.arrival_time), // 추가된 부분
          };
        });

        setTrips(transformedTrips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

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
    let filtered = [...trips]; // allTrips 대신 trips 사용

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
          {loading ? (
            <Center h="200px">
              <Spinner size="xl" />
            </Center>
          ) : (
            <>
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
                    onChange={(e) =>
                      setDateFilter(e.target.value as DateFilter)
                    }
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
                              <Icon as={Users} />
                              <Text>{trip.guests.length} guests</Text>
                            </HStack>
                          </HStack>

                          <Stack spacing={2}>
                            <HStack>
                              <Icon as={MapPin} color={"yellow.400"} />
                              <Text>{trip.startingPoint}</Text>
                              <Badge ml={2} colorScheme="gray">
                                Starting Point
                              </Badge>
                            </HStack>
                            <Box pl="6px">
                              <Divider
                                orientation="vertical"
                                h="20px"
                                borderColor="gray.300"
                              />
                            </Box>
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
                                    <Badge ml={2} colorScheme="gray">
                                      {location.type === "dropoff"
                                        ? "Destination"
                                        : "Waypoint"}
                                    </Badge>
                                    {location.type === "dropoff" &&
                                      trip.arrivalTime && ( // 도착 시간 배지 추가
                                        <Badge colorScheme="purple" ml={2}>
                                          {trip.arrivalTime}
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
                                <Tag
                                  size="md"
                                  borderRadius="full"
                                  variant="subtle"
                                >
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
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default TripHistory;
