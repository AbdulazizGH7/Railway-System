import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import MainLayout from './layouts/MainLayout';
import HomePage from "./pages/HomePage";
import BookingPage from './pages/BookingPage'
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<HomePage userType={"st"}/>}/>
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