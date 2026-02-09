// import React, { useCallback } from "react";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   AlertCircle,
//   Eye,
//   EyeOff,
//   CheckCircle2,
//   UserPlus,
//   Building,
//   Briefcase,
//   Mail,
//   Phone,
//   IdCard,
//   Shield,
// } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Link, useNavigate } from "react-router-dom";
// import { useRegisterMutation } from "./redux/features/user/userApi";

// const DEPARTMENTS = [
//   "Administration",
//   "Finance & Accounts",
//   "Human Resources",
//   "Operations",
//   "Planning & Design",
//   "Construction",
//   "Maintenance",
//   "Urban Development",
//   "Research & Development",
//   "IT & Systems",
// ];

// const DESIGNATIONS = [
//   "Director",
//   "Deputy Director",
//   "Senior Manager",
//   "Manager",
//   "Supervisor",
//   "Officer",
//   "Junior Officer",
//   "Support Staff",
//   "Consultant",
//   "Coordinator",
// ];

// const PHONE_REGEX = /^\+?\d{7,15}$/; // International phone number format

// export default function RegisterPage() {
//   const [register, { isLoading }] = useRegisterMutation<any>();
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     middleName: "",
//     email: "",
//     staffId: "",
//     department: "",
//     designation: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     register_source: "web_portal",
//     register_device: navigator.userAgent,
//     role: "staff",
//     ipps: "",
//     gender: "",
//     dateOfBirth: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateInputs = useCallback(() => {
//     const newErrors: { [key: string]: string } = {};

//     // Name validation
//     if (!formData.firstName.trim()) {
//       newErrors.firstName = "First name is required";
//     } else if (formData.firstName.trim().length < 2) {
//       newErrors.name = "First Name must be at least 2 characters long";
//     }

//     if (!formData.lastName.trim()) {
//       newErrors.lastName = "Last name is required";
//     } else if (formData.lastName.trim().length < 2) {
//       newErrors.lastName = "Last Name must be at least 2 characters long";
//     }

//     // Email validation
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Invalid email format";
//     }

//     // Phone validation
//     if (formData.phone && !PHONE_REGEX.test(formData.phone)) {
//       newErrors.phoneNumber = "Invalid phone number format";
//     }

//     // Address validation
//     if (!formData.designation.trim()) {
//       newErrors.address = "Designation is required";
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     }

//     setError(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [formData]);

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!validateInputs()) return;

//   try {
//     const result = await register({
//       ...formData,
//       firstName: formData.firstName.trim(),
//       lastName: formData.lastName.trim(),
//       middleName: formData.middleName.trim(),
//       email: formData.email.toLowerCase().trim(),
//       department: formData.department.trim(),
//       staffId: formData.staffId.trim(),
//       phoneNumber: formData.phone.trim(),
//       role: "staff",
//       register_device: navigator.userAgent,
//       register_source: "web_portal",
//       designation: formData.designation.trim(),
//       password: formData.password,
//       ipps: formData.ipps.trim(),
//       gender: formData.gender,
//       dateOfBirth: formData.dateOfBirth,
//     }).unwrap();

//     if (result?.success) {
//       navigate("/otp-verification", {
//         state: { email: formData.email },
//         replace: true, // Prevent back navigation
//       });
//     }
//   } catch (error: any) {
//     const errorMessage =
//       error?.data?.message || "Registration failed. Please try again.";
//     setError({
//       form:
//         errorMessage === "User already exists"
//           ? "Account already exists. Please sign in."
//           : errorMessage,
//     });
//   }
// };

