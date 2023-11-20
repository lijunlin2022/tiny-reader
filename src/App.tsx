import React from "react";
import { BrowserRouter } from "react-router-dom";
import "amfe-flexible";
import "@/assets/styles/bases.scss";

import AppRouter from "@/routers";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
