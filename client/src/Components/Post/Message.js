import React, { useEffect } from 'react'
import { useStateValue } from '../../Store/StateProvider'

const Message = ({ messageCopy, postId }) => {
  const [{openEditPostBox}] = useStateValue()

  useEffect(() => {
  }, [openEditPostBox])

  if(openEditPostBox.id === postId){
    console.log('message', messageCopy)
    console.log('openEditPostBox.text', openEditPostBox.text)
  } 

  return (
    <div className="post__bottom">
      { openEditPostBox.show && openEditPostBox.id === postId
          ? <p>{ openEditPostBox.text }</p> 
          : <p>{ messageCopy }</p>
      }
    </div>
  )
}

export default Message
