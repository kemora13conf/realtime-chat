import React, { useEffect, useState } from 'react'

function UnreadMesssages({ conversationId }) {
    const [count, setCount] = useState(1);
    useEffect(() => {
        // Fetch the unread messages count for the conversation
        // Update the count using setCount

    }, [conversationId])
  return (
    <div className='absolute right-[10px] my-auto aspect-square min-w-[25px] flex items-center justify-center bg-primary-500 text-white text-xs font-bold rounded-full'>
      {count}
    </div>
  )
}

export default UnreadMesssages
