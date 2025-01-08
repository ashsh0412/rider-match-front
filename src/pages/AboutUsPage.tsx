import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Button,
  Link,
  useColorModeValue,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import {
  FaClock,
  FaRoute,
  FaUserFriends,
  FaCar,
  FaShieldAlt,
  FaLeaf,
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  // Color modes
  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  const navBg = useColorModeValue("white", "gray.800");
  const navBorder = useColorModeValue("gray.200", "gray.700");

  // Service features data
  const features = [
    {
      icon: FaClock,
      title: "Arrival Time Based Matching",
      description:
        "Our intelligent system calculates optimal pickup times based on your desired arrival time. Only drivers available on your selected date will be matched.",
    },
    {
      icon: FaRoute,
      title: "Optimized Route System",
      description:
        "We provide the most efficient routes based on all passengers' locations traveling on the same date. The system automatically calculates pickup sequences to minimize travel time.",
    },
    {
      icon: FaUserFriends,
      title: "Smart Passenger Matching",
      description:
        "Accommodating up to 5 passengers, our system efficiently matches riders traveling similar routes to maximize convenience and cost-effectiveness.",
    },
    {
      icon: FaCar,
      title: "Real-time Location Based",
      description:
        "Using precise latitude and longitude coordinates, we offer accurate location services with real-time driver tracking capabilities.",
    },
    {
      icon: FaShieldAlt,
      title: "Secure Service",
      description:
        "We ensure your safety with verified drivers and a secure payment system, providing a reliable carpooling experience.",
    },
    {
      icon: FaLeaf,
      title: "Eco-Friendly Transportation",
      description:
        "Join us in reducing carbon emissions through carpooling, contributing to a more sustainable environment.",
    },
  ];

  return (
    <>
      {/* Navigation Bar */}
      <Box
        bg={navBg}
        borderBottom="1px"
        borderColor={navBorder}
        position="fixed"
        w="100%"
        zIndex={10}
      >
        <Container maxW="container.xl">
          <Flex h="64px" align="center">
            <Text
              fontSize="2xl"
              fontWeight="bold"
              cursor="pointer"
              onClick={() => navigate("/")}
            >
              DriverMatch
            </Text>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Box bg={bg} minH="100vh" pt="84px">
        <Container maxW="container.xl" py={10}>
          {/* Company Introduction Section */}
          <VStack spacing={8} align="start" mb={16}>
            <Heading as="h1" size="2xl" color={headingColor} mb={4}>
              About DriverMatch
            </Heading>
            <Text fontSize="xl" color={textColor} lineHeight="tall">
              DriverMatch is an innovative carpooling platform revolutionizing
              urban mobility. Founded in 2024 by a team of transportation and
              technology experts, we combine arrival time-based matching with
              optimized routing to provide efficient and environmentally
              conscious transportation services. Our mission is to create
              seamless, safe, and sustainable mobility solutions for communities
              worldwide.
            </Text>
          </VStack>

          {/* Services Section */}
          <Box mb={20}>
            <Heading as="h2" size="xl" mb={8} color={headingColor}>
              Our Services
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {features.map((feature, index) => (
                <Box
                  key={index}
                  bg={cardBg}
                  p={8}
                  borderRadius="lg"
                  boxShadow="md"
                  position="relative"
                  overflow="hidden"
                  _hover={{
                    transform: "translateY(-5px)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <HStack spacing={4} align="start">
                    <Icon
                      as={feature.icon}
                      color={iconColor}
                      boxSize={6}
                      mt={1}
                    />
                    <VStack align="start" spacing={2}>
                      <Heading as="h3" size="md" color={headingColor}>
                        {feature.title}
                      </Heading>
                      <Text color={textColor}>{feature.description}</Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Company Values Section */}
          <Box mb={20}>
            <Heading as="h2" size="xl" mb={8} color={headingColor}>
              Our Values
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <Box bg={cardBg} p={8} borderRadius="lg" boxShadow="md">
                <Heading as="h3" size="lg" mb={4} color={headingColor}>
                  Reliability
                </Heading>
                <Text color={textColor} fontSize="lg">
                  We deliver trustworthy carpooling experiences through precise
                  location-based services and optimized routing systems. Every
                  driver undergoes thorough verification to ensure service
                  safety and quality.
                </Text>
              </Box>
              <Box bg={cardBg} p={8} borderRadius="lg" boxShadow="md">
                <Heading as="h3" size="lg" mb={4} color={headingColor}>
                  Sustainability
                </Heading>
                <Text color={textColor} fontSize="lg">
                  By reducing individual car trips and promoting shared rides,
                  we actively contribute to reducing carbon emissions. Join us
                  in creating a more sustainable future through collaborative
                  transportation.
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Contact Information Section */}
          <Box mb={20}>
            <Heading as="h2" size="xl" mb={8} color={headingColor}>
              Contact Us
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <VStack align="start" spacing={6}>
                <Text fontSize="lg" color={textColor}>
                  Have questions or suggestions? We'd love to hear from you.
                  Contact our team for prompt assistance.
                </Text>
                <List spacing={4}>
                  <ListItem>
                    <HStack>
                      <ListIcon as={FaPhone} color={iconColor} />
                      <Text color={textColor}>+1 (555) 123-4567</Text>
                    </HStack>
                  </ListItem>
                  <ListItem>
                    <HStack>
                      <ListIcon as={FaEnvelope} color={iconColor} />
                      <Text color={textColor}>support@drivermatch.com</Text>
                    </HStack>
                  </ListItem>
                  <ListItem>
                    <HStack>
                      <ListIcon as={FaMapMarkerAlt} color={iconColor} />
                      <Text color={textColor}>
                        123 Innovation Drive, San Francisco, CA 94105
                      </Text>
                    </HStack>
                  </ListItem>
                </List>
              </VStack>
              <Box bg={cardBg} p={8} borderRadius="lg" boxShadow="md">
                <Heading as="h3" size="md" mb={4} color={headingColor}>
                  Business Hours
                </Heading>
                <VStack align="start" spacing={2}>
                  <Text color={textColor}>
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </Text>
                  <Text color={textColor}>Saturday: 10:00 AM - 4:00 PM</Text>
                  <Text color={textColor}>Sunday: Closed</Text>
                  <Text color={textColor} mt={4}>
                    24/7 Emergency Support Available
                  </Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Legal Information Section */}
          <Box mb={20}>
            <Heading as="h2" size="xl" mb={8} color={headingColor}>
              Legal Information
            </Heading>
            <Accordion allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Privacy Policy Highlights
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} color={textColor}>
                  <VStack align="start" spacing={4}>
                    <Text>
                      At DriverMatch, we take your privacy seriously. Learn
                      about how we collect, use, and protect your personal
                      information.
                    </Text>
                    <List spacing={3}>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Secure data encryption and storage
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Transparent data collection practices
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        No sharing of personal information with third parties
                      </ListItem>
                    </List>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Terms of Service Overview
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} color={textColor}>
                  <VStack align="start" spacing={4}>
                    <Text>
                      Our terms of service ensure a safe and reliable experience
                      for all users. Key points include:
                    </Text>
                    <List spacing={3}>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        User responsibilities and rights
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Service usage guidelines
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Payment and cancellation policies
                      </ListItem>
                    </List>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
          {/* FAQ Section */}
          <Box mb={20}>
            <Heading as="h2" size="xl" mb={8} color={headingColor}>
              Frequently Asked Questions
            </Heading>
            <Accordion allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      How does DriverMatch ensure safety?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} color={textColor}>
                  <VStack align="start" spacing={4}>
                    <Text>
                      Safety is our top priority. We implement multiple safety
                      measures:
                    </Text>
                    <List spacing={3}>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Thorough driver background checks and verification
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Real-time location tracking
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        24/7 customer support
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Secure payment system
                      </ListItem>
                    </List>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      How is the fare calculated?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} color={textColor}>
                  <VStack align="start" spacing={4}>
                    <Text>
                      Our fare calculation is transparent and based on several
                      factors:
                    </Text>
                    <List spacing={3}>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Distance of the journey
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Time of day and expected traffic
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Number of passengers sharing the ride
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Additional stops along the route
                      </ListItem>
                    </List>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      What if my plans change?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} color={textColor}>
                  <Text>
                    We understand plans can change. You can cancel your ride up
                    to 2 hours before the scheduled pickup time without any
                    cancellation fee. For cancellations made less than 2 hours
                    before pickup, a small fee may apply to compensate the
                    driver for their preparation.
                  </Text>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      Can I schedule regular rides?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} color={textColor}>
                  <VStack align="start" spacing={4}>
                    <Text>
                      Yes! We offer several options for regular commuters:
                    </Text>
                    <List spacing={3}>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Weekly schedule setting
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Monthly pass options
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Priority matching with preferred drivers
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Flexible scheduling for different days
                      </ListItem>
                    </List>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      How do you match drivers and passengers?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} color={textColor}>
                  <VStack align="start" spacing={4}>
                    <Text>
                      Our matching system considers multiple factors to ensure
                      optimal pairing:
                    </Text>
                    <List spacing={3}>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Desired arrival time and location
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Route compatibility with other passengers
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Driver availability and ratings
                      </ListItem>
                      <ListItem>
                        <ListIcon as={FaCheckCircle} color={iconColor} />
                        Vehicle capacity and preferences
                      </ListItem>
                    </List>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AboutPage;
