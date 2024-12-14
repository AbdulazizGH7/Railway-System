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

function App() {
  const user = {
    role: 'admin'
  }
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="/home" element={<HomePage userType={"Admin"}/>}/>
          <Route path="/booking" element={<TripsPage/>}/>
          <Route path="/reservations" element={<ReservationsPage userType={"Admin"}/>}/>
          <Route path="/reserve/:id" element={user.role === 'admin' ? <AddReservationPageAdmin/> :<BookingPage/>}/>
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/WaitlistPromotion" element={<WaitlistPromotion />} />
          <Route path="/AssignDriverPage" element={<AssignDriverPage />} />
        </Route>
      </>
    )
  )
  return (
    <>
    <UserProvider>
      <RouterProvider router={router}/>
    </UserProvider>
    </>
  )
}

export default App