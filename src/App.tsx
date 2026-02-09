import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFoundScreen from "./screens/NotFoundScreen";
import HomePage from "./HomePage";
import IsNotLoginAuth from "./redux/features/auth/IsNotLoginAuth";
import RegisterScreen from "./screens/auth/RegisterScreen";
import DashboardPage from "./DashboardPage";
import OTPVerificationScreen from "./screens/auth/OTPVerificationScreen";
import SignInScreen from "./screens/auth/SignInScreen";
import ForgotPasswordScreen from "./screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/auth/ResetPasswordScreen";
import AdminRoute from "./redux/features/auth/AdminRoutes";
import { setCredentials } from "./redux/features/auth/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetUserQuery } from "./redux/api/apiSlice";
import { Loader } from "lucide-react";
import PhotoVerificationPage from "./screens/PhotoVerificationPage";
import UserProfilePage from "./screens/UserProfilePage";
import UpdatePassword from "./screens/UpdatePassword";
import UpdateUserProfile from "./screens/UpdateUserProfile";
import ManageUsersAdminPage from "./screens/admin/ManageUsersAdminPage";
import UserDetailPage from "./screens/admin/UserDetailPage";
import NotificationPage from "./NotificationPage";

function App() {
  const dispatch = useDispatch();
  const { data: user, isLoading } = useGetUserQuery();

  useEffect(() => {
    if (user) {
      dispatch(
        setCredentials({ user, token: localStorage.getItem("token") || "" })
      );
    }
  }, [user, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader className="animate-spin text-green-600" size={64} />
        </div>
      </div>
    );
  }
  return (
    <>
      <BrowserRouter>
        {/* <Header /> */}
        <Routes>
          <Route path="*" element={<NotFoundScreen />} />
          <Route path="/" element={<HomePage />} />

          <Route element={<IsNotLoginAuth />}>
            <Route path="/register" element={<RegisterScreen />} />
            <Route
              path="/otp-verification"
              element={<OTPVerificationScreen />}
            />
            <Route path="/login" element={<SignInScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            <Route path="/reset-password" element={<ResetPasswordScreen />} />
          </Route>

          <Route element={<AdminRoute allowedRoles={["staff"]} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/dashboard/verification"
              element={<PhotoVerificationPage />}
            />
            <Route path="/dashboard/profile" element={<UserProfilePage />} />
            <Route
              path="/dashboard/my-password-update"
              element={<UpdatePassword />}
            />
            <Route path="/dashboard/edit-profile" element={<UpdateUserProfile />} />
             <Route path="/dashboard/notifications" element={<NotificationPage />} />
          </Route>

          <Route element={<AdminRoute allowedRoles={["Super Admin", "staff", "admin"]} />}>
            <Route path="/admin-dashboard" element={<ManageUsersAdminPage />} />
            <Route path="/admin/users/:id" element={<UserDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
