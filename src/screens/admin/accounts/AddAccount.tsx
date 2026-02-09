import {
  useAddUserMutation,
  useGetAllUsersQuery,
} from "@/redux/features/user/userApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {};

export default function AddAccount({}: Props) {
  const { refetch } = useGetAllUsersQuery({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    role: "",
  });
  const [addUser, { isLoading, isSuccess, error }] = useAddUserMutation();

  const validateForm = () => {
    // Check required fields
    if (!formData.role || formData.role === "Select Role") {
      toast.error("Please select a role");
      return false;
    }
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    // Validate phone number format
    // const phoneRegex = /^\d{14}$/;
    // if (!phoneRegex.test(formData.phoneNumber)) {
    //   toast.error("Phone number must be 14 digits");
    //   return false;
    // }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await addUser(formData).unwrap();
      setFormData({
        lastName: "",
        firstName: "",
        email: "",
        password: "",
        role: "",
        address: "",
        phoneNumber: "",
      });
    } catch (err) {
      console.log("Error adding user");
    }
  };

  // Check form validity for button state
  const isFormValid = 
    formData.role && 
    formData.role !== "Select Role" &&
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.password.trim() !== "" &&
    formData.phoneNumber.trim() !== "" &&
    formData.address.trim() !== "";

  useEffect(() => {
    if (isSuccess) {
      toast.success("User successfully added.");
      navigate("/dashboard/accounts");
      refetch();
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  return (
    <div className="p-6 container mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Create Admin Account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account Type
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Select Role">Select Role</option>
            <option value="user">User</option>
            <option value="Finance">Finance</option>
            <option value="Follow Up">Follow Up</option>
            <option value="Store">Store</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact
          </label>
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-red-400 font-semibold mt-1">Enter phone in this format +234 8************ </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading || !isFormValid 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isLoading ? "Adding..." : "Add User"}
          </button>
        </div>
      </form>
    </div>
  );
}
