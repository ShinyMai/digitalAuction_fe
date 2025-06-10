import { Modal } from "antd";

interface RegisterProps {
  open: boolean;
  onClose: () => void;
}

const Register = ({ open, onClose }: RegisterProps) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      closeIcon={null}
    >
      <div className="flex flex-col items-center justify-center p-2 max-h-[90vh]">
        <div className="text-4xl font-bold">
          Bạn là cá nhân hay tổ chức?
        </div>
        <div className="text-[16px] mb-14 mt-0.5">
          Nhập thông tin đăng ký hồ sơ để tham gia đấu giá
        </div>
      </div>
    </Modal>
  );
};

export default Register;
