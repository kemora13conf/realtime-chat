import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Provider } from "react-redux";
import "./App.css";
import Register from "./Layout/Auth/Register.jsx";
import Login from "./Layout/Auth/Login.jsx";
import Home from "./Layout/App/Home.jsx";
import BaseLayout from "./Layout/BaseLayout";
import Store from "./Store/Store.js";
import Protected from "./Components/Protection/ProtectedRoute.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmptyChat from "./Layout/App/EmptyChat.jsx";
import Chat from "./Layout/App/Chat.jsx";

function App() {
  return (
    <BrowserRouter>
      <Provider store={Store}>
        <AnimatePresence mode="wait">
          <ToastContainer />
          <Routes>
            <Route path="/*">
              <Route element={<BaseLayout />}>
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                
                <Route element={<Home />}>
                  <Route index element={<EmptyChat />} />
                  <Route path="conversation/:id" element={<Chat />} />

                  <Route path="*" element={<EmptyChat />} />
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
