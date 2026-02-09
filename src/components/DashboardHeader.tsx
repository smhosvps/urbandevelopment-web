import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useGetUserQuery, useLogoutMutation } from "@/redux/api/apiSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCredentials } from "@/redux/features/auth/authSlice";
import NotificationBell from "./NotificationBell";

export function DashboardHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const { data: userData } = useGetUserQuery();

  const user = userData?.user;
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      // Navigate to sign-in page
      navigate("/");
      // Refresh the page
      window.location.reload();
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };


  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {title === "Dashboard" ? (
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Coat_of_arms_of_Nigeria.svg"
                  alt="Logo"
                  className=""
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-green-800 bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Staff Portal
                </p>
              </div>
            </Link>
          ) : (
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Coat_of_arms_of_Nigeria.svg"
                  alt="Logo"
                  className=""
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-green-800 bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Staff Portal
                </p>
              </div>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Notification Bell */}
          <button className="relative p-2 hover:bg-green-50 rounded-lg transition-all group">
            <NotificationBell />
          </button>

          {/* User Profile - Desktop Only */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-white shadow-sm overflow-hidden">
              {user?.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-green-700">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-start">
              <p className="text-sm font-semibold text-gray-900">
                {user?.firstName}
              </p>
              <p className="text-xs text-gray-500">{user?.designation}</p>
            </div>
          </div>

          {/* Logout Button - Desktop Only */}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="hidden sm:flex border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 bg-transparent rounded-[5px] font-medium transition-all group"
          >
            <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            <span>Logout</span>
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 hover:bg-green-50 rounded-lg transition"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur animate-slide-in-down">
          <div className="p-4">
            {/* User Info Section */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-white overflow-hidden">
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-700">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.designation}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2 mb-4">
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition"
                onClick={() => setShowMobileMenu(false)}
              >
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-green-700">P</span>
                </div>
                <span>View Profile</span>
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-green-700">
                      A
                    </span>
                  </div>
                  <span>Admin Dashboard</span>
                </Link>
              )}

              <Link
                to="/dashboard/settings"
                className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition"
                onClick={() => setShowMobileMenu(false)}
              >
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-green-700">S</span>
                </div>
                <span>Settings</span>
              </Link>
            </div>

            {/* Mobile Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 bg-transparent rounded-[5px] font-medium transition-all group mt-2"
            >
              <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
