import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building,
  IdCard,
  Shield,
  Calendar,
  Clock,
  Edit,
  Camera,
  X,
  Download,
  Maximize2,
  CheckCircle2,
  FileText,
  Hash,
  Home,
  Globe,
  Users,
  Building2,
  CalendarDays,
  ChevronRight,
  ShieldCheck,
  Settings,
  MapPin as LocationIcon,
} from "lucide-react";
import { useGetUserQuery } from "@/redux/api/apiSlice";
import { Link } from "react-router-dom";

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
          <div className="relative rounded-xl overflow-hidden border-4 border-white shadow-xl mb-6">
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

export default function UserProfilePage() {
  const { data: userData } = useGetUserQuery();
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const user = userData?.user;
  const isApproved = user?.is_approved === "approved";

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
      console.log("Date formatting error:", error);
      return dateString;
    }
  };

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
      user.state_of_origin,
      user.Local_of_origin,
      user.avatar?.url,
      user.ipps,
      user.nin,
      user.tin,
      user.nhf,
      user.nhi,
      user.currentEmploymentLocation,
      user.year_of_appointment,
      user.year_of_retirement,
    ];

    const filledFields = fields.filter(
      (field) => field && field.toString().trim() !== ""
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const profileCompleteness = calculateProfileCompleteness();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
      {/* Modals */}
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

      <DashboardHeader title="My Profile" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Section */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 p-6 sm:p-8 shadow-lg">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-green-200/20 to-emerald-200/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-green-200/10 to-emerald-200/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  {user?.avatar?.url ? (
                    <>
                      <div
                        className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl cursor-pointer group-hover:opacity-90 transition-opacity"
                        onClick={() => setShowAvatarModal(true)}
                      >
                        <img
                          src={user.avatar.url}
                          alt={`${user.firstName}'s avatar`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=10b981&color=fff&size=128`;
                          }}
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white border-green-300 rounded-full p-1.5 shadow-md">
                        <div
                          onClick={() => setShowAvatarModal(true)}
                          className=" cursor-pointer"
                        >
                          <Maximize2 className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-green-700 mb-3">
                      <User className="w-4 h-4" />
                      Staff Profile
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                      {user?.firstName} {user?.middleName} {user?.lastName}
                    </h1>
                    <p className="text-xl text-emerald-700 font-medium mb-3">
                      {user?.designation}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-4">
                      <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-[6px] border border-green-100">
                        <Building className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {user?.department_or_station}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-[6px] border border-green-100">
                        <IdCard className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {user?.staffId}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-[6px] border border-green-100">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {user?.role}
                        </span>
                      </div>
                      {user?.currentEmploymentLocation && (
                        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-[6px] border border-green-100">
                          <LocationIcon className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {user.currentEmploymentLocation}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link to="/dashboard/edit-profile">
                      <Button className="bg-green-600 hover:bg-green-700 rounded-[5px] text-white font-medium transition-all group">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Personal Information
                </h2>
                <div className="text-green-600 flex flex-row items-center">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-3 h-3" />
                      Full Name
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.firstName} {user?.middleName} {user?.lastName}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      Email Address
                    </label>
                    <p className="text-lg font-semibold text-green-700 break-all">
                      {user?.email}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      Phone Number
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.phoneNumber || "Not provided"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      Date of Birth
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.dateOfBirth
                        ? formatDate(user.dateOfBirth)
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      Address
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.address || "Not specified"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      State of Origin
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.state_of_origin || "Not specified"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Home className="w-3 h-3" />
                      Local Government
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.Local_of_origin || "Not specified"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      Gender
                    </label>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {user?.gender || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 animate-fade-in-up delay-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  Professional Information
                </h2>
                <div className="text-green-600 flex flex-row items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <IdCard className="w-3 h-3" />
                      Staff ID
                    </label>
                    <p className="text-lg font-semibold text-green-700 font-mono">
                      {user?.staffId}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-3 h-3" />
                      Designation
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.designation}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Building className="w-3 h-3" />
                      Department
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.department_or_station}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <LocationIcon className="w-3 h-3" />
                      Current Work Location
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.currentEmploymentLocation || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <CalendarDays className="w-3 h-3" />
                      Years of Service
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.year_of_appointment && user?.year_of_retirement
                        ? `${user.year_of_appointment} - ${user.year_of_retirement}`
                        : "Not specified"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-3 h-3" />
                      Registration Source
                    </label>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {user?.register_source?.replace("_", " ") ||
                        "Not specified"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Member Since
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(user?.createdAt)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Shield className="w-3 h-3" />
                      Current Employment Status
                    </label>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {user?.currentEmploymentStatus || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Numbers Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 animate-fade-in-up delay-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Hash className="w-5 h-5 text-green-600" />
                Official Numbers
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "IPPS", value: user?.ipps, icon: FileText },
                  { label: "NIN", value: user?.nin, icon: IdCard },
                  { label: "TIN", value: user?.tin, icon: FileText },
                  { label: "NHF", value: user?.nhf, icon: Shield },
                  { label: "NHI", value: user?.nhi, icon: ShieldCheck },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-green-200 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <item.icon className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-500">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {item.value || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Profile Stats & Actions */}
          <div className="space-y-8">
            {/* Profile Completeness Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 animate-slide-in-right">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Profile Status
              </h2>

              <div className="space-y-6">
                {/* Progress Circle */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="#10b981"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${profileCompleteness * 3.77} 377`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl font-bold text-gray-900">
                          {profileCompleteness}%
                        </span>
                        <p className="text-sm text-gray-500">Complete</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Profile Progress</span>
                      <span className="font-medium text-green-600">
                        {profileCompleteness}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-300 rounded-full"
                        style={{ width: `${profileCompleteness}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Status Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Account Status
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user?.status === "active"
                          ? "bg-green-100 text-green-800"
                          : user?.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user?.status || "Not set"}
                    </span>
                  </div>

                  {/* Only show Verification if user is not approved */}
                  {!isApproved && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">
                          Verification
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user?.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {user?.isVerified ? "Verified" : "Pending"}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Approval
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user?.is_approved === "approved"
                          ? "bg-green-100 text-green-800"
                          : user?.is_approved === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {user?.is_approved || "Pending"}
                    </span>
                  </div>

                  {/* Added Current Employment Location */}
                  {user?.currentEmploymentLocation && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">
                          Work Location
                        </span>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 truncate max-w-[120px]">
                        {user.currentEmploymentLocation}
                      </span>
                    </div>
                  )}
                </div>

                <Link to="/dashboard/edit-profile">
                  <Button className="w-full rounded-[6px] bg-green-600 hover:bg-green-700 text-white">
                    <Edit className="w-4 h-4 mr-2" />
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 animate-slide-in-right delay-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-green-600" />
                Quick Actions
              </h2>

              <div className="space-y-3">
                {[
                  ...(!isApproved
                    ? [
                        {
                          icon: ShieldCheck,
                          label: "Verification",
                          link: "/dashboard/verification",
                        },
                      ]
                    : []),
                  {
                    icon: Settings,
                    label: "Reset Password",
                    link: "/dashboard/my-password-update",
                  },
                ].map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.link}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                        <action.icon className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-green-700 transition-colors">
                        {action.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Account Security Card */}
            <div className="bg-green-700 rounded-2xl p-6 text-white animate-slide-in-right delay-200">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5" />
                <h2 className="text-xl font-bold">Account Security</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-100">Last Login</span>
                  <span className="font-medium">
                    {formatDate(user?.updatedAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-green-100">Device</span>
                  <span
                    className="font-medium text-sm truncate max-w-[120px]"
                    title={user?.register_device}
                  >
                    {user?.register_device?.split(" ")[0]}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-green-100">Password</span>
                  <span className="font-medium">••••••••</span>
                </div>

                <Link to="/dashboard/my-password-update">
                  <Button
                    variant="outline"
                    className="w-full mt-4 rounded-[5px] bg-white/10 hover:bg-white/20 text-white border-white/30"
                  >
                    Change Password
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Profile last updated: {formatDate(user?.updatedAt)} •
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
