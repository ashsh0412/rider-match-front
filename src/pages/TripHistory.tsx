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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  CalendarIcon,
  TimeIcon,
  StarIcon,
  ChevronDownIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { MapPin, DollarSign, SortDesc } from "lucide-react";
import NavBar from "../components/NavBar";

type DateFilter = "3 months" | "6 months" | "1 year";
type StatusFilter = "All" | "Completed" | "Cancelled";
type SortField = "date" | "price" | "rating";
type SortOrder = "asc" | "desc";

interface Trip {
  id: number;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  price: number;
  rating: number;
  driverName: string;
  status: "Completed" | "Cancelled";
}

const TripHistory: React.FC = () => {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("3 months");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const bg = useColorModeValue("white", "gray.800");

  // 샘플 데이터
  const allTrips: Trip[] = [
    {
      id: 1,
      date: "2024-03-15",
      time: "14:30",
      pickup: "Seoul Station",
      dropoff: "Gangnam Station",
      price: 12000,
      rating: 4.8,
      driverName: "Kim Chul-soo",
      status: "Completed",
    },
    {
      id: 2,
      date: "2024-03-14",
      time: "09:15",
      pickup: "Hongdae Station",
      dropoff: "Yeouido",
      price: 15000,
      rating: 4.5,
      driverName: "Lee Young-hee",
      status: "Completed",
    },
    {
      id: 3,
      date: "2024-03-13",
      time: "11:30",
      pickup: "Incheon Airport",
      dropoff: "Myeongdong",
      price: 65000,
      rating: 4.9,
      driverName: "Park Min-ji",
      status: "Completed",
    },
    {
      id: 4,
      date: "2024-03-12",
      time: "16:45",
      pickup: "Gangnam Station",
      dropoff: "Itaewon",
      price: 8000,
      rating: 4.2,
      driverName: "Choi Jun-ho",
      status: "Cancelled",
    },
  ];

  const months: Record<DateFilter, number> = {
    "3 months": 3,
    "6 months": 6,
    "1 year": 12,
  };

  // 필터링된 데이터 계산
  const filteredAndSortedTrips = useMemo(() => {
    let filtered = [...allTrips];

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(
        (trip) =>
          trip.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trip.dropoff.toLowerCase().includes(searchTerm.toLowerCase()) ||
          trip.driverName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 상태 필터링
    if (statusFilter !== "All") {
      filtered = filtered.filter((trip) => trip.status === statusFilter);
    }

    // 날짜 필터링
    const now = new Date();
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - months[dateFilter]);

    filtered = filtered.filter((trip) => {
      const tripDate = new Date(trip.date);
      return tripDate >= monthsAgo;
    });

    // 정렬
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case "price":
          comparison = b.price - a.price;
          break;
        case "rating":
          comparison = b.rating - a.rating;
          break;
      }
      return sortOrder === "desc" ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, dateFilter, statusFilter, sortBy, sortOrder]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredAndSortedTrips.length / itemsPerPage);
  const currentTrips = filteredAndSortedTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <Box>
      <NavBar />
      <Box pt="80px" minH="100vh" bg={bg}>
        <Container minW="100vh" py={8}>
          <Stack spacing={6}>
            <Flex justify="space-between" align="center">
              <Heading size="lg">Trip History</Heading>
              <Select
                w="150px"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              >
                <option>3 months</option>
                <option>6 months</option>
                <option>1 year</option>
              </Select>
            </Flex>

            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <InputGroup maxW={{ base: "full", md: "300px" }}>
                <InputLeftElement>
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search place or driver"
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
                <option>Cancelled</option>
              </Select>

              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<Icon as={SortDesc} />}
                  variant="outline"
                >
                  Sort by: {sortBy}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setSortBy("date")}>Date</MenuItem>
                  <MenuItem onClick={() => setSortBy("price")}>Price</MenuItem>
                  <MenuItem onClick={() => setSortBy("rating")}>
                    Rating
                  </MenuItem>
                </MenuList>
              </Menu>
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
                  <Flex justify="space-between">
                    <Stack spacing={4} flex={1}>
                      <HStack spacing={6}>
                        <HStack color="gray.600">
                          <Icon as={CalendarIcon} />
                          <Text>{trip.date}</Text>
                        </HStack>
                        <HStack color="gray.600">
                          <Icon as={TimeIcon} />
                          <Text>{trip.time}</Text>
                        </HStack>
                      </HStack>

                      <Stack spacing={2}>
                        <HStack>
                          <Icon as={MapPin} color="green.500" />
                          <Text>{trip.pickup}</Text>
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
                          <Text>{trip.dropoff}</Text>
                        </HStack>
                      </Stack>

                      <HStack spacing={6}>
                        <HStack>
                          <Icon as={DollarSign} color="gray.600" />
                          <Text fontWeight="semibold">
                            ₩{trip.price.toLocaleString()}
                          </Text>
                        </HStack>
                        <HStack>
                          <Icon as={StarIcon} color="yellow.400" />
                          <Text>{trip.rating}</Text>
                        </HStack>
                      </HStack>
                    </Stack>

                    <Stack align="flex-end" spacing={2}>
                      <Badge
                        colorScheme={
                          trip.status === "Completed" ? "green" : "red"
                        }
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
