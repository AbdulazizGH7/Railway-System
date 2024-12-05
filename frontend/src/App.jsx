import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from "react-router-dom";
import MainLayout from './layouts/MainLayout';
import HomePage from "./pages/HomePage";
import TripsPage from './pages/TripsPage'
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      {/*<Route path="/" element={<Navigate to="/login" replace />} />*/}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<HomePage userType={"st"}/>}/>
          <Route path="/booking" element={<TripsPage/>}/>
          <Route path="/reserve" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Route>

      </>
    )
  )
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App