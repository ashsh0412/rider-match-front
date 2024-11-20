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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
} from "@chakra-ui/react";
import {
  CalendarIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { MapPin, Users } from "lucide-react";
import NavBar from "../components/NavBar";
import { getBooking } from "../API/GetBooking";
import { FaUserTie } from "react-icons/fa";
import { getUserLocations } from "../API/GetLocation";
import { deleteLocation } from "../API/DeleteLocation";
import {
  BASE_URL,
  Guest,
  Location,
  LocationCard,
  PickupWithTime,
  Trip,
} from "../type";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/GetUserInfo";
import Cookies from "js-cookie";

type DateFilter = "3 months" | "6 months" | "1 year";
type StatusFilter = "All" | "Completed" | "Pending";
type SortField = "date" | "price" | "rating";
type SortOrder = "asc" | "desc";

const TripHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("3 months");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [locations, setLocations] = useState<LocationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();
  const toast = useToast();
  const itemsPerPage = 5;

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}users/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
      });

      if (!response.ok) {
        navigate("/log-in");
        throw new Error("Failed to fetch user profile");
      }
    } catch (error) {
      toast({
        title: "Error fetching profile",
        description: "Unable to fetch user profile. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      navigate("/log-in");
    }
  };

  const bg = useColorModeValue("white", "gray.800");

  const formatDateTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const currentUserLocation = await getUserLocations();
        const transformedLocations: LocationCard[] = currentUserLocation.map(
          (location: any) => ({
            id: location.id,
            user: location.user,
            pickupLocation: location.pickup_location,
            dropoffLocation: location.dropoff_location,
            dateTime: formatDateTime(location.date_time),
          })
        );
        setLocations(transformedLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const fetchTrips = async () => {
      try {
        const response = await getBooking();
        const transformedTrips: Trip[] = response.map((booking: any) => {
          const locations: Location[] = [];

          const pickupsWithTimes = booking.locations.pickups.map(
            (pickup: string, index: number) => {
              // pickup이 유효한 문자열인지 확인
              let location = "";
              if (pickup && typeof pickup === "string") {
                location = pickup.split(",")[0].trim();

                // 첫 번째 부분이 10글자 이하일 때, 두 번째 부분도 가져오기
                if (location.length <= 10) {
                  const parts = pickup.split(",");
                  if (parts.length > 1) {
                    location += ", " + parts[1].trim();
                  }
                }
              }

              return {
                location,
                time: booking.pickup_times[index],
                type: "pickup" as const,
              };
            }
          );

          pickupsWithTimes.sort(
            (a: PickupWithTime, b: PickupWithTime) =>
              new Date(a.time).getTime() - new Date(b.time).getTime()
          );

          pickupsWithTimes.forEach((item: PickupWithTime) => {
            locations.push({
              name: item.location,
              type: item.type,
              pickupTime: item.time,
            });
          });

          if (booking.locations.destinations.length > 0) {
            const destination = booking.locations.destinations[0];
            let shortenedDestination = destination.split(",")[0].trim();

            if (
              shortenedDestination.length <= 10 &&
              destination.split(",").length > 1
            ) {
              shortenedDestination += ", " + destination.split(",")[1].trim();
            }
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

          // 현재 시각 가져오기
          const currentTime = new Date();

          // 백엔드에서 도착 시간을 가져오기
          const arrivalTime = new Date(booking.arrival_time);
          const startingPoint = booking.starting_point;
          let shortStartingPoint = startingPoint.split(",")[0].trim();
          if (
            shortStartingPoint.length <= 10 &&
            startingPoint.split(",").length > 1
          ) {
            shortStartingPoint += ", " + startingPoint.split(",")[1].trim();
          }
          const status = arrivalTime < currentTime ? "Completed" : "Pending";

          return {
            id: booking.id,
            date: riderDate,
            locations: locations,
            guests: guests,
            driverName: booking.driver_name,
            status: status,
            startingPoint: shortStartingPoint,
            arrivalTime: formatDateTime(booking.arrival_time),
            pickupTime: booking.pickup_times[0],
          };
        });

        setTrips(transformedTrips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    Promise.all([fetchTrips(), fetchLocations()]);
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
      case "Pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  const filteredAndSortedTrips = useMemo(() => {
    let filtered = [...trips];

    if (searchTerm) {
      filtered = filtered.filter(
        (trip) =>
          trip.locations.some((location) =>
            location.name.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          trip.guests.some((guest) =>
            guest.name.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          trip.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trip.startingPoint.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((trip) => trip.status === statusFilter);
    }

    if (dateFilter) {
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - months[dateFilter]);

      filtered = filtered.filter((trip) => {
        const tripDate = new Date(trip.date);
        return tripDate >= monthsAgo || isNaN(tripDate.getTime());
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        return 0;
      }

      const comparison = dateB.getTime() - dateA.getTime();
      return sortOrder === "desc" ? comparison : -comparison;
    });

    return filtered;
  }, [trips, searchTerm, dateFilter, statusFilter, sortBy, sortOrder]);

  const filteredLocations = useMemo(() => {
    if (!searchTerm) return locations;
    return locations.filter(
      (location) =>
        location.pickupLocation
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        location.dropoffLocation
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [locations, searchTerm]);

  const currentItems =
    tabIndex === 0
      ? filteredAndSortedTrips.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : filteredLocations.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );
  const isTrip = (item: Trip | LocationCard): item is Trip => {
    return "startingPoint" in item;
  };

  const totalPages = Math.ceil(
    (tabIndex === 0
      ? filteredAndSortedTrips.length
      : filteredLocations.length) / itemsPerPage
  );

  const currentLocations = filteredLocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const deleteLocationBoth = (id: string) => {
    // 해당 ID의 항목을 삭제
    setLocations((prevLocations) =>
      prevLocations.filter((location) => location.id.toString() !== id)
    );
    deleteLocation({ id: id });
  };

  const LocationCardComponent: React.FC<{
    location: LocationCard;
    onDelete: (id: string) => void;
  }> = ({ location, onDelete }) => (
    <Card
      variant="outline"
      _hover={{
        shadow: "lg",
        transform: "translateY(-2px)",
      }}
      transition="all 0.2s"
      mb={4}
    >
      <CardBody>
        <Flex justify="space-between" align="flex-start">
          <Stack spacing={4} flex={1}>
            <HStack color="gray.600">
              <Icon as={CalendarIcon} />
              <Text>{location.dateTime}</Text>
            </HStack>

            <Stack spacing={2}>
              <HStack>
                <Icon as={MapPin} color="green.500" />
                <Text>{location.pickupLocation}</Text>
                <Badge colorScheme="green">Pickup</Badge>
              </HStack>
              <Box pl="6px">
                <Divider
                  orientation="vertical"
                  h="20px"
                  borderColor="gray.300"
                />
              </Box>
              <HStack>
                <Icon as={MapPin} color="red.500" />
                <Text>{location.dropoffLocation}</Text>
                <Badge colorScheme="red">Dropoff</Badge>
              </HStack>
            </Stack>
          </Stack>

          <Button
            size="sm"
            variant="ghost"
            color={"white"}
            onClick={() => {
              onDelete(location.id.toString());
            }}
            _hover={{ bg: "red.50" }}
            backgroundColor={"red.500"}
          >
            Delete
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );

  const TripCardComponent: React.FC<{ trip: Trip }> = ({ trip }) => (
    <Card
      variant="outline"
      _hover={{
        shadow: "lg",
        transform: "translateY(-2px)",
      }}
      transition="all 0.2s"
      mb={4}
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
                <Icon as={MapPin} color="yellow.400" />
                <Text>{trip.startingPoint}</Text>
                <Badge>Starting Point</Badge>
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
                      {location.type === "dropoff" && trip.arrivalTime && (
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
                  <Tag size="md" borderRadius="full" variant="subtle">
                    {guest.name}
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Stack>

          <Stack align={{ base: "flex-start", md: "flex-end" }} spacing={2}>
            <Badge
              colorScheme={getStatusColor(trip.status)}
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="full"
            >
              {trip.status}
            </Badge>
            <Badge
              alignItems="center"
              px={3}
              py={1}
              colorScheme="green"
              fontSize="sm"
            >
              <Icon as={FaUserTie} mr={2} />
              Driver: {trip.driverName}
            </Badge>
          </Stack>
        </Flex>
      </CardBody>
    </Card>
  );

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
                  <Heading size="lg">History</Heading>
                </Flex>

                <Tabs onChange={(index) => setTabIndex(index)} isFitted>
                  <TabList mb="1em">
                    <Tab>Trips</Tab>
                    <Tab>Locations</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel p={0}>
                      <Stack
                        direction={{ base: "column", md: "row" }}
                        spacing={4}
                      >
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

                      <Text mt={4} color="gray.600">
                        {filteredAndSortedTrips.length} trips found
                      </Text>

                      <VStack spacing={4} align="stretch" mt={4}>
                        {currentItems.map((item) =>
                          isTrip(item) ? (
                            <TripCardComponent key={item.id} trip={item} />
                          ) : (
                            <LocationCardComponent
                              key={item.id}
                              location={item}
                              onDelete={deleteLocationBoth}
                            />
                          )
                        )}
                      </VStack>
                    </TabPanel>

                    <TabPanel p={0}>
                      <Stack
                        direction={{ base: "column", md: "row" }}
                        spacing={4}
                      >
                        <InputGroup maxW={{ base: "full", md: "300px" }}>
                          <InputLeftElement>
                            <SearchIcon color="gray.400" />
                          </InputLeftElement>
                          <Input
                            placeholder="Search locations"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </InputGroup>
                      </Stack>

                      <Text mt={4} color="gray.600">
                        {filteredLocations.length} locations found
                      </Text>

                      <VStack spacing={4} align="stretch" mt={4}>
                        {currentLocations.map((location) => (
                          <LocationCardComponent
                            onDelete={deleteLocationBoth}
                            key={location.id}
                            location={location}
                          />
                        ))}
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>

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
              </Stack>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default TripHistory;
