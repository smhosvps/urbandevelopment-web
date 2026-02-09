import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Lock,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  ChevronLeft,
} from "lucide-react";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import { useGetUserQuery, useLogoutMutation } from "@/redux/api/apiSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { clearCredentials } from "@/redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function UpdatePassword() {
  const { data: user } = useGetUserQuery();
  const [updatePassword, { isLoading: loading, isSuccess: success }] =
    useUpdatePasswordMutation();
  const [logout, { isLoading: loadingLogout }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const id = user?.user?._id;

  // Password validation
  const validatePassword = useCallback((password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const strength = Object.values(checks).filter(Boolean).length;
    setPasswordChecks(checks);
    setPasswordStrength(strength);

    return checks;
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate("/");
      toast.info("Please log in again with your new password");
      window.location.reload();
    } catch (err) {
      console.error("Failed to log out:", err);
      toast.error("Failed to log out automatically");
    }
  }, [logout, dispatch, navigate]);

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.currentPassword.trim()) {
      return toast.error("Please enter your current password");
    }
    if (!formData.newPassword.trim()) {
      return toast.error("Please enter your new password");
    }
    if (!formData.confirmPassword.trim()) {
      return toast.error("Please confirm your new password");
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords don't match");
    }
    if (formData.currentPassword === formData.newPassword) {
      return toast.error(
        "New password must be different from current password"
      );
    }
    if (passwordStrength < 3) {
      return toast.error(
        "Password is too weak. Please follow the password requirements"
      );
    }

    try {
      await updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        id,
      }).unwrap();
    } catch (error: any) {
      // Error is handled by the useEffect below
      console.error("Password update failed:", error);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "newPassword") {
      validatePassword(value);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const clearForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordStrength(0);
    setPasswordChecks({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (success) {
      toast.success("Password updated successfully! Logging you out...", {
        autoClose: 3000,
      });

      // Wait a moment before logging out
      const timer = setTimeout(() => {
        handleLogout();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success, handleLogout]);

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

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-orange-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    if (passwordStrength <= 4) return "bg-green-500";
    return "bg-emerald-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
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

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button - Positioned above the form */}
        <div className="mb-6 animate-fade-in-down hidden md:block">
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

        {/* Page Header with Back Button for Mobile */}
        <div className="flex items-center justify-between mb-6 animate-fade-in-down">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Lock className="h-6 w-6 text-green-600" />
              Update Password
            </h1>
            <p className="text-gray-600 mt-1">
              Change your password to keep your account secure. You'll be logged
              out automatically after updating.
            </p>
          </div>

          {/* Desktop Back Button */}
          <Button
            onClick={goBack}
            variant="ghost"
            size="sm"
            className="block md:hidden group border border-green-200 hover:bg-green-50 text-green-700 hover:text-green-800 rounded-lg font-medium transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
        </div>

        <form onSubmit={handleSubmitPassword}>
          <Card className="shadow-[10px] border-gray-200 rounded-2xl animate-in">
            <CardHeader className="bg-gradient-to-r rounded-t-2xl from-green-50 to-green-50 border-b">
              <div className="flex items-center gap-3">
                {/* Mobile Back Button Inside Card */}
                <Button
                  onClick={goBack}
                  variant="ghost"
                  size="sm"
                  className="md:hidden -ml-2 group border border-green-200 hover:bg-green-50 text-green-700 hover:text-green-800 rounded-lg font-medium transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                </Button>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    Update Password
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    You'll be automatically logged out after updating your
                    password
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Current Password */}
              <div className="space-y-3">
                <Label
                  htmlFor="current-password"
                  className="text-sm font-medium text-gray-700"
                >
                  Current Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="current-password"
                    type={showPassword.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) =>
                      handleInputChange("currentPassword", e.target.value)
                    }
                    className="w-full pl-10 pr-10 h-11 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your current password"
                    disabled={loading || loadingLogout}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPassword.current ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-3">
                <Label
                  htmlFor="new-password"
                  className="text-sm font-medium text-gray-700"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="new-password"
                    type={showPassword.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                    className="w-full pl-10 pr-10 h-11 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    placeholder="Create a strong new password"
                    disabled={loading || loadingLogout}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPassword.new ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Password strength:</span>
                      <span
                        className={`font-medium ${
                          passwordStrength <= 2
                            ? "text-red-600"
                            : passwordStrength <= 3
                            ? "text-orange-600"
                            : passwordStrength <= 4
                            ? "text-green-600"
                            : "text-emerald-700"
                        }`}
                      >
                        {passwordStrength <= 2
                          ? "Weak"
                          : passwordStrength <= 3
                          ? "Fair"
                          : passwordStrength <= 4
                          ? "Good"
                          : "Strong"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Password requirements:
                  </p>
                  {Object.entries(passwordChecks).map(([key, isValid]) => (
                    <div key={key} className="flex items-center gap-2">
                      {isValid ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-gray-300" />
                      )}
                      <span
                        className={`text-xs ${
                          isValid ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {key === "length" && "At least 8 characters"}
                        {key === "uppercase" && "One uppercase letter (A-Z)"}
                        {key === "lowercase" && "One lowercase letter (a-z)"}
                        {key === "number" && "One number (0-9)"}
                        {key === "special" &&
                          "One special character (!@#$%^&*)"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-3">
                <Label
                  htmlFor="confirm-password"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type={showPassword.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="w-full pl-10 pr-10 h-11 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    placeholder="Confirm your new password"
                    disabled={loading || loadingLogout}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword &&
                  formData.newPassword !== formData.confirmPassword && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" />
                      Passwords don't match
                    </p>
                  )}
                {formData.confirmPassword &&
                  formData.newPassword === formData.confirmPassword && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Passwords match
                    </p>
                  )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between border-t bg-gray-50/50 pt-6">
              <div className="text-sm text-gray-500">
                <p className="flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5" />
                  You'll be automatically logged out after password change
                </p>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearForm}
                  className="flex-1 sm:flex-none rounded-[5px] font-medium border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 hover:text-green-800 transition-all duration-200"
                  disabled={loading || loadingLogout}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none rounded-[5px] font-medium text-white hover:shadow-lg transition-all duration-200"
                  disabled={
                    loading ||
                    loadingLogout ||
                    passwordStrength < 3 ||
                    formData.newPassword !== formData.confirmPassword
                  }
                >
                  {loading || loadingLogout ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {loading ? "Updating..." : "Logging out..."}
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>

        {/* Security Tips */}
        <div className="mt-6">
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 rounded-2xl animate-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Security Tips
                </h3>
                <Button
                  onClick={goBack}
                  variant="ghost"
                  size="sm"
                  className="md:hidden text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <ChevronLeft className="h-3 w-3 mr-1" />
                  Back
                </Button>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>
                    Use a unique password that you don't use on other websites
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>
                    Consider using a password manager to generate and store
                    secure passwords
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>
                    Change your password regularly for better security
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Never share your password with anyone</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity Footer */}
      <div className="my-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Last updated: {formatDate(user?.user?.updatedAt)} •
          <span className="text-green-600 font-medium ml-2">
            Ministry of Urban Development
          </span>
          {user?.user?.register_source && (
            <span className="text-gray-400 text-xs ml-4">
              • Registered via: {user?.user?.register_source}
            </span>
          )}
        </p>
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
