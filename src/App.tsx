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
import LoginCheck from "./API/LoginCheck";
import Profile from "./API/UserInfo";
import DriverPage from "./pages/DriverPage";
import RiderPage from "./pages/RiderPage";
import TripHistory from "./pages/TripHistory";
import KakaoConfirm from "./API/KakaoConfirm";
import GoogleConfirm from "./API/GoogleConfirm";
import WelcomePage from "./pages/WelcomePage";
import AboutPage from "./pages/AboutUsPage";

function App() {
  const isDevelopment = process.env.NODE_ENV === "development";
  // basename은 경로만 포함해야 합니다
  const basename = isDevelopment ? "/" : "";

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router basename={basename}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/welcome" />} />
          <Route path="/welcome" element={<WelcomePage />} />
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
          <Route path="/aboutus" element={<AboutPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trip-history" element={<TripHistory />} />
          <Route path="/oauth/kakao" element={<KakaoConfirm />} />
          <Route path="/oauth/google" element={<GoogleConfirm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
