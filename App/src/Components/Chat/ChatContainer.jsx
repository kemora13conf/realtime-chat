import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { closeImage } from "../../Store/Global/index.js";
import Cookies from "js-cookie";

export default function ChatContainer({ bounds }) {
  const global = useSelector((state) => state.global);
  const param = useParams();
  const dispatch = useDispatch();
  return (
    <motion.div
      initial={{ x: 500 }}
      animate={{ x: 0 }}
      exit={{ x: 500 }}
      className={`w-full
        ${bounds.width > 720 ? "flex" : param.id ? "flex" : "hidden"}
         items-stretch py-[20px] md:p-[20px] max-h-[100svh] md:max-h-screen relative
        `}
    >
      <AnimatePresence mode="wait">
        {global.openedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="w-full h-full absolute top-0 left-0 bg-primary-800 bg-opacity-40 backdrop-blur-md z-50
            rounded-[20px] flex justify-center items-center transition-all duration-300"
          >
            <button
              onClick={() => {
                dispatch(closeImage());
              }}
              className="absolute top-[30px] right-[30px] p-2 bg-primary-500
              w-[40px] h-[40px] rounded-full flex justify-center items-center transition-all duration-300
              hover:bg-primary-600 hover:bg-opacity-50 group"
            >
              <i
                className="fas fa-times text-xl
                  text-primary-200 group-hover:text-primary-100 transition-all duration-300"
              ></i>
            </button>
            <img
              src={`${import.meta.env.VITE_API}/conversations/Messages-files/${
                global.openedImage._id
              }?token=${Cookies.get("jwt")}`}
              alt="opened-image"
              className="w-fit h-fit max-h-[300px]  object-contain rounded-[10px] transition-all duration-300"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="">
        <Outlet />
      </AnimatePresence>
    </motion.div>
  );
}
