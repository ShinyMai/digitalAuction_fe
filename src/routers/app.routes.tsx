import { Navigate, Route, Routes } from "react-router-dom";
import {
  companyRoutes,
  guestRoutes,
  userRoutes,
} from "./roleBased.routes";
import AuthLoader from "../store/authReduxs/authLoader";
import { ToastContainer } from "react-toastify";
import PrivateRoutes from "../layouts/AnonymousLayout";
import PrivateRoutesCompany from "../layouts/CompanyLayout";

const AppRouter = () => {

  return (
    <>
      <AuthLoader />
      <Routes>
        <Route path="/" element={<PrivateRoutes />}>
          {[...userRoutes, ...guestRoutes].map(
            (route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<route.element />}
              />
            )
          )}
        </Route>
        <Route path={`/company`} element={<PrivateRoutesCompany />}
        >
          {companyRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.element />}
            />
          ))}
        </Route>
      </Routes>
      <ToastContainer stacked />
    </>
  );
};

export default AppRouter;
