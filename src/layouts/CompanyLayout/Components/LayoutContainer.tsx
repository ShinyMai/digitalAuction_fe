import { Layout } from "antd";
import Footers from '../../AnonymousLayout/Components/Footer';
import type React from "react";
import HeaderCompany from "./HeaderCompany";
import SiderRouteOption from "./SiderRouteOption";

interface Props {
    children?: string | React.JSX.Element | React.JSX.Element[];
}

const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: 'auto',
    position: 'sticky',
    insetInlineEnd: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#f8fafc',
    borderLeft: '1px solid #e2e8f0',
};

const LayoutContainer = ({ children }: Props) => {
    const { Header, Footer, Content, Sider } = Layout;

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
            <Header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, padding: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <HeaderCompany />
            </Header>
            <Layout style={{ marginTop: 64 }}>
                <Layout>
                    <Sider style={siderStyle} theme="light" width={250}>
                        <SiderRouteOption />
                    </Sider>
                    <Content style={{ padding: '24px', minHeight: 'calc(100vh - 128px)', backgroundColor: '#ffffff', borderRadius: '8px', margin: '0 16px 0 16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        {children}
                    </Content>
                </Layout>
            </Layout>
            <Footer style={{ textAlign: 'center', padding: '16px 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <Footers />
            </Footer>
        </Layout>
    );
};

export default LayoutContainer;