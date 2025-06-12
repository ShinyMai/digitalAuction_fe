import { useState } from "react";
import EkycSDK from "../../../components/Ekyc/EkycSDK";
import { ConfigProvider, Steps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import RegisterAccountForm from "./components/RegisterAccountForm";

const Register = () => {
  const [current, setCurrent] = useState(0);
  const [account, setAccount] = useState({});

  console.log("acc", account);
  return (
    <div className="px-32 py-4 w-3/4 mx-auto mt-4 bg-white rounded-lg">
      <ConfigProvider
        theme={{
          components: {
            Steps: {
              colorPrimary: "#1ab2c9",
            },
          },
        }}
      >
        <Steps
          current={current}
          items={[
            {
              title: "Xác thực danh tính",
              icon: (
                <UserOutlined
                  style={{ color: "#1ab2c9" }}
                />
              ),
            },
            {
              title: "Thông tin tài khoản",
              icon: (
                <UserOutlined
                  style={{ color: "#1ab2c9" }}
                />
              ),
            },
          ]}
          style={{
            fontWeight: "bold",
          }}
        />
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
