import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

interface props {
    children?:
    | string
    | React.JSX.Element
    | React.JSX.Element[];
}

const LayoutContainer = ({ children }: props) => {
    const location = useLocation();
    return (
        <>
            <Header />
            <div className="min-h-screen">{children}</div>
            {location.pathname === "/register" ? "" : <Footer />}
        </>
    );
};

export default LayoutContainer;
