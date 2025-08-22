/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BellOutlined,
  FireOutlined,
  ClockCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import NotiServices from "../../services/NotificationServices";
import connection from "../../signalRConnection";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);

  const getListNotifications = async () => {
    try {
      setLoading(true);
      const res = await NotiServices.getListNotifications({
        pageIndex: 1,
        pageSize: 5,
      });
      if (res?.code === 200) {
        setNotifications(res?.data?.notifications || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasUnread = async () => {
    try {
      setLoading(true);
      const res = await NotiServices.hasUnread();
      if (res?.code === 200) {
        setHasNewNotification(res?.data?.hasUnread || false);
      }
    } catch (error) {
      console.error("Failed to check unread notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm kết nối và lắng nghe sự kiện từ SignalR
  useEffect(() => {
    const startConnection = async () => {
      try {
        if (connection.state !== "Disconnected") return;

        console.log("Starting SignalR connection...");
        await connection.start();
        console.log("SignalR connected successfully");

        if (user?.id) {
          await connection.invoke("JoinGroup", user.id);
          console.log(`Joined SignalR group with userId: ${user.id}`);
        }
      } catch (err) {
        console.error("SignalR connection error:", err);
        setTimeout(startConnection, 5000);
      }
    };

    const handleNotification = (message: object) => {
      console.log("New notification received from SignalR:", message);
      toast.success(`🔔 Bạn có một thông báo mới`);
      setHasNewNotification(true);
    };

    connection.off("ReceiveNotification"); // đảm bảo không bị duplicate
    connection.on("ReceiveNotification", handleNotification);

    connection.onreconnecting((error) => {
      console.log("SignalR reconnecting...", error);
    });

    connection.onreconnected((connectionId) => {
      console.log("SignalR reconnected with ID:", connectionId);
    });

    startConnection();

    return () => {
      if (user?.id) {
        connection.invoke("LeaveGroup", user.id).catch(() => {});
      }
      connection.off("ReceiveNotification", handleNotification);
    };
  }, [user?.id]);

  useEffect(() => {
    getListNotifications();
    hasUnread();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !(ref.current as any).contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - notificationDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "auction":
        return <FireOutlined className="text-orange-500" />;
      case "payment":
        return <BellOutlined className="text-green-500" />;
      case "system":
        return <MessageOutlined className="text-blue-500" />;
      default:
        return <BellOutlined className="text-gray-500" />;
    }
  };

  return (
    <div ref={ref} className="relative group">
      <div
        className="relative w-10 h-10 rounded-full bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg group-hover:shadow-xl"
        onClick={() => {
          setOpen((prev) => !prev);
          setHasNewNotification(false);
        }}
      >
        <BellOutlined className="text-lg text-white" />

        {hasNewNotification && (
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-400 rounded-full animate-ping opacity-75"></div>
          </div>
        )}

        <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div
        className={`absolute right-0 mt-3 z-50 ${
          open ? "block" : "hidden"
        } w-80 bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 transform ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <BellOutlined className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Thông báo</h3>
                <p className="text-blue-100 text-xs">Cập nhật mới nhất</p>
              </div>
            </div>
            {hasNewNotification && (
              <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-medium">Mới</span>
              </div>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          <Spin spinning={loading}>
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group p-4 cursor-pointer transition-all duration-300 hover:bg-blue-50 relative overflow-hidden ${
                      !notification.isRead
                        ? "bg-gradient-to-r from-blue-50/50 to-purple-50/50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setOpen(false);
                      navigate(`/notifications/${notification.id}`);
                    }}
                  >
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative flex items-start gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p
                            className={`text-sm leading-relaxed ${
                              !notification.isRead
                                ? "font-semibold text-gray-900"
                                : "text-gray-700"
                            } line-clamp-2`}
                          >
                            {notification.message}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                          )}
                        </div>

                        {/* Time and category */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <ClockCircleOutlined />
                            <span>
                              {formatTimeAgo(
                                notification.createdAt ||
                                  new Date().toISOString()
                              )}
                            </span>
                          </div>
                          {notification.category && (
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                              {notification.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BellOutlined className="text-2xl text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Chưa có thông báo
                </h4>
                <p className="text-sm text-gray-500">
                  Bạn sẽ nhận được thông báo khi có cập nhật mới
                </p>
              </div>
            )}
          </Spin>
        </div>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default NotificationDropdown;