//   return (
//     <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-white via-green-50 to-emerald-50">
//       {/* Special Designed Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         {/* Geometric Pattern */}
//         <div className="absolute top-0 left-0 w-full h-full">
//           <div
//             className={`absolute top-1/4 -left-8 w-80 h-80 rounded-full bg-gradient-to-r from-green-200/20 to-emerald-200/20 blur-3xl transition-all duration-1000 ${
//               mounted
//                 ? "translate-x-0 opacity-100"
//                 : "-translate-x-20 opacity-0"
//             }`}
//           />
//           <div
//             className={`absolute bottom-1/3 -right-8 w-96 h-96 rounded-full bg-gradient-to-l from-emerald-200/20 to-teal-200/20 blur-3xl transition-all duration-1000 delay-300 ${
//               mounted ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
//             }`}
//           />
//           <div
//             className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-green-100/10 to-emerald-100/10 blur-3xl transition-all duration-1000 delay-500 ${
//               mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"
//             }`}
//           />
//         </div>

//         {/* Floating Grid Pattern */}
//         <div className="absolute inset-0 opacity-5">
//           <div
//             className="absolute inset-0"
//             style={{
//               backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px),
//                              linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
//               backgroundSize: "50px 50px",
//             }}
//           />
//         </div>

//         {/* Floating Icons */}
//         <div
//           className={`absolute top-32 left-12 text-green-300/30 transition-all duration-700 delay-700 ${
//             mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//           }`}
//         >
//           <UserPlus size={48} />
//         </div>
//         <div
//           className={`absolute top-52 right-20 text-emerald-300/30 transition-all duration-700 delay-900 ${
//             mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//           }`}
//         >
//           <Briefcase size={56} />
//         </div>
//         <div
//           className={`absolute bottom-40 left-32 text-teal-300/30 transition-all duration-700 delay-1100 ${
//             mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//           }`}
//         >
//           <Building size={52} />
//         </div>
//         <div
//           className={`absolute bottom-52 right-32 text-green-300/30 transition-all duration-700 delay-1300 ${
//             mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//           }`}
//         >
//           <IdCard size={60} />
//         </div>

//         {/* Animated Gradient Orbs */}
//         <div className="absolute top-16 left-1/3 w-40 h-40 bg-gradient-to-br from-green-400/10 to-teal-400/10 rounded-full animate-pulse" />
//         <div className="absolute bottom-16 right-1/3 w-48 h-48 bg-gradient-to-tr from-emerald-400/10 to-cyan-400/10 rounded-full animate-pulse delay-1000" />
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
//         <div className="w-full max-w-2xl lg:max-w-3xl mx-auto">
//           {/* Header Section */}
//           <div className="text-center mb-8 sm:mb-12">
//             <Link
//               to="/"
//               className="inline-block mb-6 sm:mb-8 transform transition-transform hover:scale-105 active:scale-95"
//             >
//               <div className="flex items-center justify-center gap-3 sm:gap-4">
//                 <div className="relative">
//                   <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg shadow-green-200/50">
//                     FM
//                   </div>
//                   <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full animate-ping" />
//                   <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full" />
//                 </div>
//                 <div className="text-left">
//                   <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-800 bg-clip-text text-transparent">
//                     FMWUD
//                   </h1>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Federal Ministry Staff Portal
//                   </p>
//                   <div className="flex items-center gap-1 mt-0.5">
//                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//                     <span className="text-xs text-green-600 font-medium">
//                       Secure Registration
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </Link>

//             <div className="space-y-3">
//               <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
//                 Join Our Team
//               </h2>
//               <p className="text-base sm:text-lg text-foreground/70 max-w-lg mx-auto">
//                 Complete your profile to access ministry resources and systems
//               </p>
//             </div>
//           </div>

