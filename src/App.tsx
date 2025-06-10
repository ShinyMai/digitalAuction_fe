import { Provider } from "react-redux";
import AppRouter from "./routers/app.routes";
import store from "./store/store";
import { useEffect } from "react";

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;
