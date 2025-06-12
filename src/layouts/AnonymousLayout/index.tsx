import LayoutContainer from "./Components/LayoutContainer";
import { Outlet } from "react-router-dom";

const PrivateRoutes = () => {
    return (
        <LayoutContainer>
            <Outlet />
        </LayoutContainer>
    )
}

export default PrivateRoutes