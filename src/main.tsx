import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { RouterProvider } from "react-router-dom";
import router from "./app/router.tsx";
import theme from "./app/theme.ts";
import "./main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
