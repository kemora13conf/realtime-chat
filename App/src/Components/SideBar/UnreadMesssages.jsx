import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

function UnreadMesssages({ conversationId }) {
    const [count, setCount] = useState(1);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/conversations/${conversationId}/unread`, {
            method: 'GET',
          headers: {
            Authorization: `Bearer ${Cookies.get('jwt')}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setCount(data.data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

    }, [conversationId])
  return (
    <div className='absolute right-[10px] my-auto aspect-square min-w-[25px] flex items-center justify-center bg-primary-500 text-white text-xs font-bold rounded-full'>
      {count}
    </div>
  )
}

export default UnreadMesssages
