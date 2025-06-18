import { Navigate, Route, Routes } from "react-router-dom";
import AuthLoader from "../store/authReduxs/authLoader";
import { ToastContainer } from "react-toastify";
import PrivateRoutes from "../layouts/AnonymousLayout";
import PrivateRoutesCompany from "../layouts/CompanyLayout";
import { useAppRouting } from "../hooks/useAppRouting";

const AppRouter = () => {
  const {
    role,
    userAndGuestRoutes,
    staffRoutes,
    isUserOrGuest,
    isCompanyStaff,
    // isAdmin,
    isStaff,
    // isAuctioneer,
    // isManager,
    // isDirector,
  } = useAppRouting();

  return (
    <>
      <AuthLoader />
      <Routes>
        {isUserOrGuest && (
          <Route path="/" element={<PrivateRoutes />}>
            {userAndGuestRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<route.element />}
              />
            ))}
          </Route>
        )}
        {isCompanyStaff && (
          <Route
            path={`/${role?.toLowerCase()}/*`}
            element={<PrivateRoutesCompany />}
          >
            {isStaff &&
              staffRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={<route.element />}
                />
              ))}
            <Route
              index
              element={<Navigate to="statistics" replace />}
            />
          </Route>
        )}
        {!role && (
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        )}
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