//           {/* Registration Card */}
//           <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100/50 p-6 sm:p-8 lg:p-10 transform transition-all duration-300 hover:shadow-3xl">
//             {error && (
//               <Alert variant="destructive" className="mb-6 animate-in fade-in">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             {success && (
//               <Alert className="mb-6 border-green-300 bg-green-50/90 animate-in slide-in-from-top">
//                 <CheckCircle2 className="h-4 w-4 text-green-600" />
//                 <AlertDescription className="text-green-700">
//                   {success}
//                 </AlertDescription>
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
//               {/* Personal Information Section */}
//               <div className="space-y-4">
//                 <div className="flex items-center gap-2 text-green-700">
//                   <UserPlus className="w-5 h-5" />
//                   <h3 className="font-semibold text-lg">
//                     Personal Information
//                   </h3>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="firstName"
//                       className="block text-sm font-medium text-foreground"
//                     >
//                       First Name
//                     </label>
//                     <div className="relative">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
//                         <UserPlus className="w-4 h-4" />
//                       </div>
//                       <input
//                         id="firstName"
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         placeholder="John"
//                         required
//                         className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200"
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="lastName"
//                       className="block text-sm font-medium text-foreground"
//                     >
//                       Last Name
//                     </label>
//                     <div className="relative">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
//                         <UserPlus className="w-4 h-4" />
//                       </div>
//                       <input
//                         id="lastName"
//                         type="text"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleChange}
//                         placeholder="Doe"
//                         required
//                         className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact Information */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="email"
//                       className="block text-sm font-medium text-foreground"
//                     >
//                       <span className="flex items-center gap-2">
//                         Email Address
//                         <span className="text-xs text-muted-foreground">
//                           (official)
//                         </span>
//                       </span>
//                     </label>
//                     <div className="relative">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
//                         <Mail className="w-4 h-4" />
//                       </div>
//                       <input
//                         id="email"
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="your.email@fmwud.gov.ng"
//                         required
//                         className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200"
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="phone"
//                       className="block text-sm font-medium text-foreground"
//                     >
//                       Phone Number
//                     </label>
//                     <div className="relative">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
//                         <Phone className="w-4 h-4" />
//                       </div>
//                       <input
//                         id="phone"
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         placeholder="+234 (0)..."
//                         required
//                         className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Professional Information Section */}
//               <div className="space-y-4">
//                 <div className="flex items-center gap-2 text-green-700">
//                   <Briefcase className="w-5 h-5" />
//                   <h3 className="font-semibold text-lg">
//                     Professional Information
//                   </h3>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="staffId"
//                       className="block text-sm font-medium text-foreground"
//                     >
//                       Staff ID
//                     </label>
//                     <div className="relative">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
//                         <IdCard className="w-4 h-4" />
//                       </div>
//                       <input
//                         id="staffId"
//                         type="text"
//                         name="staffId"
//                         value={formData.staffId}
//                         onChange={handleChange}
//                         placeholder="FMWUD-2024-0001"
//                         required
//                         className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200"
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="designation"
//                       className="block text-sm font-medium text-foreground"
//                     >
//                       Designation
//                     </label>
//                     <div className="relative">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
//                         <Briefcase className="w-4 h-4" />
//                       </div>
//                       <select
//                         id="designation"
//                         name="designation"
//                         value={formData.designation}
//                         onChange={handleChange}
//                         required
//                         className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-foreground focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 appearance-none"
//                       >
//                         <option value="">Select Designation</option>
//                         {DESIGNATIONS.map((des) => (
//                           <option key={des} value={des}>
//                             {des}
//                           </option>
//                         ))}
//                       </select>
//                       <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M19 9l-7 7-7-7"
//                           />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label
//                     htmlFor="department"
//                     className="block text-sm font-medium text-foreground"
//                   >
//                     Department
//                   </label>
//                   <div className="relative">
//                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
//                       <Building className="w-4 h-4" />
//                     </div>
//                     <select
//                       id="department"
//                       name="department"
//                       value={formData.department}
//                       onChange={handleChange}
//                       required
//                       className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-foreground focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 appearance-none"
//                     >
//                       <option value="">Select Department</option>
//                       {DEPARTMENTS.map((dept) => (
//                         <option key={dept} value={dept}>
//                           {dept}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 9l-7 7-7-7"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Security Section */}
//               <div className="space-y-4">
//                 <div className="flex items-center gap-2 text-green-700">
//                   <Shield className="w-5 h-5" />
//                   <h3 className="font-semibold text-lg">Account Security</h3>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="password"
//                       className="block text-sm font-medium text-foreground"
//                     >
//                       Password
//                     </label>
//                     <div className="relative">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
//                         <Shield className="w-4 h-4" />
//                       </div>
//                       <input
//                         id="password"
//                         type={showPassword ? "text" : "password"}
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         placeholder="Create a strong password"
//                         required
//                         className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-lg transition-all duration-200"
//                         aria-label={
//                           showPassword ? "Hide password" : "Show password"
//                         }
//                       >
//                         {showPassword ? (
//                           <EyeOff className="w-5 h-5" />
//                         ) : (
//                           <Eye className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       Minimum 6 characters
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <label
//                       htmlFor="confirmPassword"
//                       className="block text-sm font-medium text-foreground"
//                     >
//                       Confirm Password
//                     </label>
//                     <div className="relative">
//                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
//                         <Shield className="w-4 h-4" />
//                       </div>
//                       <input
//                         id="confirmPassword"
//                         type={showConfirm ? "text" : "password"}
//                         name="confirmPassword"
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                         placeholder="Re-enter your password"
//                         required
//                         className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirm(!showConfirm)}
//                         className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-lg transition-all duration-200"
//                         aria-label={
//                           showConfirm ? "Hide password" : "Show password"
//                         }
//                       >
//                         {showConfirm ? (
//                           <EyeOff className="w-5 h-5" />
//                         ) : (
//                           <Eye className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       Must match above
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Terms and Conditions */}
//               <div className="space-y-4 pt-4">
//                 <label className="flex items-start gap-3 cursor-pointer group">
//                   <div className="relative flex-shrink-0 mt-0.5">
//                     <input
//                       type="checkbox"
//                       className="w-5 h-5 rounded border-gray-300 checked:bg-green-600 checked:border-green-600 focus:ring-green-500/30 transition-colors peer"
//                       required
//                     />
//                     <CheckCircle2 className="absolute top-0 left-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
//                   </div>
//                   <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">
//                     I agree to the{" "}
//                     <a
//                       href="#"
//                       className="text-green-600 hover:text-green-700 font-medium hover:underline"
//                     >
//                       terms and conditions
//                     </a>{" "}
//                     and{" "}
//                     <a
//                       href="#"
//                       className="text-green-600 hover:text-green-700 font-medium hover:underline"
//                     >
//                       privacy policy
//                     </a>{" "}
//                     of the Federal Ministry of Works and Urban Development
//                   </span>
//                 </label>

