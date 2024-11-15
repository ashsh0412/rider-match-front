import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignupCard from "./pages/SignUpForm";
import NotFound from "./pages/NotFound";
import LoginCard from "./pages/LoginForm";
import theme from "./theme";
import LoginCheck from "./api/LoginCheck";
import Profile from "./pages/UserInfo";
import DriverPage from "./pages/DriverPage";
import RiderPage from "./pages/RiderPage";
import TripHistory from "./pages/TripHistory";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/rider-page" />} />
          <Route path="/signup" element={<SignupCard />} />
          <Route
            path="/log-in"
            element={
              <LoginCheck>
                <LoginCard />
              </LoginCheck>
            }
          />
          <Route
            path="/rider-page"
            element={
              <LoginCheck>
                <RiderPage />
              </LoginCheck>
            }
          />
          <Route
            path="/driver-page"
            element={
              <LoginCheck>
                <DriverPage />
              </LoginCheck>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trip-history" element={<TripHistory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
