import { Navigate, Route, Routes } from "react-router-dom";
import { guestRoutes } from "./roleBased.routes";
import AuthLoader from "../store/authReduxs/authLoader";
import { ToastContainer } from "react-toastify";
const AppRouter = () => {
  return (
    <>
      <AuthLoader />
      <Routes>
        <Route path="/*">
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
      </Routes>

      <ToastContainer stacked />
    </>
  );
};

export default AppRouter;
