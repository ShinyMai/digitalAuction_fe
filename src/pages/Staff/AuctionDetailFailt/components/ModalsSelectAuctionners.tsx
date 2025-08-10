import { useState } from "react";
import { Select, Button, Alert, Typography, Avatar } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ModalAuctioners } from "../../Modals";
import CustomModal from "../../../../components/Common/CustomModal";

const { Title, Text } = Typography;

interface Props {
  isOpen: boolean;
  listAuctioners: ModalAuctioners[];
  onClose: () => void;
  onSelect: (value: string) => void;
}

const ModalsSelectAuctioners = ({ isOpen, listAuctioners, onClose, onSelect }: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
      onClose(); // Đóng modal sau khi xác nhận
    }
  };
  return (
    <CustomModal
      open={isOpen}
      onCancel={onClose}
      centered
      closable={true}
      footer={null}
      width={700}
      className="modern-select-modal"
      styles={{
        body: {
          padding: 0,
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      }}
    >
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-6 right-6 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-6 left-6 w-24 h-24 bg-purple-100/30 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
                <TeamOutlined className="text-white text-2xl" />
              </div>
              <div className="absolute -inset-1 bg-white/10 rounded-2xl blur animate-pulse"></div>
            </div>

            <Title level={3} className="!mb-2 !text-white font-bold">
              Chỉ định Đấu giá viên
            </Title>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            {/* Instruction */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <UserOutlined className="text-white text-lg" />
                </div>
                <div>
                  <Text className="font-semibold text-slate-800 text-lg block mb-2">
                    Hướng dẫn chọn đấu giá viên
                  </Text>
                  <Text className="text-slate-600 leading-relaxed">
                    Vui lòng chọn một đấu giá viên từ danh sách bên dưới để gán cho phiên đấu giá.
                    Đảm bảo đấu giá viên được chọn có đủ kinh nghiệm và thời gian để điều hành phiên
                    đấu giá.
                  </Text>
                </div>
              </div>
            </div>

            {/* Auctioneer Selection */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
              <Text className="font-semibold text-slate-800 text-lg block mb-4">
                Danh sách đấu giá viên
              </Text>

              <Select
                size="large"
                className="w-full max-h-full"
                placeholder="Chọn đấu giá viên phù hợp..."
                showSearch
                optionFilterProp="label"
                notFoundContent={
                  <div className="text-center py-8">
                    <UserOutlined className="text-slate-400 text-3xl mb-2" />
                    <Text className="text-slate-500 block">Không tìm thấy đấu giá viên</Text>
                  </div>
                }
                options={listAuctioners.map((auctioner) => ({
                  value: auctioner.id,
                  label: (
                    <div className="flex items-center gap-3 py-2">
                      <Avatar
                        size={30}
                        icon={<UserOutlined />}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 border-2 border-white shadow-sm"
                      />
                      <div className="flex-1">
                        <Text className="font-semibold text-slate-800 block">{auctioner.name}</Text>
                      </div>
                      <CheckCircleOutlined className="text-green-500 text-lg" />
                    </div>
                  ),
                }))}
                onChange={(value) => setSelectedId(value)}
                value={selectedId ?? undefined}
                dropdownStyle={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              />
            </div>

            {/* Warning Alert */}
            <Alert
              icon={<ExclamationCircleOutlined className="text-amber-600" />}
              message={<Text className="font-semibold text-amber-800">Lưu ý quan trọng</Text>}
              description={
                <Text className="text-amber-700">
                  Vui lòng kiểm tra kỹ thông tin và đảm bảo đấu giá viên được chọn có thời gian rảnh
                  để điều hành phiên đấu giá. Việc thay đổi sau khi xác nhận sẽ cần quy trình phê
                  duyệt.
                </Text>
              }
              type="warning"
              className="border-amber-200 bg-amber-50/80 backdrop-blur-sm rounded-2xl"
              showIcon
            />

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <Button
                onClick={onClose}
                size="large"
                type="primary"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 rounded-xl px-8 py-3 h-auto font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Hủy bỏ
              </Button>

              <Button
                type="primary"
                disabled={!selectedId}
                onClick={handleConfirm}
                size="large"
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 border-0 rounded-xl px-8 py-3 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                <CheckCircleOutlined className="mr-2" />
                Xác nhận chỉ định
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalsSelectAuctioners;
