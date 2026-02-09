import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Loader2,
  Save,
  ChevronLeft,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useGetUserQuery } from "@/redux/api/apiSlice";
import { useUpdateUserProfileMutation } from "@/redux/features/user/userApi";

// Constants for dropdowns
const DEPARTMENTS = [
  "Administration",
  "Finance & Accounts",
  "Human Resources",
  "Operations",
  "Planning & Design",
  "Construction",
  "Maintenance",
  "Urban Development",
  "Research & Development",
  "IT & Systems",
];

const DESIGNATIONS = [
  "Director",
  "Deputy Director",
  "Senior Manager",
  "Manager",
  "Supervisor",
  "Officer",
  "Junior Officer",
  "Support Staff",
  "Consultant",
  "Coordinator",
];

const WORK_LOCATIONS = [
  "Headquarters - Abuja",
  "Lagos Regional Office",
  "Port Harcourt Office",
  "Kano Regional Office",
  "Enugu Regional Office",
  "Ibadan Office",
  "Kaduna Office",
  "Maiduguri Office",
  "Owerri Office",
  "Calabar Office",
  "Field Operation",
  "Remote Work",
];

interface ProfileFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  state_of_origin: string;
  Local_of_origin: string;
  designation: string;
  department_or_station: string;
  currentEmploymentLocation: string;
  ipps: string;
  nin: string;
  tin: string;
  nhf: string;
  nhi: string;
  year_of_appointment: string;
  year_of_retirement: string;
  currentEmploymentStatus: string;
}

