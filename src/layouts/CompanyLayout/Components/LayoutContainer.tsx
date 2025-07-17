import { Layout } from "antd";
import type React from "react";
import { useState } from "react";
import HeaderCompany from "./HeaderCompany";
import SiderRouteOption from "./SiderRouteOption";

interface Props {
  children?: string | React.JSX.Element | React.JSX.Element[];
}

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
};

const LayoutContainer = ({ children }: Props) => {
  const { Header, Content, Sider } = Layout;
  const [collapsed, setCollapsed] = useState(false);

  const siderWidth = collapsed ? 80 : 280;
  const headerWidth = `calc(100% - ${siderWidth}px)`;

  return (
    <Layout
      style={{
        backgroundColor: "#f1f5f9",
      }}
      className="min-h-screen w-full"
    >
      <Sider
        style={{
          ...siderStyle,
          width: siderWidth,
        }}
        theme="light"
        width={siderWidth}
        className="bg-slate-100 transition-all duration-300"
      >
        <SiderRouteOption collapsed={collapsed} onCollapse={setCollapsed} />
      </Sider>
      <Layout
        style={{
          marginTop: 64,
          padding: "0px 10px",
          transition: "all 0.3s ease",
        }}
      >
        <Header
          style={{
            position: "fixed",
            top: 0,
            backgroundColor: "white",
            width: headerWidth,
            zIndex: 1000,
            padding: 0,
            transition: "width 0.3s ease",
          }}
        >
          <HeaderCompany />
        </Header>
        <Content
          style={{
            minHeight: "calc(100vh - 128px)",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            marginTop: "30px",
          }}
        >
          <div className="h-full bg-gradient-to-b from-blue-50 to-teal-50">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutContainer;
