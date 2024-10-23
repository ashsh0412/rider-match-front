import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
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
import theme from "./theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
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
