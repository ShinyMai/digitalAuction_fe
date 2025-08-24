import { useState } from "react";
import { Select, Button, Alert, Typography, Avatar } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import type { ModalAuctioners } from "../../../Staff/Modals";
import CustomModal from "../../../../components/Common/CustomModal";

const { Title, Text } = Typography;

interface Staff {
  staffId: string;
  staffName: string;
}

interface Props {
  isOpen: boolean;
  listAuctioners: ModalAuctioners[];
  listStaff: Staff[];
  onClose: () => void;
  onSelect: (auctionerId: string, selectedStaffIds: string[]) => void;
}

const ModalsSelectAuctioners = ({ isOpen, listAuctioners, listStaff, onClose, onSelect }: Props) => {
  const [selectedAuctionerId, setSelectedAuctionerId] = useState<string | null>(null);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  const handleConfirm = () => {
    if (selectedAuctionerId) {
      onSelect(selectedAuctionerId, selectedStaffIds);
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
              Chỉ định Đấu giá viên & Nhân viên
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
                    Hướng dẫn chọn đấu giá viên và nhân viên
                  </Text>
                  <Text className="text-slate-600 leading-relaxed">
                    Vui lòng chọn một đấu giá viên và danh sách nhân viên tham gia phiên đấu giá.
                    Đảm bảo đấu giá viên được chọn có đủ kinh nghiệm và thời gian để điều hành phiên
                    đấu giá. Nhân viên được chọn sẽ hỗ trợ trong quá trình đấu giá.
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
                onChange={(value) => setSelectedAuctionerId(value)}
                value={selectedAuctionerId ?? undefined}
                dropdownStyle={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              />
            </div>

            {/* Staff Selection */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
              <Text className="font-semibold text-slate-800 text-lg block mb-4">
                <UsergroupAddOutlined className="mr-2 text-blue-600" />
                Danh sách nhân viên tham gia
              </Text>

              <Select
                mode="multiple"
                size="large"
                className="w-full 
                  [&_.ant-select-selector]:!min-h-[48px] 
                  [&_.ant-select-selector]:!h-auto 
                  [&_.ant-select-selector]:!py-2
                  [&_.ant-select-selection-overflow]:!flex-wrap
                  [&_.ant-select-selection-overflow]:!max-h-[120px]
                  [&_.ant-select-selection-overflow]:!overflow-y-auto
                  [&_.ant-select-selection-item]:!m-1
                  [&_.ant-select-selection-item]:!max-w-[200px]
                  staff-multi-select"
                placeholder="Chọn nhân viên tham gia phiên đấu giá..."
                showSearch
                optionFilterProp="label"
                maxTagCount="responsive"
                maxTagPlaceholder={(omittedValues) => (
                  <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-lg text-sm">
                    +{omittedValues.length} nhân viên khác
                  </span>
                )}
                tagRender={(props) => {
                  const { label, closable, onClose } = props;
                  const staffName = listStaff.find(staff => staff.staffId === props.value)?.staffName || label;

                  return (
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg px-2 py-1 m-0.5 text-xs font-medium text-green-800 shadow-sm hover:shadow-md transition-all duration-200 max-w-[180px]">
                      <Avatar
                        size={16}
                        icon={<UserOutlined />}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 flex-shrink-0"
                      />
                      <span className="truncate text-xs">{staffName}</span>
                      {closable && (
                        <button
                          onClick={onClose}
                          className="ml-1 hover:bg-green-200 rounded-full w-4 h-4 flex items-center justify-center text-green-600 hover:text-green-800 transition-colors duration-200 flex-shrink-0"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                }}
                notFoundContent={
                  <div className="text-center py-8">
                    <UserOutlined className="text-slate-400 text-3xl mb-2" />
                    <Text className="text-slate-500 block">Không tìm thấy nhân viên</Text>
                  </div>
                }
                options={listStaff.map((staff) => ({
                  value: staff.staffId,
                  label: (
                    <div className="flex items-center gap-3 py-2">
                      <Avatar
                        size={30}
                        icon={<UserOutlined />}
                        className="bg-gradient-to-r from-green-500 to-teal-500 border-2 border-white shadow-sm"
                      />
                      <div className="flex-1">
                        <Text className="font-semibold text-slate-800 block">{staff.staffName}</Text>
                      </div>
                      <CheckCircleOutlined className="text-green-500 text-lg" />
                    </div>
                  ),
                }))}
                onChange={(values) => setSelectedStaffIds(values)}
                value={selectedStaffIds}
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
                disabled={!selectedAuctionerId}
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
