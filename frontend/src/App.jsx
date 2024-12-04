import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import MainLayout from './layouts/MainLayout';
import BookingPage from './pages/BookingPage'
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<h1>Home</h1>}/>
          <Route path="/booking" element={<BookingPage/>}/>
          
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