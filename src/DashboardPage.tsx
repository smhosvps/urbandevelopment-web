import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  User,
  Shield,
  TrendingUp,
  Calendar,
  Eye,
  Edit,
  ChevronRight,
  BellRing,
  Zap,
  Target,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building,
  IdCard,
  Hash,
  Building2,
  CalendarDays,
  Clock3,
  Camera,
  X,
  Maximize2,
  Check,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserQuery } from "./redux/api/apiSlice";
import { DashboardHeader } from "./components/DashboardHeader";

// Avatar Modal Component
function AvatarModal({
  avatarUrl,
  isOpen,
  onClose,
}: {
  avatarUrl: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full mx-4 overflow-hidden shadow-2xl animate-in fade-in zoom-in">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Profile Photo
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-green-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="relative  rounded-xl overflow-hidden border-4 border-white shadow-xl mb-6">
            <img
              src={avatarUrl}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://via.placeholder.com/400x400/3b82f6/ffffff?text=Profile";
              }}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            This is your official profile photo visible to authorized personnel
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: userData } = useGetUserQuery();
  const [greeting, setGreeting] = useState("");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showVerificationCenter, setShowVerificationCenter] = useState(true);

  const user = userData?.user;

  console.log("User data in DashboardPage:", user);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Hide Verification Center if user has avatar
    if (user?.avatar?.url) {
      setShowVerificationCenter(false);
    }
  }, [user]);

  // Check user statuses based on actual data structure
  const isVerified = user?.isVerified || false;
  const isApproved = user?.is_approved === "approved";
  const isAdmin = user?.role === "admin" || user?.role === "Super Admin";
  const isStaff = user?.role === "staff";

  // Calculate profile completeness
  const calculateProfileCompleteness = () => {
    if (!user) return 0;

    const fields = [
      user.firstName,
      user.lastName,
      user.email,
      user.staffId,
      user.designation,
      user.department_or_station,
      user.gender,
      user.dateOfBirth,
      user.phoneNumber,
      user.address,
      user.avatar?.url, // Include avatar in completeness calculation
    ];

    const filledFields = fields.filter(
      (field) => field && field.toString().trim() !== ""
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const profileCompleteness = calculateProfileCompleteness();

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleUploadPhoto = () => {
    navigate("/dashboard/photo-upload");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
      {/* Avatar Modal */}
      <AvatarModal
        avatarUrl={user?.avatar?.url || ""}
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Geometric Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #187339 2px, transparent 2px),
                              radial-gradient(circle at 75% 75%, #187339 2px, transparent 2px)`,
            backgroundSize: "60px 60px",
          }}
        ></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-green-100/10 to-emerald-100/5 rounded-full blur-3xl animate-float-shape-1"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-tr from-green-200/5 to-emerald-200/3 rounded-full blur-3xl animate-float-shape-2"></div>

        {/* Grid Lines */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, #187339 1px, transparent 1px),
              linear-gradient(to bottom, #187339 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <DashboardHeader title="Dashboard" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Special Background */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 p-6 sm:p-8 shadow-lg">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-green-200/20 to-emerald-200/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-green-200/10 to-emerald-200/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-green-700 mb-3 animate-fade-in-down">
                  <BellRing className="w-4 h-4" />
                  {greeting}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">
                  Welcome back, {user?.firstName}!
                </h2>
                <p className="text-gray-600 max-w-2xl">
                  Manage your professional profile and credentials with the
                  Ministry of Urban Development
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  {user?.avatar?.url ? (
                    <>
                      <div
                        className="w-16 h-16 rounded-xl overflow-hidden border-4 border-white shadow-lg cursor-pointer group-hover:opacity-90 transition-opacity"
                        onClick={() => setShowAvatarModal(true)}
                      >
                        <img
                          src={user.avatar.url}
                          alt={`${user.firstName}'s avatar`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=10b981&color=fff&size=64`;
                          }}
                        />
                      </div>

                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </div>
                    </>
                  )}
                  <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-gray-500 bg-white rounded-full p-0.5 shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard with Floating Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Photo Status Card */}
          <div className="relative group animate-fade-in-up">
            <div className="absolute -inset-0.5  rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-white rounded-xl p-6 shadow-lg border border-green-200/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Profile Photo
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {user?.avatar?.url ? "Uploaded" : "Required"}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-[40px] ${
                    user?.avatar?.url
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-500"
                  }`}
                >
                  {user?.avatar?.url ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    <Camera className="w-8 h-8" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Approval Status Card */}
          <div className="relative group animate-fade-in-up delay-100">
            <div className="absolute -inset-0.5 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-white rounded-xl p-6 shadow-lg border border-blue-200/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Approval Status
                  </p>
                  <p
                    className={`text-2xl font-bold mt-2 ${
                      user?.is_approved === "approved"
                        ? "text-green-700"
                        : user?.is_approved === "rejected"
                        ? "text-red-700"
                        : "text-orange-700"
                    }`}
                  >
                    {user?.is_approved?.charAt(0).toUpperCase() +
                      user?.is_approved?.slice(1) || "Pending"}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-[40px] ${
                    user?.is_approved === "approved"
                      ? "bg-green-100 text-green-600"
                      : user?.is_approved === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-orange-100 text-orange-500"
                  }`}
                >
                  {user?.is_approved === "approved" ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : user?.is_approved === "rejected" ? (
                    <Shield className="w-8 h-8" />
                  ) : (
                    <Clock className="w-8 h-8" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                {user?.is_approved === "approved"
                  ? "✓ Your account has been approved by administrators"
                  : user?.is_approved === "rejected"
                  ? "Your application requires attention"
                  : "Waiting for administrative approval"}
              </p>
            </div>
          </div>

          {/* Account Type Card */}
          <div className="relative group animate-fade-in-up delay-200">
            <div className="absolute -inset-0.5 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-white rounded-xl p-6 shadow-lg border border-purple-200/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Account Type
                  </p>
                  <p className="text-2xl font-bold text-green-700 mt-2">
                    {user?.role === "Super Admin"
                      ? "Super Administrator"
                      : user?.role === "admin"
                      ? "Administrator"
                      : "Staff Member"}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-[40px] ${
                    user?.role === "Super Admin" || user?.role === "admin"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  <Shield className="w-8 h-8" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                {user?.role === "Super Admin"
                  ? "Full system access with all privileges"
                  : user?.role === "admin"
                  ? "Administrative access with management tools"
                  : "Standard access for staff members"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Actions
                </h3>
                <p className="text-green-100 text-sm">
                  Access your most important features
                </p>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: User,
                    title: "View & Edit Profile",
                    description: "Update your personal information",
                    color: "from-green-500 to-emerald-400",
                    link: "/dashboard/profile",
                  },
                  {
                    icon: BellRing,
                    title: "Notifications",
                    description: "Check your latest messages",
                    color: "from-green-500 to-emerald-400",
                    link: "/dashboard/notifications",
                  },
                  {
                    icon: Camera,
                    title: "Update Photo",
                    description: "Complete your verification process",
                    color: "from-green-500 to-emerald-400",
                    link: "/dashboard/verification",
                    condition: showVerificationCenter, // Conditionally show
                  },
                ]
                  .filter(
                    (action) =>
                      (!action.adminOnly || isAdmin) &&
                      (action.showAlways || action.condition !== false)
                  )
                  .map((action, idx) => (
                    <Link
                      key={idx}
                      to={action.link}
                      className="group block animate-fade-in-up"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-transparent transition-all duration-300 group-hover:-translate-y-1">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-[40px] bg-gradient-to-br ${action.color} text-white`}
                          >
                            <action.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                {action.title}
                              </h4>
                              <ChevronRight className="w-4 h-4 rounded-[40px] text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}

                {/* Admin Dashboard Special Button */}
                {isAdmin && (
                  <div className="sm:col-span-2 animate-fade-in-up delay-300">
                    <Link to="/admin-dashboard">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-500 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                              <Shield className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">
                                Admin Dashboard
                              </h4>
                              <p className="text-purple-100 text-sm">
                                Full system administration
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            {/* Quick Stats Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mt-8 animate-slide-in-right delay-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Profile Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-[5px]">
                  <div>
                    <p className="text-sm text-gray-600">
                      Profile Completeness
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {profileCompleteness}%
                    </p>
                  </div>
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-2 border-green-200"></div>
                    <div
                      className="absolute inset-1 rounded-full bg-green-600 flex items-center justify-center"
                      style={{
                        clipPath: `inset(0 ${100 - profileCompleteness}% 0 0)`,
                      }}
                    >
                      <span className="text-white font-bold text-xs">
                        {profileCompleteness}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-[5px]">
                  <div>
                    <p className="text-sm text-gray-600">Verification Status</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {isVerified ? "Verified" : "Pending"}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isVerified ? "bg-green-100" : "bg-orange-100"
                    }`}
                  >
                    {isVerified ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-orange-500" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-[5px]">
                  <div>
                    <p className="text-sm text-gray-600">Approval Status</p>
                    <p
                      className={`text-2xl font-bold ${
                        user?.is_approved === "approved"
                          ? "text-green-700"
                          : user?.is_approved === "rejected"
                          ? "text-red-700"
                          : "text-orange-700"
                      }`}
                    >
                      {user?.is_approved?.charAt(0).toUpperCase() +
                        user?.is_approved?.slice(1)}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      user?.is_approved === "approved"
                        ? "bg-green-100"
                        : user?.is_approved === "rejected"
                        ? "bg-red-100"
                        : "bg-orange-100"
                    }`}
                  >
                    {user?.is_approved === "approved" ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : user?.is_approved === "rejected" ? (
                      <Shield className="w-6 h-6 text-red-600" />
                    ) : (
                      <Clock3 className="w-6 h-6 text-orange-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Summary & Stats */}
          <div className="space-y-6">
            {/* Profile Summary Card with Avatar */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-lg animate-slide-in-right">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-bl-full"></div>
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Profile Summary
                  </h3>
                  <Link to="/dashboard/profile">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                </div>

                {/* Avatar Preview */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    {user?.avatar?.url ? (
                      <>
                        <div
                          className="w-24 h-24 rounded-xl overflow-hidden border-4 border-white shadow-lg cursor-pointer group-hover:opacity-90 transition-opacity"
                          onClick={() => setShowAvatarModal(true)}
                        >
                          <img
                            src={user.avatar.url}
                            alt={`${user.firstName}'s avatar`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=10b981&color=fff&size=96`;
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.designation || "Staff Member"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-100/50">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                      <IdCard className="w-3 h-3" />
                      Staff ID
                    </p>
                    <p className="text-lg font-semibold text-green-700 font-mono">
                      {user?.staffId || "Not assigned"}
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-100/50">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                      <Briefcase className="w-3 h-3" />
                      Designation
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.designation || "Not specified"}
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-100/50">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                      <Building className="w-3 h-3" />
                      Department
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.department_or_station || "Not assigned"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-200/50">
                    <p className="text-xs font-medium text-green-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                      <CalendarDays className="w-3 h-3" />
                      Member Since
                    </p>
                    <p className="text-lg font-semibold text-green-800">
                      {formatDate(user?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Full Name
                  </p>
                  <p className="font-medium text-gray-900">
                    {user?.firstName} {user?.middleName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Gender
                  </p>
                  <p className="font-medium text-gray-900">
                    {user?.gender
                      ? user.gender.charAt(0).toUpperCase() +
                        user.gender.slice(1)
                      : "Not specified"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Date of Birth
                </p>
                <p className="font-medium text-gray-900">
                  {user?.dateOfBirth
                    ? formatDate(user.dateOfBirth)
                    : "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  State of Origin
                </p>
                <p className="font-medium text-gray-900">
                  {user?.state_of_origin || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <Building2 className="w-3 h-3" />
                  Local Government
                </p>
                <p className="font-medium text-gray-900">
                  {user?.Local_of_origin || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  Address
                </p>
                <p className="font-medium text-gray-900">
                  {user?.address || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact & Official Numbers Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 animate-fade-in-up delay-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-green-600" />
              Contact & Official Numbers
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  Email Address
                </p>
                <p className="font-medium text-green-700 break-all">
                  {user?.email || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  Phone Number
                </p>
                <p className="font-medium text-gray-900">
                  {user?.phoneNumber || "Not provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    IPPS
                  </p>
                  <p className="font-medium text-gray-900">
                    {user?.ipps || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    NIN
                  </p>
                  <p className="font-medium text-gray-900">
                    {user?.nin || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    TIN
                  </p>
                  <p className="font-medium text-gray-900">
                    {user?.tin || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    NHF
                  </p>
                  <p className="font-medium text-gray-900">
                    {user?.nhf || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    NHI
                  </p>
                  <p className="font-medium text-gray-900">
                    {user?.nhi || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Years of Service
                  </p>
                  <p className="font-medium text-gray-900">
                    {user?.year_of_appointment && user?.year_of_retirement
                      ? `${user.year_of_appointment} - ${user.year_of_retirement}`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Section */}
        <div className="mt-8 animate-fade-in-up delay-200">
          <div
            className={`rounded-2xl shadow-lg overflow-hidden border-2 ${
              isVerified && isApproved
                ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                : "border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50"
            }`}
          >
            <div
              className={`px-6 py-4 ${
                isVerified && isApproved
                  ? "bg-green-600"
                  : "bg-orange-500"
              }`}
            >
              <div className="flex items-center">
                <h3 className="text-lg font-bold text-white">
                  {isVerified && isApproved
                    ? "Account Status"
                    : "Important Notice"}
                </h3>
              </div>
            </div>
            <div className="p-6">
              {!isVerified ? (
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2 text-lg">
                      Email Verification Required
                    </h4>
                    <p className="text-orange-800">
                      Your email address has not been verified. Please check
                      your email for the verification link or request a new
                      verification email.
                    </p>
                    <div className="mt-4 flex gap-3">
                      <Link to="/verify-email">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-300 text-orange-700 hover:bg-orange-50"
                        >
                          Verify Email
                        </Button>
                      </Link>
                      <Link to="/resend-verification">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-300 text-orange-700 hover:bg-orange-50"
                        >
                          Resend Email
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : user?.is_approved === "pending" ? (
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2 text-lg">
                      Administrative Approval Pending
                    </h4>
                    <p className="text-orange-800 mb-4">
                      Your account is verified but awaiting administrative
                      approval. Administrators will review your credentials
                      shortly. You can continue to update your profile in the
                      meantime.
                    </p>
                    <div className="mt-4 flex gap-3">
                      <Link to="/dashboard/profile">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-300 text-orange-700 hover:bg-orange-50 rounded-[5px]"
                        >
                          Complete Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : user?.is_approved === "rejected" ? (
                <div className="flex items-start gap-3">
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2 text-lg">
                      Application Rejected - Action Required
                    </h4>
                    <p className="text-red-800 mb-4">
                      Your application has been rejected. Please review the
                      feedback from administrators and update your information
                      accordingly.
                    </p>

                    {/* Rejection Reason Box */}
                    {user?.reason_for_rejection && (
                      <div className="mb-4">
                        <div className="bg-red-50 border border-red-200 rounded-[6px] p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-medium text-red-800">
                              Reason for Rejection:
                            </p>
                          </div>
                          <p className="text-red-700 text-sm pl-6">
                            "{user.reason_for_rejection}"
                          </p>
                          <p className="text-red-600 text-xs mt-2 pl-6">
                            Please address this issue and resubmit your
                            application.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex gap-3">
                      <Link to="/dashboard/verification">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-50 rounded-[5px]"
                        >
                          Update Information
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2 text-lg">
                      ✓ Account Fully Verified & Approved
                    </h4>
                    <p className="text-green-800 mb-4">
                      Your credentials have been verified and your account is
                      fully approved. You now have access to all features and
                      services.
                      {user?.avatar?.url && (
                        <span className="block mt-2 text-green-700">
                          ✓ Profile photo uploaded and verified
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Avatar Status Notice - Shows when no avatar exists */}
        {!user?.avatar?.url && (
          <div className="mt-6 animate-fade-in-up delay-300">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Camera className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-900 text-lg mb-2">
                    Complete Your Profile with a Photo
                  </h4>
                  <p className="text-orange-800 mb-4">
                    Upload a clear profile photo to complete your verification
                    process. This helps administrators identify you and enhances
                    your professional profile.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleUploadPhoto}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Profile Photo
                    </Button>
                    <Link to="/dashboard/verification">
                      <Button
                        variant="outline"
                        className="border-orange-300 text-orange-700 hover:bg-orange-50"
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Last updated: {formatDate(user?.updatedAt)} •
            <span className="text-green-600 font-medium ml-2">
              Ministry of Urban Development
            </span>
          </p>
        </div>
      </main>

      {/* CSS Animations */}
      <style>{`
        @keyframes float-shape-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(180deg); }
        }
        
        @keyframes float-shape-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, 20px) rotate(-180deg); }
        }
        
        .animate-float-shape-1 {
          animation: float-shape-1 20s ease-in-out infinite;
        }
        
        .animate-float-shape-2 {
          animation: float-shape-2 25s ease-in-out infinite;
        }
        
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
        
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-in {
          animation: zoom-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
