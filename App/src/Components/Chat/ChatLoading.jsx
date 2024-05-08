import React from 'react'
import Spinner from '../Spinner.jsx'

function ChatLoading() {
    return (
      <div className="w-full h-full flex items-center justify-center ">
        <div className="w-[40px] h-[40px]">
          <Spinner />
        </div>
      </div>
    );
}

export default ChatLoading
