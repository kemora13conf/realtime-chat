import { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import SideBar from "../Layout/App/SideBar.jsx";
import ChatContainer from "../Layout/App/ChatContainer.jsx";
import { useDispatch, useSelector } from "react-redux";
import { loading as GlobalLoading } from "../Store/Global/index.js";

export default function Home() {
  const [ref, bounds] = useMeasure();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(GlobalLoading(false));
    return () => {
      dispatch(GlobalLoading(true));
    };
  }, []);
  const containerRef = useRef(null);

  const toggleFullscreen = () => {
    if (bounds.width < 520) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      // Handle any additional logic when fullscreen mode changes
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    auth.user && (
      <div
        ref={containerRef}
        // onClick={toggleFullscreen}
        key={"Home"}
        className="w-full max-h-[100svh] min-h-[100svh] md:min-h-screen bg-primary-700 flex justify-center items-center 
      px-[10px] lg:px-0"
      >
        <div
          ref={ref}
          className="relative w-full max-w-[1000px] max-h-[100svh] md:min-h-screen  
        overflow-hidden flex justify-stretch gap-[20px] items-stretch @container/home"
        >
          <SideBar bounds={bounds} />
          <ChatContainer bounds={bounds} />
        </div>
      </div>
    )
  );
}
