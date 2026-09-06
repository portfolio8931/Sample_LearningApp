import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import "./index.css";
import App from "./App.tsx";
import { initDummyDataIfEmpty } from "./data/dummyData";

initDummyDataIfEmpty();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
