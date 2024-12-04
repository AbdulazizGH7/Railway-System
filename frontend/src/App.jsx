import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import MainLayout from './layouts/MainLayout';
import HomePage from "./pages/HomePage";
import BookingPage from './pages/BookingPage'
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import ReservationPage from "./pages/ReservationPage";
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<HomePage userType={"st"}/>}/>
          <Route path="/booking" element={<BookingPage/>}/>
          <Route path="/reserve" element={<ReservationPage />} />
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