import { useState } from "react";
import EkycSDK from "../../../components/Ekyc/EkycSDK";
import { ConfigProvider, Steps } from "antd";
import RegisterAccountForm from "./components/RegisterAccountForm";

const Register = () => {
  const [current, setCurrent] = useState(0);
  const [account, setAccount] = useState({});

  console.log("acc", account);
  return (
    <div className="lg:px-32 lg:py-4 lg:w-3/4 sm:px-6 w-full mx-auto mt-4 bg-white rounded-lg">
      <ConfigProvider
        theme={{
          components: {
            Steps: {
              colorPrimary: "#0093DE",
            },
          },
        }}
      >
        <div className="hidden sm:block">
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
        />
      )}
      {current === 1 && (
        <RegisterAccountForm
          setAccount={setAccount}
          account={account}
        />
      )}
    </div>
  );
};

export default Register;
