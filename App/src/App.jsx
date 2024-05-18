import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Provider } from "react-redux";
import "./App.css";
import Register from "./Pages/Auth/Register.jsx";
import Login from "./Pages/Auth/Login.jsx";
import Home from "./Pages/Home.jsx";
import BaseLayout from "./Layout/BaseLayout";
import Store from "./Store/Store.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmptyChat from "./Pages/EmptyChat.jsx";
import Chat from "./Pages/Chat.jsx";
import Profile from "./Pages/Profile.jsx";
import Call from "./Pages/Call.jsx";

function App() {
  return (
    <BrowserRouter>
      <Provider store={Store}>
        <AnimatePresence mode="wait">
          <ToastContainer />
          <Routes>
            <Route path="/*">
              <Route element={<BaseLayout />}>
                <Route
                  key={"register-key"}
                  path="register"
                  element={<Register />}
                />
                <Route key={"login-key"} path="login" element={<Login />} />

                <Route key={"home-key"} element={<Home />}>
                  <Route key={"emty-chat-key"} index element={<EmptyChat />} />
                  <Route key={"chat-key"} path="conversation/:id/">
                    <Route key={"chat-index-key"} index element={<Chat />} />
                    <Route
                      key={"chat-call-key"}
                      path="call"
                      element={<Call />}
                    />
                  </Route>
                  <Route
                    key={"profile-key"}
                    path="profile"
                    element={<Profile />}
                  />

                  <Route
                    key={"somewhere-else-key"}
                    path="*"
                    element={<EmptyChat />}
                  />
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
