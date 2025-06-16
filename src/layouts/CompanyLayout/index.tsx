import { Outlet } from "react-router-dom";
import LayoutContainer from "./Components/LayoutContainer";

const PrivateRoutesCompany = () => {
  return (
    <LayoutContainer>
      <Outlet />
    </LayoutContainer>
  );
};

export default PrivateRoutesCompany;