//                 {/* Submit Button */}
//                 <Button
//                   type="submit"
//                   size="lg"
//                   className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white text-base font-semibold rounded-xl shadow-lg shadow-green-200/50 hover:shadow-green-300/50 transition-all duration-300 active:scale-[0.98]"
//                 >
//                   <span className="flex items-center justify-center gap-2">
//                     <UserPlus className="w-5 h-5" />
//                     Create Official Account
//                   </span>
//                 </Button>
//               </div>
//             </form>

//             {/* Footer */}
//             <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-100">
//               <div className="text-center space-y-4">
//                 <p className="text-sm text-foreground/70">
//                   Already have an account?{" "}
//                   <Link
//                     to="/login"
//                     className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
//                   >
//                     Login to your account
//                   </Link>
//                 </p>
//                 <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
//                   <Shield className="w-3.5 h-3.5" />
//                   <span>
//                     Your information is secured with 256-bit encryption
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Additional Info */}
//           <div className="mt-6 text-center space-y-2">
//             <p className="text-xs text-muted-foreground">
//               For registration assistance, contact HR Department at{" "}
//               <a
//                 href="mailto:hr@fmwud.gov.ng"
//                 className="text-green-600 hover:underline"
//               >
//                 hr@fmwud.gov.ng
//               </a>
//             </p>
//             <p className="text-xs text-muted-foreground">
//               Federal Ministry of Works and Urban Development • ©{" "}
//               {new Date().getFullYear()} All rights reserved
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Responsive Background Adjustments */}
//       <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
//       <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
//     </div>
//   );
// }




import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  UserPlus,
  Building,
  Briefcase,
  Mail,
  Phone,
  IdCard,
  Shield,
  Loader2,
  Calendar,
  User,
  MapPin,
  FileText,
  Building2,
  Clock,
  Home,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/features/user/userApi";

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

