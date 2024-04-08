import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import { AnimatePresence } from "framer-motion";
import AuthRoutes from "./components/AuthRoutes";
import NotFoundPage from "./pages/NotFoundPage";
import { ToastContainer } from "react-toastify";
import GuestRoutes from "./components/GuestRoutes";
import SingleBlogPage from "./pages/SingleBlogPage";
import UserBlogsPage from "./pages/UserBlogsPage";
import CreateBlogPage from "./pages/CreateBlogPage";
import EditBlogPage from "./pages/EditBlogPage";

const App = () => {
  const location = useLocation();
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden h-screen">
      <Navbar />
      <div className="text-black h-[calc(100vh-73.6px)] dark:text-white overflow-auto w-screen">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.key}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                <GuestRoutes>
                  <LoginPage />
                </GuestRoutes>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoutes>
                  <RegisterPage />
                </GuestRoutes>
              }
            />
            <Route path="/blogs/:id" element={<SingleBlogPage />} />
            <Route
              path="/user-blogs"
              element={
                <AuthRoutes>
                  <UserBlogsPage />
                </AuthRoutes>
              }
            />
            <Route
              path="/blogs/create"
              element={
                <AuthRoutes>
                  <CreateBlogPage />
                </AuthRoutes>
              }
            />
            <Route
              path="/blogs/:id/edit"
              element={
                <AuthRoutes>
                  <EditBlogPage />
                </AuthRoutes>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>

        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </div>
  );
};

export default App;
