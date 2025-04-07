import "./index.css";

import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import CustomSnackbarProvider from "./layouts/CustomSnackbar.tsx";
import Navigator2 from "./layouts/Navigator2.tsx";
import { NextUIProvider } from "@nextui-org/react";
import NextUIThemeProvider from "./layouts/NextUIThemeProvider.tsx";
import OmitPages from "./layouts/OmitPages.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import Footer from "./layouts/Footer.tsx";

window.global = globalThis;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider id="next-ui-provider">
      <NextUIThemeProvider>
        <CustomSnackbarProvider>
          <HashRouter>
            <OmitPages
              omit={["/auth/login", "/auth/register"]}
              element={<Navigator2 />}
            />
            <div className="h-full min-h-screen w-full">
              <App />
            </div>
            <Footer />
          </HashRouter>
        </CustomSnackbarProvider>
      </NextUIThemeProvider>
    </NextUIProvider>
  </React.StrictMode>,
);
