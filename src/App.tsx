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
import RideRequest from "./pages/RiderPage";
import theme from "./theme";
import LoginCheck from "./api/LoginCheck";
import Profile from "./pages/UserProfile";

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
                <RideRequest />
              </LoginCheck>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
