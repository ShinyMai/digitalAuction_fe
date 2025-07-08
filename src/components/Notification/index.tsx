/* eslint-disable @typescript-eslint/no-explicit-any */
// components/NotificationDropdown.tsx
import { BellOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotiServices from "../../services/NotificationServices";
import { Spin } from "antd";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);

  const getListNotifications = async () => {
    try {
      setLoading(true);
      const res = await NotiServices.getListNotifications({
        pageIndex,
        pageSize: 5,
      });
      setNotifications(res?.data?.notifications || []);
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        onClick={() => setOpen((prev) => !prev)}
      >
        <BellOutlined style={{ fontSize: "1.4rem" }} />
      </div>

      <ul
        className={`absolute left-1/2 transform -translate-x-1/2 mt-3 z-30 ${
          open ? "flex" : "hidden"
        } lg:group-hover:flex flex-col w-72 bg-white border border-sky-200 shadow-xl rounded-xl overflow-hidden transition-all duration-200 ease-out`}
      >
        <li className="px-4 py-3 font-semibold text-sky-600 border-b border-gray-100">
          Thông báo mới
        </li>
        <Spin spinning={loading}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li
                key={notification.id}
                className="px-4 py-3 text-sm hover:bg-sky-50 cursor-pointer"
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
