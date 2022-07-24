import { ColorModeScript } from "@chakra-ui/react";
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./components/App";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);

root.render(
  // <StrictMode>
  <BrowserRouter>
    <ColorModeScript />
    <App />
  </BrowserRouter>,
  // </StrictMode>,
);
