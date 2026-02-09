import React, { useState, useRef } from "react";
import { Bell, AlertCircle, CheckCircle, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetUserQuery } from "@/redux/api/apiSlice";
import { useGetCurrentUserNotificationsQuery } from "@/redux/features/notificationsApi/notificationsApi";

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: apiResponse } = useGetUserQuery();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = apiResponse?.user;

  const { data } = useGetCurrentUserNotificationsQuery(user?._id || "", {
    skip: !user?._id,
    pollingInterval: 60000,
  });

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter(
    (n: any) => n.status === "unread"
  ).length;

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getNotificationIcon = (type?: string, status?: string) => {
    if (status === "unread") {
      return <AlertCircle className="h-5 w-5 text-green-400 flex-shrink-0" />;
    }
    
    switch (type?.toLowerCase()) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />;
      default:
        return <Bell className="h-5 w-5 text-green-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/10 rounded-[50px] transition-all duration-300 group"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5 text-green-600 group-hover:text-green-400 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-green-500/20">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute -right-14 md:-right-24 mt-3 w-80 sm:w-96 bg-white backdrop-blur-xl border border-green-200/50 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-5 fade-in duration-200">
          {/* Header */}
          <div className="p-4 border-b border-green-200/50 bg-gradient-to-r from--100/80 to-emerald-100/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-[50px]">
                  <Bell className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4 text-gray-600 hover:text-green-600" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-red/50 rounded-[50px] flex items-center justify-center">
                  <Bell className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
                </div>
                <p className="text-gray-700 font-medium mb-1 text-sm sm:text-base">No notifications yet</p>
                <p className="text-gray-500 text-xs sm:text-sm">We'll notify you when something arrives</p>
              </div>
            ) : (
              <div className="divide-y divide-green-100/50 bg-white">
                {notifications.slice(0, 8).map((notification: any) => (
                  <div
                    key={notification._id}
                    className={`p-3 sm:p-4 bg-white hover:bg-white/70 transition-colors cursor-pointer ${
                      notification.status === "unread" 
                        ? "bg-white border-l-4 border-l-green-500 hover:bg-green-100" 
                        : ""
                    }`}
                    onClick={() => {
                      // Handle notification click
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type, notification.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 sm:mt-3">
                          <div className="flex items-center flex-wrap gap-1.5">
                            {notification.status === "unread" && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full whitespace-nowrap">
                                New
                              </span>
                            )}
                            {notification.type && (
                              <span className="px-2 py-0.5 bg-white/80 text-gray-600 text-xs font-medium rounded-full whitespace-nowrap">
                                {notification.type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 sm:p-4 border-t border-green-200/50 bg-gradient-to-r from-green-100/60 to-emerald-100/60">
              <Link
                to="/dashboard/notifications"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 hover:bg-white border border-green-300/50 hover:border-green-500/50 text-gray-900 font-medium rounded-[6px] transition-all duration-300 text-sm sm:text-base"
              >
                <span>View all notifications</span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.4);
        }
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;