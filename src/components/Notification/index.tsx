/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BellOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import NotiServices from "../../services/NotificationServices";
import connection from "../../signalRConnection";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [hasNewNotification, setHasNewNotification] =
    useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);

  const getListNotifications = async () => {
    try {
      setLoading(true);
      const res = await NotiServices.getListNotifications({
        pageIndex,
        pageSize: 5,
      });
      if (res?.code === 200) {
        setNotifications(res?.data?.notifications || []);
      }
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const hasUnread = async () => {
    try {
      setLoading(true);
      const res = await NotiServices.hasUnread();
      if (res?.code === 200) {
        setHasNewNotification(
          res?.data?.hasUnread || false
        );
      }
    } catch (error) {
      console.error(
        "Failed to check unread notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // Hàm kết nối và lắng nghe sự kiện từ SignalR
  useEffect(() => {
    const startConnection = async () => {
      try {
        if (connection.state === "Connected") {
          console.log("SignalR already connected");
          return;
        }

        if (connection.state === "Connecting") {
          console.log("SignalR is already connecting...");
          return;
        }
        console.log("Starting SignalR connection...");
        await connection.start();
        console.log("SignalR connected successfully");

        const userId = user?.id;
        await connection.invoke("JoinGroup", userId);
        console.log(
          `Joined SignalR group with userId: ${userId}`
        );
      } catch (err) {
        console.error("SignalR connection error:", err);
        setTimeout(startConnection, 5000);
      }
    };

    connection.on(
      "ReceiveNotification",
      (message: object) => {
        console.log(
          "New notification received from SignalR:",
          message
        );
        toast.success(`🔔 Bạn có một thông báo mới`);
        setHasNewNotification(true);
      }
    );

    connection.onreconnecting((error) => {
      console.log("SignalR reconnecting...", error);
    });

    connection.onreconnected((connectionId) => {
      console.log(
        "SignalR reconnected with ID:",
        connectionId
      );
    });

    connection.onclose((error) => {
      console.log("SignalR connection closed:", error);
      setTimeout(startConnection, 3000);
    });

    startConnection();

    return () => {
      connection.off("ReceiveNotification");
    };
  }, []);

  useEffect(() => {
    getListNotifications();
    hasUnread();
  }, [pageIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !(ref.current as any).contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div ref={ref} className="relative group">
      <div
        className="w-9 h-9 rounded-full bg-sky-100 border-2 border-sky-500 flex items-center justify-center cursor-pointer"
        onClick={() => {
          setOpen((prev) => !prev);
          setHasNewNotification(false);
        }}
      >
        <BellOutlined style={{ fontSize: "1.4rem" }} />
        {hasNewNotification && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              backgroundColor: "red",
              borderRadius: "50%",
              width: 10,
              height: 10,
            }}
          />
        )}
      </div>
      <ul
        className={`absolute left-1/2 transform -translate-x-1/2 mt-3 z-30 ${
          open ? "flex" : "hidden"
        } lg:group-hover:flex flex-col w-72 bg-white border border-sky-200 shadow-xl rounded-xl overflow-hidden transition-all duration-200 ease-out`}
      >
        <li className="px-4 py-3 font-bold text-[16px] text-sky-600 border-b border-gray-100">
          Thông báo mới
        </li>
        <Spin spinning={loading}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li
                key={notification.id}
                className={`px-4 py-3 text-sm cursor-pointer ${
                  notification.isRead
                    ? "bg-white text-gray-500"
                    : "bg-sky-100 text-sky-700"
                } hover:bg-sky-100`}
                onClick={() => {
                  setOpen(false);
                  navigate(
                    `/notifications/${notification.id}`
                  );
                }}
              >
                {notification.message}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-gray-500">
              Không có thông báo mới.
            </li>
          )}
        </Spin>

        <li className="border-t border-gray-100">
          <div
            onClick={() => {
              setOpen(false);
              setPageIndex(pageIndex + 1);
            }}
            className="text-center px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer"
          >
            Xem tất cả thông báo
          </div>
        </li>
      </ul>
    </div>
  );
};

export default NotificationDropdown;
