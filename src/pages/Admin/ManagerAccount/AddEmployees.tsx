import { ConfigProvider, Steps } from "antd";
import { useState } from "react";
import EkycSDK from "../../../components/Ekyc/EkycSDK";
import RegisterAccountForm from "../../Anonymous/Register/components/RegisterAccountForm";

const AddEmployees = () => {
  const [current, setCurrent] = useState(0);
  const [account, setAccount] = useState({});
  // const [loading, setLoading] = useState(false);

  return (
    <div className="lg:w-3/4 sm:px-6 w-full mx-auto bg-white rounded-lg ">
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
        <RegisterAccountForm
          account={account}
          user={false}
        />
      )}
    </div>
  );
};

export default AddEmployees;
