import { Layout } from "antd";
import Footers from "../../AnonymousLayout/Components/Footer";
import type React from "react";
import HeaderCompany from "./HeaderCompany";
import SiderRouteOption from "./SiderRouteOption";
import FooterCompany from "./FoooterCompany";

interface Props {
  children?:
  | string
  | React.JSX.Element
  | React.JSX.Element[];
}

const siderStyle: React.CSSProperties = {
  // overflow: "auto",
  // position: "sticky",
  // insetInlineEnd: 0,
  // top: 0,
  // bottom: 0,

  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  // scrollbarGutter: 'stable',
};

const LayoutContainer = ({ children }: Props) => {
  const { Header, Footer, Content, Sider } = Layout;

  return (
    <Layout
      style={{
        backgroundColor: "#f1f5f9",
      }}
      className="min-h-screen w-full"
    >
      <Sider
        style={siderStyle}
        theme="light"
        width={"15%"}
        className="bg-slate-100"
      >
        <SiderRouteOption />
      </Sider>
      <Layout style={{ marginTop: 64, padding: "0px 10px" }}>
        <Header
          style={{
            position: "fixed",
            top: 0,
            backgroundColor: "white",
            width: "85%",
            zIndex: 1000,
            padding: 0,
          }}
        >
          <HeaderCompany />
        </Header>
        <Content
          style={{
            minHeight: "calc(100vh - 128px)",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            textAlign: "center",
            padding: "16px 0",
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <FooterCompany />
        </Footer>
      </Layout>

    </Layout>
  );
};

export default LayoutContainer;