export default function UpdateUserProfile() {
  const navigate = useNavigate();
  const {
    data: userData,
    isLoading: loadingProfile,
    refetch,
  } = useGetUserQuery();
  const [updateProfile, { isLoading: updating }] =
    useUpdateUserProfileMutation();

  const user = userData?.user;
  const isApproved = user?.is_approved === "approved";
  const canEditPersonalInfo = !isApproved;

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    middleName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    state_of_origin: "",
    Local_of_origin: "",
    designation: "",
    department_or_station: "",
    currentEmploymentLocation: "",
    ipps: "",
    nin: "",
    tin: "",
    nhf: "",
    nhi: "",
    year_of_appointment: "",
    year_of_retirement: "",
    currentEmploymentStatus: "alive",
  });

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        middleName: user.middleName || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        address: user.address || "",
        state_of_origin: user.state_of_origin || "",
        Local_of_origin: user.Local_of_origin || "",
        designation: user.designation || "",
        department_or_station: user.department_or_station || "",
        currentEmploymentLocation: user.currentEmploymentLocation || "",
        ipps: user.ipps || "",
        nin: user.nin || "",
        tin: user.tin || "",
        nhf: user.nhf || "",
        nhi: user.nhi || "",
        year_of_appointment: user.year_of_appointment || "",
        year_of_retirement: user.year_of_retirement || "",
        currentEmploymentStatus: user.currentEmploymentStatus || "alive",
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
        <DashboardHeader title="Edit Profile" />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #187339 2px, transparent 2px),
                              radial-gradient(circle at 75% 75%, #187339 2px, transparent 2px)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-green-100/10 to-emerald-100/5 rounded-full blur-3xl animate-float-shape-1"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-tr from-green-200/5 to-emerald-200/3 rounded-full blur-3xl animate-float-shape-2"></div>
      </div>

      <DashboardHeader title="Edit Profile" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6 animate-fade-in-down">
          <Button
            onClick={goBack}
            variant="outline"
            className="group border-green-200 bg-white/80 hover:bg-green-50 hover:border-green-300 text-green-700 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow"
          >
            <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-down">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <User className="h-8 w-8 text-green-600" />
              Update Profile
              {isApproved && (
                <span className="ml-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4" />
                  Approved by Admin
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-2">
              Update your personal and professional information
              {!canEditPersonalInfo && (
                <span className="ml-2 text-amber-600 font-medium">
                  (Personal details are locked after admin approval)
                </span>
              )}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Personal Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information Card */}
              <Card className="border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-gradient-to-r rounded-t-2xl from-green-50 to-emerald-50 border-b">
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <User className="h-5 w-5 text-green-600" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details
                    {!canEditPersonalInfo && (
                      <span className="text-amber-600 ml-2">
                        (Read-only after approval)
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700"
                      >
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          className={`w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500 ${
                            !canEditPersonalInfo ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                          placeholder="Enter first name"
                          disabled={!canEditPersonalInfo}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          className={`w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500 ${
                            !canEditPersonalInfo ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                          placeholder="Enter last name"
                          disabled={!canEditPersonalInfo}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="middleName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Middle Name
                      </Label>
                      <Input
                        id="middleName"
                        value={formData.middleName}
                        onChange={(e) =>
                          handleInputChange("middleName", e.target.value)
                        }
                        className={`w-full h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500 ${
                          !canEditPersonalInfo ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                        placeholder="Enter middle name"
                        disabled={!canEditPersonalInfo}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="gender"
                        className="text-sm font-medium text-gray-700"
                      >
                        Gender
                      </Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          handleInputChange("gender", value)
                        }
                        disabled={!canEditPersonalInfo}
                      >
                        <SelectTrigger className={`h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500 ${
                          !canEditPersonalInfo ? "opacity-60 cursor-not-allowed" : ""
                        }`}>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-2xl focus:ring-3 focus:ring-green-500/30 focus:border-green-500">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className={`space-y-3 transition-all duration-300 ${
                      !canEditPersonalInfo ? "opacity-40" : ""
                    }`}>
                      <Label
                        htmlFor="dateOfBirth"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        Date of Birth
                        {!canEditPersonalInfo && (
                          <ShieldCheck className="h-3 w-3 text-green-600" />
                        )}
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            handleInputChange("dateOfBirth", e.target.value)
                          }
                          className={`w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500 ${
                            !canEditPersonalInfo ? "cursor-not-allowed" : ""
                          }`}
                          disabled={!canEditPersonalInfo}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="phoneNumber"
                        className="text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            handleInputChange("phoneNumber", e.target.value)
                          }
                          className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500"
                          placeholder="+2348012345678"
                        />
                      </div>
                    </div>

                    <div className={`space-y-3 transition-all duration-300 ${
                      !canEditPersonalInfo ? "opacity-40" : ""
                    }`}>
                      <Label
                        htmlFor="state_of_origin"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        State of Origin
                        {!canEditPersonalInfo && (
                          <ShieldCheck className="h-3 w-3 text-green-600" />
                        )}
                      </Label>
                      <Select
                        value={formData.state_of_origin}
                        onValueChange={(value) =>
                          handleInputChange("state_of_origin", value)
                        }
                        disabled={!canEditPersonalInfo}
                      >
                        <SelectTrigger className={`h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500 ${
                          !canEditPersonalInfo ? "cursor-not-allowed" : ""
                        }`}>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-2xl focus:ring-3 focus:ring-green-500/30 focus:border-green-500">
                          {nigerianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className={`space-y-3 transition-all duration-300 ${
                      !canEditPersonalInfo ? "opacity-40" : ""
                    }`}>
                      <Label
                        htmlFor="Local_of_origin"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        Local Government Area
                        {!canEditPersonalInfo && (
                          <ShieldCheck className="h-3 w-3 text-green-600" />
                        )}
                      </Label>
                      <Input
                        id="Local_of_origin"
                        value={formData.Local_of_origin}
                        onChange={(e) =>
                          handleInputChange("Local_of_origin", e.target.value)
                        }
                        className={`w-full h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500 ${
                          !canEditPersonalInfo ? "cursor-not-allowed" : ""
                        }`}
                        placeholder="Enter LGA"
                        disabled={!canEditPersonalInfo}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="address"
                      className="text-sm font-medium text-gray-700"
                    >
                      Address
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="w-full pl-10 min-h-[100px] rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500"
                        placeholder="Enter your full address"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information Card */}
              <Card className="border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-gradient-to-r rounded-t-2xl from-green-50 to-emerald-50 border-b">
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-green-600" />
                    Professional Information
                  </CardTitle>
                  <CardDescription>
                    Update your work-related details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="designation"
                        className="text-sm font-medium text-gray-700"
                      >
                        Designation
                      </Label>
                      <Select
                        value={formData.designation}
                        onValueChange={(value) =>
                          handleInputChange("designation", value)
                        }
                      >
                        <SelectTrigger className="h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500">
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-2xl focus:ring-3 focus:ring-green-500/30 focus:border-green-500">
                          {DESIGNATIONS.map((designation) => (
                            <SelectItem key={designation} value={designation}>
                              {designation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="department_or_station"
                        className="text-sm font-medium text-gray-700"
                      >
                        Department/Station
                      </Label>
                      <Select
                        value={formData.department_or_station}
                        onValueChange={(value) =>
                          handleInputChange("department_or_station", value)
                        }
                      >
                        <SelectTrigger className="h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-2xl focus:ring-3 focus:ring-green-500/30 focus:border-green-500">
                          {DEPARTMENTS.map((department) => (
                            <SelectItem key={department} value={department}>
                              {department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="currentEmploymentLocation"
                        className="text-sm font-medium text-gray-700"
                      >
                        Current Work Location
                      </Label>
                      <Select
                        value={formData.currentEmploymentLocation}
                        onValueChange={(value) =>
                          handleInputChange("currentEmploymentLocation", value)
                        }
                      >
                        <SelectTrigger className="h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500">
                          <SelectValue placeholder="Select work location" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-2xl focus:ring-3 focus:ring-green-500/30 focus:border-green-500">
                          {WORK_LOCATIONS.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="ipps"
                        className="text-sm font-medium text-gray-700"
                      >
                        IPPS Number
                      </Label>
                      <Input
                        id="ipps"
                        value={formData.ipps}
                        onChange={(e) =>
                          handleInputChange("ipps", e.target.value)
                        }
                        className="w-full h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500"
                        placeholder="Enter IPPS number"
                      />
                    </div>

                    <div className={`space-y-3 transition-all duration-300 ${
                      !canEditPersonalInfo ? "opacity-40" : ""
                    }`}>
                      <Label
                        htmlFor="nin"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        NIN
                        {!canEditPersonalInfo && (
                          <ShieldCheck className="h-3 w-3 text-green-600" />
                        )}
                      </Label>
                      <Input
                        id="nin"
                        value={formData.nin}
                        onChange={(e) =>
                          handleInputChange("nin", e.target.value)
                        }
                        className={`w-full h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500 ${
                          !canEditPersonalInfo ? "cursor-not-allowed" : ""
                        }`}
                        placeholder="Enter NIN"
                        disabled={!canEditPersonalInfo}
                      />
                    </div>

                    <div className={`space-y-3 transition-all duration-300 ${
                      !canEditPersonalInfo ? "opacity-40" : ""
                    }`}>
                      <Label
                        htmlFor="tin"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        TIN
                        {!canEditPersonalInfo && (
                          <ShieldCheck className="h-3 w-3 text-green-600" />
                        )}
                      </Label>
                      <Input
                        id="tin"
                        value={formData.tin}
                        onChange={(e) =>
                          handleInputChange("tin", e.target.value)
                        }
                        className={`w-full h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500 ${
                          !canEditPersonalInfo ? "cursor-not-allowed" : ""
                        }`}
                        placeholder="Enter TIN"
                        disabled={!canEditPersonalInfo}
                      />
                    </div>

                    <div className={`space-y-3 transition-all duration-300 ${
                      !canEditPersonalInfo ? "opacity-40" : ""
                    }`}>
                      <Label
                        htmlFor="nhf"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        NHF Number
                        {!canEditPersonalInfo && (
                          <ShieldCheck className="h-3 w-3 text-green-600" />
                        )}
                      </Label>
                      <Input
                        id="nhf"
                        value={formData.nhf}
                        onChange={(e) =>
                          handleInputChange("nhf", e.target.value)
                        }
                        className={`w-full h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500 ${
                          !canEditPersonalInfo ? "cursor-not-allowed" : ""
                        }`}
                        placeholder="Enter NHF number"
                        disabled={!canEditPersonalInfo}
                      />
                    </div>

                    <div className={`space-y-3 transition-all duration-300 ${
                      !canEditPersonalInfo ? "opacity-40" : ""
                    }`}>
                      <Label
                        htmlFor="nhi"
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        NHIS Number
                        {!canEditPersonalInfo && (
                          <ShieldCheck className="h-3 w-3 text-green-600" />
                        )}
                      </Label>
                      <Input
                        id="nhi"
                        value={formData.nhi}
                        onChange={(e) =>
                          handleInputChange("nhi", e.target.value)
                        }
                        className={`w-full h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500 ${
                          !canEditPersonalInfo ? "cursor-not-allowed" : ""
                        }`}
                        placeholder="Enter NHIS number"
                        disabled={!canEditPersonalInfo}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="year_of_appointment"
                        className="text-sm font-medium text-gray-700"
                      >
                        Year of Appointment
                      </Label>
                      <Input
                        id="year_of_appointment"
                        type="text"
                        value={formData.year_of_appointment}
                        onChange={(e) =>
                          handleInputChange("year_of_appointment", e.target.value)
                        }
                        className="w-full h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500"
                        placeholder="YYYY"
                        maxLength={4}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="year_of_retirement"
                        className="text-sm font-medium text-gray-700"
                      >
                        Year of Retirement
                      </Label>
                      <Input
                        id="year_of_retirement"
                        type="text"
                        value={formData.year_of_retirement}
                        onChange={(e) =>
                          handleInputChange("year_of_retirement", e.target.value)
                        }
                        className="w-full h-11 rounded-xl border border-gray-200 bg-white/80 focus:ring-3 focus:ring-green-500/30 focus:border-green-500"
                        placeholder="YYYY"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Actions & Info */}
            <div className="space-y-8">
              {/* Action Card */}
              <Card className="border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-gradient-to-r rounded-t-2xl from-green-50 to-emerald-50 border-b">
                  <CardTitle className="text-xl font-bold text-gray-800">
                    Save Changes
                  </CardTitle>
                  <CardDescription>
                    Review and save your profile updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>All changes are saved locally first</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Changes require admin approval</span>
                    </div>
                    {canEditPersonalInfo ? (
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <ShieldAlert className="h-4 w-4" />
                        <span>Personal info can be edited now</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Profile approved by admin</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={updating}
                    className="w-full bg-green-600 hover:bg-green-700 h-12 rounded-xl font-medium text-white hover:shadow-lg transition-all duration-200"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save All Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Read-only Info Card */}
              {user && (
                <Card className="border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r rounded-t-2xl from-gray-50 to-gray-100 border-b">
                    <CardTitle className="text-xl font-bold text-gray-800">
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-500">
                          Email
                        </Label>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500">
                          Staff ID
                        </Label>
                        <div className="text-sm font-medium text-gray-700">
                          {user.staffId || "Not assigned"}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500">
                          Current Employment Status
                        </Label>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            user.currentEmploymentStatus === 'alive' ? 'bg-green-500' : 
                            user.currentEmploymentStatus === 'retired' ? 'bg-blue-500' :
                            user.currentEmploymentStatus === 'deceased' ? 'bg-red-500' :
                            user.currentEmploymentStatus === 'suspended' ? 'bg-yellow-500' :
                            user.currentEmploymentStatus === 'terminated' ? 'bg-red-600' : 'bg-gray-500'
                          }`} />
                          <span className="text-sm font-medium capitalize text-gray-700">
                            {user.currentEmploymentStatus || 'Not specified'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500">
                          Account Status
                        </Label>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              user.status === "active"
                                ? "bg-green-500"
                                : user.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span className="text-sm font-medium capitalize text-gray-700">
                            {user.status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-500">
                          Approval Status
                        </Label>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              user.is_approved === "approved"
                                ? "bg-green-500"
                                : user.is_approved === "pending"
                                ? "bg-yellow-500"
                                : user.is_approved === "rejected"
                                ? "bg-red-500"
                                : "bg-gray-500"
                            }`}
                          />
                          <span className="text-sm font-medium capitalize text-gray-700">
                            {user.is_approved}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            <span className="text-green-600 font-medium">
              Ministry of Urban Development
            </span>
            <span className="mx-2">•</span>
            All information is protected and secured
          </p>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}