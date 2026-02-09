import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Shield, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useActivationMutation,
  useResendOtpMutation,
} from "@/redux/features/user/userApi";
import { toast } from "react-toastify";

export default function OTPVerificationScreen() {
  const [activation, { isLoading: isActivationLoading }] =
    useActivationMutation();
  const [resendOtp, { isLoading: isResendLoading }] = useResendOtpMutation();
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const location = useLocation();
  const navigate = useNavigate();
  const storedEmail = location.state?.email;
  const [email, setEmail] = useState(storedEmail);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    setMounted(true);
    if (!storedEmail) {
      navigate("/login");
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown > 0 ? prevCountdown - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < 4) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 5) {
      setError("Please enter a valid 5-digit OTP");
      return;
    }
    setError("");
    try {
      const result = await activation({ otp: otpString, email }).unwrap();
      if (result?.success) {
        setSuccess("Account verified successfully! Redirecting to login...");
        toast.success("Account verified successfully!");
        
        // Navigate after showing success message
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Verification failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    try {
      await resendOtp({ email }).unwrap();
      setCountdown(60);
      setSuccess("");
      setError("");
      toast.success("OTP resent successfully! Check your email.");
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to resend OTP. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      {/* Exact background from RegisterPage */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric Pattern */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div
            className={`absolute top-1/4 -left-8 w-80 h-80 rounded-full bg-gradient-to-r from-blue-200/20 to-indigo-200/20 blur-3xl transition-all duration-1000 ${
              mounted
                ? "translate-x-0 opacity-100"
                : "-translate-x-20 opacity-0"
            }`}
          />
          <div
            className={`absolute bottom-1/3 -right-8 w-96 h-96 rounded-full bg-gradient-to-l from-indigo-200/20 to-purple-200/20 blur-3xl transition-all duration-1000 delay-300 ${
              mounted ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
            }`}
          />
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-100/10 to-indigo-100/10 blur-3xl transition-all duration-1000 delay-500 ${
              mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          />
        </div>

        {/* Floating Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px),
                             linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Floating Icons */}
        <div
          className={`absolute top-32 left-12 text-blue-300/30 transition-all duration-700 delay-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Shield size={48} />
        </div>
        <div
          className={`absolute top-52 right-20 text-indigo-300/30 transition-all duration-700 delay-900 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Mail size={56} />
        </div>
        <div
          className={`absolute bottom-40 left-32 text-purple-300/30 transition-all duration-700 delay-1100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <CheckCircle2 size={52} />
        </div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-16 left-1/3 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full animate-pulse" />
        <div className="absolute bottom-16 right-1/3 w-48 h-48 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 rounded-full animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          {/* Header Section */}
     {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
              <div className="relative">
                <Link
                  to="/"
                  className="inline-block mb- transform transition-transform"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Coat_of_arms_of_Nigeria.svg"
                    alt="MUD Logo"
                    className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg shadow-blue-200/50"
                  />
                </Link>
                {/* <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full animate-ping" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full" /> */}
              </div>
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl mb-5 font-bold bg-gradient-to-r from-green-700 to-green-800 bg-clip-text text-transparent">
                  Ministry of Urban Development
                </h1>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-base sm:text-lg text-foreground/70 max-w-lg mx-auto">
                   Staff Account Verification
              </p>
            </div>

            
            <div className="space-y-3">
              <p className="text-base sm:text-lg text-foreground/70">
                Enter the 5-digit code sent to your email
              </p>
            </div>
          </div>

          {/* Verification Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100/50 p-6 sm:p-8 transform transition-all duration-300 hover:shadow-3xl">
            {/* Email Display */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Mail className="w-5 h-5" />
                <p className="font-medium truncate">{email}</p>
              </div>
            </div>

            {/* Error/Success Alerts */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in">
                <p className="text-red-700 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-in fade-in">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="font-medium">{success}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Inputs */}
              <div className="space-y-4">
                <div className="text-center">
                  <label className="block text-sm font-medium text-foreground mb-4">
                    5-Digit Verification Code
                  </label>
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <div key={index} className="relative">
                        <Input
                          ref={inputRefs[index]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-16 h-16 text-center text-2xl font-bold focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 border-2"
                          aria-label={`Digit ${index + 1}`}
                        />
                        {index < otp.length - 1 && (
                          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gray-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Code expires in{" "}
                    <span className="font-semibold text-blue-600">
                      {countdown} seconds
                    </span>
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isActivationLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-base font-semibold rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isActivationLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5" />
                    Verify Account
                  </span>
                )}
              </Button>
            </form>

            {/* Resend OTP Section */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-center space-y-4">
                <p className="text-sm text-foreground/70">
                  Didn't receive the code?{" "}
                  <button
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isResendLoading}
                    className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {isResendLoading ? (
                      <span className="flex items-center justify-center gap-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Resending...
                      </span>
                    ) : countdown > 0 ? (
                      `Resend in ${countdown}s`
                    ) : (
                      "Resend OTP"
                    )}
                  </button>
                </p>
                
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Verification secures your account access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm hover:underline transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Registration
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Check your spam folder if you don't see the email
            </p>
            <p className="text-xs text-muted-foreground">
              Ministry of Urban Development • © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Background Adjustments */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
    </div>
  );
}