import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import SideBar from "../../Components/SideBar/SideBar.jsx";
import { motion } from "framer-motion";
import ChatContainer from "../../Components/ChatContainer";
import { useDispatch, useSelector } from "react-redux";
import { loading as GlobalLoading } from "../../Store/Global/index.js";
import socketContext from "../../Context/LoadSocket.js";

export default function Home() {
  const [ref, bounds] = useMeasure();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const global = useSelector((state) => state.global);

  // get the current user from the context
  useEffect(() => {
    socketContext.emit("connection-success", auth.user._id);
  }, []);
  useEffect(() => {
    if (!global.loading) {
      dispatch(GlobalLoading(false));
    }
    return () => {
      dispatch(GlobalLoading(true));
    };
  }, []);
  return (
    <div className="w-full min-h-screen bg-primary-700 flex justify-center items-center">
      <motion.div
        ref={ref}
        className="relative w-full max-w-[1000px] min-h-screen  
        overflow-hidden flex justify-stretch @container/home"
      >
        <SideBar bounds={bounds} />
      </motion.div>
    </div>
  );
}
