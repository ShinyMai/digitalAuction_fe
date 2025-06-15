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
import { useSelector } from "react-redux";

const AppRouter = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.roleName;

  return (
    <>
      <AuthLoader />
      <Routes>
        {(role === "User" || !role) && (
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
        )}
        {role && role !== "User" && (
          <Route
            path={`/${role.toLowerCase()}/*`}
            element={<PrivateRoutesCompany />}
          >
            {role === "Admin" &&
              companyRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={<route.element />}
                />
              ))}

            <Route
              index
              element={
                <Navigate to="post-auction" replace />
              }
            />
          </Route>
        )}
        {!role && (
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        )}
        {/* Route cho 404 */}
        <Route
          path="/not-found"
          element={<div>Page Not Found</div>}
        />
      </Routes>
      <ToastContainer stacked />
    </>
  );
};

export default AppRouter;
