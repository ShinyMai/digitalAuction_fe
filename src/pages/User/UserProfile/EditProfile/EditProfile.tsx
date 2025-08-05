import { Button, ConfigProvider, Spin, Steps } from "antd";
import { useState } from "react";
import CustomModal from "../../../../components/Common/CustomModal";
import EkycSDK from "../../../../components/Ekyc/EkycSDK";
import EditProfileForm from "./modal/EditProfileForm";

interface EditProfileProps {
  open: boolean;
  onCancel: () => void;
}

const EditProfile = ({ open, onCancel }: EditProfileProps) => {
  const [loading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [current, setCurrent] = useState(0);
  const [account, setAccount] = useState({});

  console.log("EditProfile account:", account);

  return (
    <CustomModal
      title={isEdit ? "Cập nhật thông tin" : "Thông báo"}
      open={open}
      onCancel={onCancel}
      footer={null}
      style={{
        top: 20,
      }}
      styles={{
        body: {
          maxHeight: "calc(100vh - 108px)",
          overflowY: "auto",
          padding: "16px",
        },
      }}
    >
      <Spin spinning={loading}>
        {isEdit ? (
          <div className="lg:w-3/4 sm:px-6 w-full mx-auto mt-6 bg-white rounded-lg ">
            <ConfigProvider
              theme={{
                components: {
                  Steps: {
                    colorPrimary: "#0093DE",
                  },
                },
              }}
            >
              <div className="hidden sm:block pb-5">
                <Steps
                  current={current}
                  items={[
                    {
                      title: "Xác thực danh tính",
                    },
                    {
                      title: "Thông tin tài khoản",
                    },
                  ]}
                  style={{
                    fontWeight: "bold",
                  }}
                  className="hidden sm:block"
                />
              </div>
            </ConfigProvider>
            {current === 0 && (
              <EkycSDK
                setCurrent={setCurrent}
                setAccount={setAccount}
                face={false}
              />
            )}
            {current === 1 && (
              <EditProfileForm account={account} onCancel={onCancel} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-lg font-semibold text-center">
              Căn cước công dân của quý khách đã hết hạn. Vui lòng cập nhật
              thông tin mới để tiếp tục sử dụng dịch vụ.
            </h2>
            <div className="">
              <Button type="primary" onClick={() => setIsEdit(true)}>
                Cập nhật
              </Button>
              <Button onClick={onCancel} style={{ marginLeft: 10 }}>
                Để sau
              </Button>
            </div>
          </div>
        )}
      </Spin>
    </CustomModal>
  );
};

export default EditProfile;
