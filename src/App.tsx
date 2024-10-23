import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignupCard from "./SignUpForm";
import NotFound from "./NotFound";
import LoginCard from "./LoginForm";
import RideRequest from "./RiderPage";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/signup" />} />
          <Route path="/signup" element={<SignupCard />} />
          <Route path="/log-in" element={<LoginCard />} />
          <Route path="/rider-page" element={<RideRequest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
