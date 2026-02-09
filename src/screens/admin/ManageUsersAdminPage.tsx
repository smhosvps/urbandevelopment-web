import React, { useState, useEffect, useMemo } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  RefreshCw,
  Download,
  Shield,
  UserCheck,
  UserX,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  Undo2,
} from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useDeleteUserFcmMutation,
  useGetAllUsersFcmQuery,
  useRestoreUserFcmMutation, // Add this import
} from "@/redux/features/user/userApi";

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
    deleted: { bg: "bg-red-100", text: "text-red-800", label: "Deleted" },
    "pending-deletion": {
      bg: "bg-orange-100",
      text: "text-orange-800",
      label: "Pending Deletion",
    },
  };

  const { bg, text, label } = config[status] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    label: status,
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

// Approval badge component
const ApprovalBadge = ({ status }: { status: string }) => {
  const config: Record<
    string,
    { bg: string; text: string; icon: React.ReactNode }
  > = {
    approved: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: <UserCheck className="w-3 h-3 mr-1" />,
    },
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: <AlertCircle className="w-3 h-3 mr-1" />,
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: <UserX className="w-3 h-3 mr-1" />,
    },
  };

  const { bg, text, icon } = config[status] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    icon: null,
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${bg} ${text}`}
    >
      {icon}
      {status}
    </span>
  );
};

export default function ManageUsersAdminPage() {
  // State for all users data
  const [allUsers, setAllUsers] = useState([]);
  // State for filters and pagination
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    role: "all",
    status: "all",
    is_approved: "all",
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: string | null;
    userName?: string;
  }>({
    open: false,
    userId: null,
    userName: "",
  });

  const [restoreDialog, setRestoreDialog] = useState<{
    open: boolean;
    userId: string | null;
    userName?: string;
  }>({
    open: false,
    userId: null,
    userName: "",
  });

  // Fetch all users (no pagination filters in the API call)
  const { data, isLoading, isError, refetch } = useGetAllUsersFcmQuery({});
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserFcmMutation();
  const [restoreUser, { isLoading: isRestoring }] = useRestoreUserFcmMutation(); // Add restore mutation

  // Set all users when data is fetched
  useEffect(() => {
    if (data) {
      setAllUsers(data);
    }
  }, [data]);

  // Filter and paginate users on the frontend
  const { filteredUsers, totalPages, totalFilteredUsers } = useMemo(() => {
    if (!allUsers || allUsers.length === 0) {
      return { filteredUsers: [], totalPages: 0, totalFilteredUsers: 0 };
    }

    // Apply filters
    let filtered = [...allUsers];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchLower) ||
          user.lastName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.staffId?.toLowerCase().includes(searchLower)
      );
    }

    // Role filter
    if (filters.role !== "all") {
      filtered = filtered.filter((user) => user.role === filters.role);
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((user) => user.status === filters.status);
    }

    // Approval filter
    if (filters.is_approved !== "all") {
      filtered = filtered.filter(
        (user) => user.is_approved === filters.is_approved
      );
    }

    const totalFiltered = filtered.length;
    const totalPages = Math.ceil(totalFiltered / filters.limit);

    // Apply pagination
    const startIndex = (filters.page - 1) * filters.limit;
    const endIndex = startIndex + filters.limit;
    const paginatedUsers = filtered.slice(startIndex, endIndex);

    return {
      filteredUsers: paginatedUsers,
      totalPages,
      totalFilteredUsers: totalFiltered,
    };
  }, [allUsers, filters]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : (value as number), // Reset to page 1 when changing filters
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by useMemo, no need to refetch
  };

  const handleDelete = async () => {
    if (!deleteDialog.userId) return;

    try {
      await deleteUser(deleteDialog.userId).unwrap();
      toast.success("User deleted successfully");
      setDeleteDialog({ open: false, userId: null, userName: "" });
      refetch(); // Refetch to get updated user list
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  const handleRestore = async () => {
    if (!restoreDialog.userId) return;

    try {
      await restoreUser(restoreDialog.userId).unwrap();
      toast.success("User restored successfully");
      setRestoreDialog({ open: false, userId: null, userName: "" });
      refetch(); // Refetch to get updated user list
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to restore user");
    }
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      role: "all",
      status: "all",
      is_approved: "all",
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const exportToCSV = () => {
    const headers = [
      "S/N",
      "Full Name",
      "Email",
      "Staff ID",
      "Role",
      "Designation",
      "Department",
      "Status",
      "Approval",
      "Join Date",
    ];

    const csvData = allUsers.map((user, index) => [
      index + 1,
      `${user.firstName} ${user.lastName}`,
      user.email,
      user.staffId,
      user.role,
      user.designation,
      user.department_or_station,
      user.status,
      user.is_approved,
      formatDate(user.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Calculate stats
  const activeUsersCount = useMemo(
    () => allUsers.filter((u) => u.status === "active").length,
    [allUsers]
  );

  const pendingApprovalCount = useMemo(
    () => allUsers.filter((u) => u.is_approved === "pending").length,
    [allUsers]
  );

  const adminUsersCount = useMemo(
    () =>
      allUsers.filter((u) => ["admin", "Super Admin"].includes(u.role)).length,
    [allUsers]
  );

  const deletedUsersCount = useMemo(
    () => allUsers.filter((u) => u.status === "deleted").length,
    [allUsers]
  );

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
        {/* Enhanced Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Geometric Pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #187339 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, #187339 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>

          {/* Animated Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/5 via-green-300/3 to-teal-200/4 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tr from-green-300/4 via-emerald-200/3 to-teal-300/5 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-teal-200/3 to-emerald-300/2 rounded-full blur-3xl animate-pulse-slow"></div>

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(90deg, transparent 95%, #10b981 100%),
                              linear-gradient(180deg, transparent 95%, #10b981 100%)`,
                backgroundSize: "30px 30px",
                animation: "gridMove 20s linear infinite",
              }}
            ></div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-green-400/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `floatParticle ${
                    15 + Math.random() * 15
                  }s infinite ease-in-out ${Math.random() * 5}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Light Beams */}
          <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-transparent via-green-400/10 to-transparent transform -translate-x-1/2 animate-beam"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/10 to-transparent animate-beam-horizontal"></div>
        </div>
        <DashboardHeader title="Admin Dashboard" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to load users
            </h3>
            <p className="text-gray-600 mb-4">
              Please check your connection and try again.
            </p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20">
        {/* Enhanced Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Geometric Pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #187339 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, #187339 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>

          {/* Animated Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/5 via-green-300/3 to-teal-200/4 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tr from-green-300/4 via-emerald-200/3 to-teal-300/5 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-teal-200/3 to-emerald-300/2 rounded-full blur-3xl animate-pulse-slow"></div>

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(90deg, transparent 95%, #10b981 100%),
                              linear-gradient(180deg, transparent 95%, #10b981 100%)`,
                backgroundSize: "30px 30px",
                animation: "gridMove 20s linear infinite",
              }}
            ></div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-green-400/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `floatParticle ${
                    15 + Math.random() * 15
                  }s infinite ease-in-out ${Math.random() * 5}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Light Beams */}
          <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-transparent via-green-400/10 to-transparent transform -translate-x-1/2 animate-beam"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/10 to-transparent animate-beam-horizontal"></div>
        </div>
        <DashboardHeader title="Admin Dashboard" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Shield className="h-8 w-8 text-green-600" />
                  User Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage all users, their roles, and account status
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  className="border-green-300 text-green-500 hover:bg-green-50 rounded-[5px] hover:text-green-600 "
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                {/* <Button className="bg-green-600 hover:bg-green-700 rounded-[5px] text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button> */}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {allUsers.length || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {activeUsersCount}
                    </p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pending Approval</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {pendingApprovalCount}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Admins</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {adminUsersCount}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Deleted Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {deletedUsersCount}
                    </p>
                  </div>
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative border">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by name, email, or staff ID..."
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      className="pl-10 border-green-600 focus:ring-green-600 focus:border-green-600 rounded-[5px]"
                    />
                  </div>
                </div>

                {/* Role Filter */}
                <div>
                  <Select
                    value={filters.role}
                    onValueChange={(value) => handleFilterChange("role", value)}
                  >
                    <SelectTrigger className="bg-white text-gray-700 ring-1 ring-green-600 rounded-[5px] border border-green-600">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-700 ring-1 ring-green-600 rounded-2xl">
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      handleFilterChange("status", value)
                    }
                  >
                    <SelectTrigger className="bg-white text-gray-700 ring-1 ring-green-600 rounded-[5px] border border-green-600">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-700 ring-1 ring-green-600 rounded-2xl">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="deleted">Deleted</SelectItem>
                      <SelectItem value="pending-deletion">
                        Pending Deletion
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Approval Filter */}
                <div>
                  <Select
                    value={filters.is_approved}
                    onValueChange={(value) =>
                      handleFilterChange("is_approved", value)
                    }
                  >
                    <SelectTrigger className="bg-white text-gray-700 ring-1 ring-green-600 rounded-[5px] border border-green-600">
                      <SelectValue placeholder="Approval Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-700 ring-1 ring-green-600 rounded-2xl">
                      <SelectItem value="all">All Approval</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending Approval</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span>
                    Showing {(filters.page - 1) * filters.limit + 1}-
                    {Math.min(filters.page * filters.limit, totalFilteredUsers)}{" "}
                    of {totalFilteredUsers} users
                    {totalFilteredUsers !== allUsers.length && (
                      <span className="text-gray-400 ml-1">
                        (filtered from {allUsers.length} total users)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetFilters}
                    className="border-gray-300 text-gray-500 hover:bg-gray-50 rounded-[5px] hover:text-green-600 "
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Filters
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 rounded-[5px] text-white"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : (
              <>
                <Table className=" bg-white">
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold">S/N</TableHead>
                      <TableHead className="font-semibold">User</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">
                        Designation
                      </TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Approval</TableHead>
                      <TableHead className="font-semibold">Joined</TableHead>
                      <TableHead className="font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-12 text-gray-500"
                        >
                          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium">No users found</p>
                          <p className="text-sm">
                            Try adjusting your filters or search terms
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <TableRow
                          key={user._id}
                          className="hover:bg-gray-50/50"
                        >
                          <TableCell className="font-medium">
                            {(filters.page - 1) * filters.limit + index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {user.avatar?.url ? (
                                <img
                                  src={user.avatar.url}
                                  alt={user.firstName}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-green-700 font-medium">
                                  {user.firstName?.[0]}
                                  {user.lastName?.[0]}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === "Super Admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : user.role === "admin"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {user.designation || "N/A"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {user.department_or_station || "N/A"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={user.status} />
                          </TableCell>
                          <TableCell>
                            <ApprovalBadge status={user.is_approved} />
                          </TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex justify-end">
                              <Link
                                to={`/admin/users/${user._id}`}
                                className="cursor-pointer"
                              >
                                <Button variant="ghost" size="sm" className="">
                                  <Eye className="w-4 h-4 mr-2" />
                                </Button>
                              </Link>

                              {user.status !== "deleted" ? (
                                <Button
                                  onClick={() =>
                                    setDeleteDialog({
                                      open: true,
                                      userId: user._id,
                                      userName: `${user.firstName} ${user.lastName}`,
                                    })
                                  }
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                </Button>
                              ) : (
                                <Button
                                  onClick={() =>
                                    setRestoreDialog({
                                      open: true,
                                      userId: user._id,
                                      userName: `${user.firstName} ${user.lastName}`,
                                    })
                                  }
                                  className="text-green-600"
                                >
                                  <Undo2 className="w-4 h-4 mr-2" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t px-6 py-4">
                    <div className="text-sm text-gray-700">
                      Page {filters.page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleFilterChange("page", filters.page - 1)
                        }
                        disabled={filters.page === 1}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleFilterChange("page", filters.page + 1)
                        }
                        disabled={filters.page === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        >
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User Account</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Are you sure you want to delete{" "}
                <strong>{deleteDialog.userName}</strong>'s account? This action
                will mark the user as deleted and they will no longer be able to
                access the system. This action can be reversed by restoring the
                user from the deleted users list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="border border-gray-400 rounded-[5px] hover:rounded-[10px] hover:text-green-600 hover:border-green-600"
                disabled={isDeleting}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 rounded-[5px] hover:rounded-[10px] text-white"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete User"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Restore Confirmation Dialog */}
        <AlertDialog
          open={restoreDialog.open}
          onOpenChange={(open) => setRestoreDialog({ ...restoreDialog, open })}
        >
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Restore User Account</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Are you sure you want to restore{" "}
                <strong>{restoreDialog.userName}</strong>'s account? This action
                will change the user status back to active and they will regain
                access to the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="border border-gray-400 rounded-[5px] hover:rounded-[10px] hover:text-green-600 hover:border-green-600"
                disabled={isRestoring}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRestore}
                disabled={isRestoring}
                className="bg-green-600 hover:bg-green-700 rounded-[5px] hover:rounded-[10px] text-white"
              >
                {isRestoring ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <Undo2 className="w-4 h-4 mr-2" />
                    Restore User
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {/* Recent Activity Footer */}
      <div className="my-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          <span className="text-green-600 font-medium ml-2">
            Ministry of Urban Development
          </span>
        </p>
      </div>
    </>
  );
}
