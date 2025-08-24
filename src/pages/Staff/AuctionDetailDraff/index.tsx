/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Modal, Select, Form } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import AuctionServices from "../../../services/AuctionServices";
import AuctionDetail from "./components/AuctionDetail";
import UpdateAuction from "./components/UpdateAuction";
import type { AuctionDataDetail } from "../Modals";
import { STAFF_ROUTES } from "../../../routers";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AuthServices from "../../../services/AuthServices";

const AuctionDetailAnonymous = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const auctionId = state?.key;
  const auctionType = state?.type;
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.roleName;
  const [auctionDetailData, setAuctionDetailData] =
    useState<AuctionDataDetail>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [listManager, setListManager] = useState<
    { managerId: string; managerName: string }[]
  >([]);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(
    null
  );
  const [form] = Form.useForm();

  useEffect(() => {
    if (auctionId) {
      fetchAuctionDetail(auctionId);
      onGetListManager();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId]);

  const fetchAuctionDetail = async (id: string) => {
    try {
      const { data } =
        auctionType === "NODE"
          ? await AuctionServices.getAuctionDetailNode(id)
          : await AuctionServices.getAuctionDetail(id);
      setAuctionDetailData(data);
    } catch (error) {
      console.error("Error fetching auction detail:", error);
      toast.error("Không thể tải thông tin phiên đấu giá!");
    }
  };
  const onGetListManager = async () => {
    try {
      const params = {
        RoleId: 6,
        PageNumber: 1,
        PageSize: 1000,
      };
      const response = await AuthServices.getListAccount(params);
      if (response.code === 200) {
        const valResponse = response.data.employeeAccounts.map(
          (manager: any) => ({
            managerId: manager.userId,
            managerName: manager.name,
          })
        );
        setListManager(valResponse);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching list of managers:", error);
      toast.error("Không thể tải danh sách quản lý!");
    }
  };

  const handleGoBack = () => {
    navigate(`/${role.toLowerCase()}/${STAFF_ROUTES.SUB.AUCTION_LIST_DRAFF}`);
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleUpdateSuccess = async () => {
    setIsEditMode(false);
    // Refresh data sau khi update thành công
    if (auctionId) {
      try {
        await fetchAuctionDetail(auctionId);
        toast.success("Dữ liệu đã được cập nhật và tải lại thành công!");
      } catch {
        toast.error("Cập nhật thành công nhưng không thể tải lại dữ liệu!");
      }
    }
  };

  const handleSendToManager = () => {
    setShowManagerModal(true);
  };

  const handleConfirmSendToManager = async () => {
    if (!selectedManagerId) {
      toast.error("Vui lòng chọn quản lý!");
      return;
    }

    try {
      const response = await AuctionServices.waitingPublicAuction({
        auctionId: auctionId,
        managerInCharge: selectedManagerId,
      });
      if (response.code === 200) {
        toast.success(response.message);
        setShowManagerModal(false);
        setSelectedManagerId(null);
        form.resetFields();
        navigate(
          `/${role.toLowerCase()}/${
            STAFF_ROUTES.SUB.AUCTION_LIST_WAITING_PUBLIC
          }`,
          { replace: true }
        );
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error sending auction to manager:", error);
      toast.error("Có lỗi xảy ra khi gửi cho quản lý!");
    }
  };

  const handleCancelManagerModal = () => {
    setShowManagerModal(false);
    setSelectedManagerId(null);
    form.resetFields();
  };

  return (
    <section className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full animate-float delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full animate-float delay-3000"></div>
      </div>

      <div className="w-full mx-auto rounded-xl relative z-10">
        {/* Enhanced Button Group */}
        <div className="mb-6 p-4 bg-white/70 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
            {/* Back Button */}
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleGoBack}
              className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white text-gray-700 hover:text-gray-900 font-medium min-w-[120px]"
              size="large"
            >
              Quay lại
            </Button>

            {/* Action Buttons Group */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                icon={<SendOutlined />}
                onClick={handleSendToManager}
                disabled={isEditMode}
                className={`${
                  isEditMode
                    ? "bg-gray-300 border-0 text-gray-500 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 border-0 hover:from-emerald-600 hover:to-teal-600 text-white"
                } shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium min-w-[160px] group`}
                size="large"
              >
                <span className="ml-1">Gửi cho quản lý</span>
              </Button>

              <Button
                type={isEditMode ? "default" : "primary"}
                icon={<EditOutlined />}
                onClick={handleEditToggle}
                className={`${
                  isEditMode
                    ? "bg-gradient-to-r from-slate-500 to-gray-500 border-0 text-white hover:from-slate-600 hover:to-gray-600"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 border-0 hover:from-blue-600 hover:to-indigo-600 text-white"
                } shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium min-w-[140px] group`}
                size="large"
              >
                <span className="ml-1">
                  {isEditMode ? "Xem chi tiết" : "Chỉnh sửa"}
                </span>
              </Button>
            </div>
          </div>
        </div>

        <Card className="shadow-xl bg-white/70 backdrop-blur-sm border-0 rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            {isEditMode ? (
              <motion.div
                key="update"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <UpdateAuction
                  auctionDetailData={auctionDetailData}
                  auctionType={auctionType}
                  auctionId={auctionId}
                  onUpdateSuccess={handleUpdateSuccess}
                />
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <AuctionDetail
                  auctionDetailData={auctionDetailData}
                  auctionType={auctionType}
                  auctionId={auctionId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Modal chọn quản lý */}
      <Modal
        title={
          <div className="flex items-center gap-3 text-lg font-semibold">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <UserOutlined className="text-white" />
            </div>
            <span className="text-gray-600">
              Chọn quản lý để gửi phiên đấu giá
            </span>
          </div>
        }
        open={showManagerModal}
        onOk={handleConfirmSendToManager}
        onCancel={handleCancelManagerModal}
        okText="Gửi cho quản lý"
        cancelText="Hủy"
        width={500}
        centered
        okButtonProps={{
          disabled: !selectedManagerId,
          className:
            "bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:from-blue-600 hover:to-indigo-700",
          size: "large",
        }}
        cancelButtonProps={{
          size: "large",
        }}
        className="rounded-xl"
        styles={{
          header: {
            borderBottom: "2px solid #e5e7eb",
            paddingBottom: "16px",
          },
          body: {
            padding: "24px",
          },
        }}
      >
        <div className="py-4">
          <Form form={form} layout="vertical">
            <Form.Item
              label={
                <span className="text-gray-700 font-semibold flex items-center gap-2">
                  <UserOutlined className="text-blue-500" />
                  Chọn quản lý
                </span>
              }
              name="managerId"
              rules={[{ required: true, message: "Vui lòng chọn quản lý!" }]}
            >
              <Select
                placeholder="Chọn quản lý để gửi phiên đấu giá"
                size="large"
                value={selectedManagerId}
                onChange={setSelectedManagerId}
                style={{
                  borderRadius: "8px",
                }}
                dropdownStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                }}
                optionRender={(option) => (
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <UserOutlined className="text-blue-600" />
                    </div>
                    <span className="font-medium">{option.label}</span>
                  </div>
                )}
              >
                {listManager.map((manager) => (
                  <Select.Option
                    key={manager.managerId}
                    value={manager.managerId}
                  >
                    {manager.managerName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>

          {selectedManagerId && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <UserOutlined className="text-white text-sm" />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-700">
                    Quản lý được chọn:
                  </div>
                  <div className="text-lg font-bold text-blue-800">
                    {
                      listManager.find((m) => m.managerId === selectedManagerId)
                        ?.managerName
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
        
        .delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </section>
  );
};

export default AuctionDetailAnonymous;
