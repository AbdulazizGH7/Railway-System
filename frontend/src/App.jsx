import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from "react-router-dom";
import { UserProvider } from './contexts/UserContext'; 
import MainLayout from './layouts/MainLayout';
import HomePage from "./pages/HomePage";
import TripsPage from './pages/TripsPage'
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import ReservationsPage from "./pages/ReservationsPage";
import WaitlistPromotion from "./pages/WaitlistPromotion";
import AssignDriverPage from"./pages/AssignDriverPage"
import AddReservationPageAdmin from "./pages/AddReservationPageAdmin";
import { useUser } from "./contexts/UserContext"
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/booking" element={<TripsPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route
            path="/reserve/:trainId"
            element={
              <RoleBasedRoute />
            }
          />
          <Route path="/payment/:reservationId" element={<PaymentPage />} />
          <Route path="/WaitlistPromotion" element={<WaitlistPromotion />} />
          <Route path="/AssignDriverPage" element={<AssignDriverPage />} />
        </Route>
      </>
    )
  );

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

const RoleBasedRoute = () => {
  const { user } = useUser();

  return user?.role === "admin" ? <AddReservationPageAdmin /> : <BookingPage />;
};

export default App;