const STATES = [
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

const PHONE_REGEX = /^\+[1-9]\d{1,14}$/; // E.164 format

export default function RegisterPage() {
  const [register, { isLoading }] = useRegisterMutation<any>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    state_of_origin: "",
    Local_of_origin: "",
    email: "",
    register_source: "web_portal",
    register_device: navigator.userAgent,
    user_property: "staff",
    designation: "",
    ipps: "",
    nin: "",
    tin: "",
    nhf: "",
    nhi: "",
    year_of_appointment: "",
    year_of_retirement: "",
    department_or_station: "",
    staffId: "",
    password: "",
    confirmPassword: "",
    role: "staff",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation
    if (formData.phoneNumber && !PHONE_REGEX.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone must be in E.164 format (+2348012345678)";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Staff ID validation
    if (!formData.staffId.trim()) {
      newErrors.staffId = "Staff ID is required";
    }

    // Designation validation
    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    // Department validation
    if (!formData.department_or_station.trim()) {
      newErrors.department_or_station = "Department/Station is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateInputs()) {
      setError("Please fix the errors in the form");
      return;
    }

    try {
      const result = await register({
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        middleName: formData.middleName.trim(),
        state_of_origin: formData.state_of_origin.trim(),
        Local_of_origin: formData.Local_of_origin.trim(),
        email: formData.email.toLowerCase().trim(),
        register_source: "web_portal",
        register_device: navigator.userAgent,
        user_property: "staff",
        designation: formData.designation.trim(),
        ipps: formData.ipps.trim(),
        nin: formData.nin.trim(),
        tin: formData.tin.trim(),
        nhf: formData.nhf.trim(),
        nhi: formData.nhi.trim(),
        year_of_appointment: formData.year_of_appointment.trim(),
        year_of_retirement: formData.year_of_retirement.trim(),
        department_or_station: formData.department_or_station.trim(),
        staffId: formData.staffId.trim(),
        password: formData.password,
        role: "staff",
        phoneNumber: formData.phoneNumber.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address.trim(),
      }).unwrap();

      if (result?.success) {
        navigate("/otp-verification", {
          state: { email: formData.email },
          replace: true, // Prevent back navigation
        });
      }

      if (result?.success) {
        setSuccess("Registration successful! Redirecting to verification...");

        // Store email in sessionStorage for OTP verification
        sessionStorage.setItem("verificationEmail", formData.email);

        // Navigate after showing success message
        setTimeout(() => {
          navigate("/otp-verification", {
            state: { email: formData.email },
            replace: true,
          });
        }, 1500);
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status === 400) {
        errorMessage = "Invalid data submitted. Please check your information.";
      } else if (error?.status === 409) {
        errorMessage = "User already exists. Please sign in.";
      } else if (error?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.status === "FETCH_ERROR") {
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      {/* Special Designed Background Elements */}
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
          <UserPlus size={48} />
        </div>
        <div
          className={`absolute top-52 right-20 text-indigo-300/30 transition-all duration-700 delay-900 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Briefcase size={56} />
        </div>
        <div
          className={`absolute bottom-40 left-32 text-purple-300/30 transition-all duration-700 delay-1100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Building2 size={52} />
        </div>
        <div
          className={`absolute bottom-52 right-32 text-blue-300/30 transition-all duration-700 delay-1300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <IdCard size={60} />
        </div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-16 left-1/3 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full animate-pulse" />
        <div className="absolute bottom-16 right-1/3 w-48 h-48 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 rounded-full animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
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
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl mb-5 font-bold bg-gradient-to-r from-green-700 to-green-800 bg-clip-text text-transparent">
                  Ministry of Urban Development
                </h1>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Staff Registration Portal
              </h2>
              <p className="text-base sm:text-lg text-foreground/70 max-w-lg mx-auto">
                Complete your profile to access ministry resources and systems
              </p>
            </div>
          </div>

          {/* Registration Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100/50 p-6 sm:p-8 lg:p-10 transform transition-all duration-300 hover:shadow-3xl">
            {/* Error/Success Alerts */}
            {error && (
              <Alert variant="destructive" className="mb-6 animate-in fade-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-300 bg-green-50/90 animate-in slide-in-from-top">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-700">
                  <User className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-foreground"
                    >
                      First Name *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        required
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          errors.firstName
                            ? "border-red-300"
                            : "border-gray-200"
                        } bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-xs text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-foreground"
                    >
                      Last Name *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        required
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          errors.lastName ? "border-red-300" : "border-gray-200"
                        } bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200`}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-xs text-red-500">{errors.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="middleName"
                      className="block text-sm font-medium text-foreground"
                    >
                      Middle Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="middleName"
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        placeholder="Middle"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-foreground"
                    >
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-medium text-foreground"
                    >
                      Date of Birth *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        id="dateOfBirth"
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground"
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="staff@urbandevelopment.gov.ng"
                        required
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          errors.email ? "border-red-300" : "border-gray-200"
                        } bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-foreground"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="phoneNumber"
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+2348012345678"
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          errors.phoneNumber
                            ? "border-red-300"
                            : "border-gray-200"
                        } bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200`}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500">
                        {errors.phoneNumber}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      E.164 format required
                    </p>
                  </div>
                </div>
              </div>

              {/* Origin Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-700">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">Origin Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="state_of_origin"
                      className="block text-sm font-medium text-foreground"
                    >
                      State of Origin
                    </label>
                    <select
                      id="state_of_origin"
                      name="state_of_origin"
                      value={formData.state_of_origin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 appearance-none"
                    >
                      <option value="">Select State</option>
                      {STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="Local_of_origin"
                      className="block text-sm font-medium text-foreground"
                    >
                      Local Government Area
                    </label>
                    <input
                      id="Local_of_origin"
                      type="text"
                      name="Local_of_origin"
                      value={formData.Local_of_origin}
                      onChange={handleChange}
                      placeholder="Local Government Area"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-foreground"
                  >
                    Residential Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-muted-foreground">
                      <Home className="w-4 h-4" />
                    </div>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={(e) => handleChange(e as any)}
                      placeholder="Current residential address"
                      rows={2}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-700">
                  <Briefcase className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">
                    Professional Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="staffId"
                      className="block text-sm font-medium text-foreground"
                    >
                      Staff ID *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <IdCard className="w-4 h-4" />
                      </div>
                      <input
                        id="staffId"
                        type="text"
                        name="staffId"
                        value={formData.staffId}
                        onChange={handleChange}
                        placeholder="MUD-2024-0001"
                        required
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          errors.staffId ? "border-red-300" : "border-gray-200"
                        } bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200`}
                      />
                    </div>
                    {errors.staffId && (
                      <p className="text-xs text-red-500">{errors.staffId}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="designation"
                      className="block text-sm font-medium text-foreground"
                    >
                      Designation *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <select
                        id="designation"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        required
                        className={`w-full pl-12 pr-10 py-3 rounded-xl border ${
                          errors.designation
                            ? "border-red-300"
                            : "border-gray-200"
                        } bg-white/80 text-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 appearance-none`}
                      >
                        <option value="">Select Designation</option>
                        {DESIGNATIONS.map((des) => (
                          <option key={des} value={des}>
                            {des}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.designation && (
                      <p className="text-xs text-red-500">
                        {errors.designation}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="department_or_station"
                      className="block text-sm font-medium text-foreground"
                    >
                      Department/Station *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Building className="w-4 h-4" />
                      </div>
                      <select
                        id="department_or_station"
                        name="department_or_station"
                        value={formData.department_or_station}
                        onChange={handleChange}
                        required
                        className={`w-full pl-12 pr-10 py-3 rounded-xl border ${
                          errors.department_or_station
                            ? "border-red-300"
                            : "border-gray-200"
                        } bg-white/80 text-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 appearance-none`}
                      >
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.department_or_station && (
                      <p className="text-xs text-red-500">
                        {errors.department_or_station}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="year_of_appointment"
                      className="block text-sm font-medium text-foreground"
                    >
                      Year of Appointment
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                      </div>
                      <input
                        id="year_of_appointment"
                        type="text"
                        name="year_of_appointment"
                        value={formData.year_of_appointment}
                        onChange={handleChange}
                        placeholder="YYYY"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="year_of_retirement"
                      className="block text-sm font-medium text-foreground"
                    >
                      Year of Retirement
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                      </div>
                      <input
                        id="year_of_retirement"
                        type="text"
                        name="year_of_retirement"
                        value={formData.year_of_retirement}
                        onChange={handleChange}
                        placeholder="YYYY"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Numbers Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-700">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">Official Numbers</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="ipps"
                      className="block text-sm font-medium text-foreground"
                    >
                      IPPS Number
                    </label>
                    <input
                      id="ipps"
                      type="text"
                      name="ipps"
                      value={formData.ipps}
                      onChange={handleChange}
                      placeholder="IPPS Number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="nin"
                      className="block text-sm font-medium text-foreground"
                    >
                      NIN
                    </label>
                    <input
                      id="nin"
                      type="text"
                      name="nin"
                      value={formData.nin}
                      onChange={handleChange}
                      placeholder="National Identification Number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="tin"
                      className="block text-sm font-medium text-foreground"
                    >
                      TIN
                    </label>
                    <input
                      id="tin"
                      type="text"
                      name="tin"
                      value={formData.tin}
                      onChange={handleChange}
                      placeholder="Tax Identification Number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="nhf"
                      className="block text-sm font-medium text-foreground"
                    >
                      NHF Number
                    </label>
                    <input
                      id="nhf"
                      type="text"
                      name="nhf"
                      value={formData.nhf}
                      onChange={handleChange}
                      placeholder="National Housing Fund Number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="nhi"
                      className="block text-sm font-medium text-foreground"
                    >
                      NHI Number
                    </label>
                    <input
                      id="nhi"
                      type="text"
                      name="nhi"
                      value={formData.nhi}
                      onChange={handleChange}
                      placeholder="National Health Insurance Number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-700">
                  <Shield className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">Account Security</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-foreground"
                    >
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Shield className="w-4 h-4" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        required
                        className={`w-full pl-12 pr-12 py-3 rounded-xl border ${
                          errors.password ? "border-red-300" : "border-gray-200"
                        } bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-lg transition-all duration-200"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500">{errors.password}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Minimum 8 characters with uppercase, lowercase, and number
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-foreground"
                    >
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Shield className="w-4 h-4" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        required
                        className={`w-full pl-12 pr-12 py-3 rounded-xl border ${
                          errors.confirmPassword
                            ? "border-red-300"
                            : "border-gray-200"
                        } bg-white/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-lg transition-all duration-200"
                        aria-label={
                          showConfirm ? "Hide password" : "Show password"
                        }
                      >
                        {showConfirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Must match above password
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4 pt-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 checked:bg-blue-600 checked:border-blue-600 focus:ring-blue-500/30 transition-colors peer"
                      required
                    />
                    <CheckCircle2 className="absolute top-0 left-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                    I certify that all information provided is accurate and
                    agree to the{" "}
                    <a
                      href="#"
                      className="text-green-600 hover:text-green-700 font-medium hover:underline"
                    >
                      terms and conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-green-600 hover:text-green-700 font-medium hover:underline"
                    >
                      privacy policy
                    </a>{" "}
                    of the Ministry of Urban Development
                  </span>
                </label>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-base font-semibold rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Registration...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Complete Staff Registration
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-100">
              <div className="text-center space-y-4">
                <p className="text-sm text-foreground/70">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
                  >
                    Login to your account
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5" />
                  <span>
                    All information is encrypted and secured with 256-bit SSL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              For registration assistance, contact HR Department at{" "}
              <a
                href="mailto:hr@urbandevelopment.gov.ng"
                className="text-blue-600 hover:underline"
              >
                hr@urbandevelopment.gov.ng
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              Ministry of Urban Development • © {new Date().getFullYear()} All
              rights reserved
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
