import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Provider } from "react-redux";
import "./App.css";
import Register from "./Layout/Auth/Register.jsx";
import Login from "./Layout/Auth/Login.jsx";
import Home from "./Layout/App/Home.jsx";
import { Manager } from "socket.io-client";
import BaseLayout from "./Layout/BaseLayout";
import Store from "./Store/Store.js";
import Protected from "./Components/ProtectedRoute.jsx";
import LoadSocket from "./Components/LoadSocket.jsx";

function App() {
  return (
    <BrowserRouter>
      <Provider store={Store}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/*">
              <Route element={<BaseLayout />}>
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route element={<Protected />}>
                  <Route index element={<Home />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </AnimatePresence>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
