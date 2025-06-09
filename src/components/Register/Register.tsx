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
        <div className="flex flex-col gap-4">
          <button
            className="w-2sm px-6 py-8 bg-gray-400 text-white text-2xl rounded-3xl hover:bg-sky-600 transition-colors w-96"
            onClick={() => {
              console.log("Register as Individual");
              onClose();
            }}
          >
            Cá nhân
          </button>
          {/* <button
            className="px-6 py-8 bg-gray-400 text-white text-2xl rounded-3xl hover:bg-sky-600 transition-colors w-96"
            onClick={() => {
              console.log("Register as Organization");
              onClose();
            }}
          >
            Tổ chức
          </button> */}
        </div>
      </div>
    </Modal>
  );
};

export default Register;
