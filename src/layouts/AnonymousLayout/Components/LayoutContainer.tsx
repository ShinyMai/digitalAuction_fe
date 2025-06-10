import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface props {
  children?:
    | string
    | React.JSX.Element
    | React.JSX.Element[];
}

const LayoutContainer = ({ children }: props) => {
  return (
    <>
      <Header />
      <div>{children}</div>
      <Footer />
    </>
  );
};

export default LayoutContainer;
