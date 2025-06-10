import { Navigate, Route, Routes } from "react-router-dom";
import { companyRoutes, guestRoutes } from "./roleBased.routes";
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
          {guestRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.element />}
            />
          ))}
          <Route
            path="*"
            element={<Navigate to="/not-found" />}
          />
        </Route>
        <Route path="/admin" element={<PrivateRoutesCompany />}>
          {companyRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.element />}
            />
          ))}
          <Route
            path="*"
            element={<Navigate to="/not-found" />}
          />
        </Route>
      </Routes>

      <ToastContainer stacked />
    </>
  );
};

export default AppRouter;
