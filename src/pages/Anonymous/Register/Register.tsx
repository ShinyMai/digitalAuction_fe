import {useState} from "react";
import EkycSDK from "../../../components/Ekyc/EkycSDK";
import {ConfigProvider, Steps} from "antd";
import {UserOutlined} from "@ant-design/icons";
import RegisterAccountForm from "./components/RegisterAccountForm";
import RegisterUserForm from "./components/RegisterUserForm";

const Register = () => {
    const [current, setCurrent] = useState(0);
    const [account, setAccount] = useState({});

    console.log("acc", account)
    return (
        <div className="px-32 py-4">
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
                            title: "Thông tin tài khoản",
                            icon: (
                                <UserOutlined
                                    style={{color: "#1ab2c9"}}
                                />
                            ),
                        },
                        {
                            title: "Xác thực danh tính",
                            icon: (
                                <UserOutlined
                                    style={{color: "#1ab2c9"}}
                                />
                            ),
                        },
                        {
                            title: "Xác nhận thông tin",
                            icon: (
                                <UserOutlined
                                    style={{color: "#1ab2c9"}}
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
                    setCurrent={setCurrent}
                    setAccount={setAccount}
                    account={account}
                />
            )}
            {current === 2 && (
                <RegisterUserForm
                />
            )}
        </div>
    );
};

export default Register;
