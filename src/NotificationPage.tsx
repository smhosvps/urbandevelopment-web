import React, { useState, useRef, useEffect } from "react";
import {
  Trash2,
  CheckCircle,
  Circle,
  Bell,
  MoreVertical,
  Eye,
  Delete,
  RefreshCw,
  X,
  AlertCircle,
  Check,
  Loader2,
  Shield,
  Filter,
} from "lucide-react";
import {
  useDeleteBulkNotificationsMutation,
  useDeleteNotificationMutation,
  useGetCurrentUserNotificationsQuery,
  useUpdateNotificationMutation,
} from "@/redux/features/notificationsApi/notificationsApi";
import { useGetUserQuery } from "@/redux/api/apiSlice";
import { DashboardHeader } from "./components/DashboardHeader";

const NotificationPage: React.FC = () => {
  const { data: apiResponse } = useGetUserQuery();
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [showMenu, setShowMenu] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = apiResponse?.user;

  // RTK Query hooks
  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
  } = useGetCurrentUserNotificationsQuery(user?._id || "", {
    skip: !user?._id,
  });

  const [updateNotification] = useUpdateNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteBulkNotifications] = useDeleteBulkNotificationsMutation();

  const notifications = notificationsData?.notifications || [];

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notification: any) => {
    if (filter === "all") return true;
    if (filter === "unread") return notification.status === "unread";
    if (filter === "read") return notification.status === "read";
    return true;
  });

  const handleNotificationSelect = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id)
        ? prev.filter((notificationId) => notificationId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n: any) => n._id));
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateNotification(id).unwrap();
      setSnackbar({
        open: true,
        message: "Notification marked as read",
        type: "success",
      });
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to mark as read",
        type: "error",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = filteredNotifications.filter(
        (n: any) => n.status === "unread"
      );
      for (const notification of unreadNotifications) {
        await updateNotification(notification._id);
      }
      setSnackbar({
        open: true,
        message: "All notifications marked as read",
        type: "success",
      });
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to mark all as read",
        type: "error",
      });
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id).unwrap();
      setSelectedNotifications((prev) =>
        prev.filter((notificationId) => notificationId !== id)
      );
      setSnackbar({
        open: true,
        message: "Notification deleted",
        type: "success",
      });
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete notification",
        type: "error",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) return;

    try {
      await deleteBulkNotifications({ ids: selectedNotifications }).unwrap();
      setSelectedNotifications([]);
      setSnackbar({
        open: true,
        message: `${selectedNotifications.length} notifications deleted`,
        type: "success",
      });
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete notifications",
        type: "error",
      });
    }
  };

  const unreadCount = notifications.filter(
    (n: any) => n.status === "unread"
  ).length;
  const filteredUnreadCount = filteredNotifications.filter(
    (n: any) => n.status === "unread"
  ).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-close snackbar after 4 seconds
  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar({ ...snackbar, open: false });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/20 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            Failed to load notifications
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Please check your connection and try again.
          </p>
          <button
            onClick={() => refetch()}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
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

      <DashboardHeader title="Notifications" />

      {/* Header */}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Notification Center
                  </h1>
                  <p className="text-gray-600">
                    {notifications.length} total • {unreadCount} unread •{" "}
                    {filteredNotifications.length} showing
                  </p>
                </div>
              </div>

              {/* Mobile User Info */}
              {user && mobileMenuOpen && (
                <div className="lg:hidden flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="px-3 py-1.5 bg-green-100 text-sm font-medium rounded-full flex items-center gap-2 text-green-700">
                    <Shield className="w-4 h-4" />
                    {user.role === "admin" ? "Admin" : "Member"}
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Filter Buttons - Mobile Optimized */}
                <div className="w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Filter className="w-4 h-4" />
                      <span>Filter:</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-[6px] p-1">
                      <button
                        onClick={() => setFilter("all")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-[5px] transition-colors whitespace-nowrap ${
                          filter === "all"
                            ? "bg-green-600 text-white"
                            : "text-gray-700 hover:text-green-700"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilter("unread")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-[5px] transition-colors whitespace-nowrap ${
                          filter === "unread"
                            ? "bg-green-600 text-white"
                            : "text-gray-700 hover:text-green-700"
                        }`}
                      >
                        Unread ({unreadCount})
                      </button>
                      <button
                        onClick={() => setFilter("read")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-[5px] transition-colors whitespace-nowrap ${
                          filter === "read"
                            ? "bg-green-600 text-white"
                            : "text-gray-700 hover:text-green-700"
                        }`}
                      >
                        Read
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  {selectedNotifications.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-medium rounded-[5px] transition duration-200 border border-red-200 whitespace-nowrap"
                    >
                      <Delete className="h-4 w-4" />
                      Delete ({selectedNotifications.length})
                    </button>
                  )}

                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={filteredUnreadCount === 0}
                    className={`flex items-center gap-2 px-4 py-2.5 font-medium rounded-[5px] transition duration-200 border whitespace-nowrap ${
                      filteredUnreadCount === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-green-600 hover:bg-green-700 text-white border-transparent"
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                    Mark All as Read
                  </button>

                  {/* Menu Button */}
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition duration-200 border border-gray-300"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="p-2">
                          <div className="text-xs font-medium text-gray-500 px-3 py-2">
                            Quick Actions
                          </div>

                          <button
                            onClick={() => {
                              handleSelectAll();
                              setShowMenu(false);
                            }}
                            disabled={filteredNotifications.length === 0}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-[6px] hover:bg-gray-50 ${
                              filteredNotifications.length === 0
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700"
                            }`}
                          >
                            <Check className="h-4 w-4" />
                            Select All Showing
                          </button>

                          <button
                            onClick={() => {
                              setSelectedNotifications([]);
                              setShowMenu(false);
                            }}
                            disabled={selectedNotifications.length === 0}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-md hover:bg-gray-50 ${
                              selectedNotifications.length === 0
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700"
                            }`}
                          >
                            <X className="h-4 w-4" />
                            Clear Selection
                          </button>

                          <div className="border-t border-gray-200 my-2"></div>

                          <button
                            onClick={() => {
                              handleMarkAllAsRead();
                              setShowMenu(false);
                            }}
                            disabled={filteredUnreadCount === 0}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-[6px] hover:bg-gray-50 ${
                              filteredUnreadCount === 0
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700"
                            }`}
                          >
                            <Eye className="h-4 w-4" />
                            Mark All as Read
                          </button>

                          <div className="border-t border-gray-200 my-2"></div>

                          <button
                            onClick={() => {
                              setSelectedNotifications(
                                notifications.map((n: any) => n._id)
                              );
                              handleBulkDelete();
                              setShowMenu(false);
                            }}
                            disabled={notifications.length === 0}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-md hover:bg-gray-50 ${
                              notifications.length === 0
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600"
                            }`}
                          >
                            <Delete className="h-4 w-4" />
                            Delete All Notifications
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk Selection Controls */}
            {filteredNotifications.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        selectedNotifications.length ===
                        filteredNotifications.length
                      }
                      onChange={handleSelectAll}
                      className="h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500 focus:ring-offset-0"
                    />
                    <span className="ml-2 text-gray-700">
                      {selectedNotifications.length ===
                      filteredNotifications.length
                        ? "Deselect All"
                        : "Select All Showing"}
                    </span>
                  </label>

                  {selectedNotifications.length > 0 && (
                    <>
                      <span className="text-gray-600">
                        {selectedNotifications.length} selected
                      </span>
                      <button
                        onClick={() => setSelectedNotifications([])}
                        className="ml-auto flex items-center gap-1 text-sm text-gray-500 hover:text-green-600"
                      >
                        <X className="h-4 w-4" />
                        Clear Selection
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16 bg-white">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-500">
                  {filter === "all"
                    ? "You're all caught up! New notifications will appear here."
                    : `No ${filter} notifications found.`}
                </p>
                {filter !== "all" && (
                  <button
                    onClick={() => setFilter("all")}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-[5px] transition-colors"
                  >
                    Show All Notifications
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification: any) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50/50 transition duration-200 ${
                      notification.status === "unread" ? "bg-green-50" : ""
                    } ${
                      selectedNotifications.includes(notification._id)
                        ? "bg-green-50 border-l-4 border-green-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(
                            notification._id
                          )}
                          onChange={() =>
                            handleNotificationSelect(notification._id)
                          }
                          className="h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500 focus:ring-offset-0"
                        />
                      </div>

                      {/* Status Icon */}
                      <div className="pt-1">
                        {notification.status === "unread" ? (
                          <Circle className="h-5 w-5 text-green-600 fill-current" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            {notification.type && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {notification.type}
                              </span>
                            )}
                            {notification.status === "unread" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                Unread
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 whitespace-nowrap mt-1 sm:mt-0">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">
                          {notification.message}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          {notification.status === "unread" && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-[6px] transition duration-200 border border-green-200"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Mark as Read
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleDeleteNotification(notification._id)
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-[6px] transition duration-200 border border-red-200"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          {filteredNotifications.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-[6px] border border-gray-300 transition duration-200 shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Notifications
              </button>
            </div>
          )}
        </div>
      </div>

      

      {/* Snackbar Notification */}
      {snackbar.open && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
          <div
            className={`rounded-lg shadow-lg p-4 max-w-md border ${
              snackbar.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {snackbar.type === "success" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <p className="font-medium">{snackbar.message}</p>
              </div>
              <button
                onClick={() => setSnackbar({ ...snackbar, open: false })}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

     
    </div>
           {/* Recent Activity Footer */}
        <div className="my-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Last updated: {formatDate(user?.updatedAt)} •
            <span className="text-green-600 font-medium ml-2">
              Ministry of Urban Development
            </span>
          </p>
        </div>
    </>
  );
};

export default NotificationPage;
