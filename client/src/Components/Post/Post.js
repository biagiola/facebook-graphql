import React, { useState, useEffect } from 'react'
import PostComments from './PostComments/PostComments'
import PostMenu from './PostMenu'
import PostImage from './PostImage'
import PostLike from './PostLike'
import './Post.css'
import '../MessageSender/MessageSender.css'

console.time('post start')

function Post({ id, username, email, avatar, message, comments, imgName, timestamp, like }) {
  const [commentsCopy, setCommentsCopy] = useState([comments])

  useEffect(() => {
  }, [commentsCopy])

  return (
    <div className='post'>

      <PostMenu 
        id={ id } 
        username={ username } 
        email={ email } 
        avatar={ avatar}
        message={ message }
        imgName={ imgName }  
        timestamp={ timestamp }
      />

      {/* post image */}
      <PostImage imgName={ imgName } />
      
      {/* like handle */}
      <PostLike 
        id={ id }
        user={ username }
        email={ email }
        avatar={ avatar }
        imgName={ imgName }
        text={ message }
        like={ like }
        timestamp={ timestamp }
      />

      {/* add first new comment */}
      { commentsCopy.length === 0 ? 
        <PostComments
          key={ Math.random() }
          id={ id }
          username={ username }
          avatar={ avatar }
          comments={ '' }
        /> : '' } 

      {/* FROM DB*/}
      { commentsCopy.length > 0 ? 
        <PostComments
          key={ comments.timestamp }
          id={ id }
          username={ username }
          avatar={ avatar }
          comments={ comments }
        /> : '' } 
      
    </div> 
  )
}

console.timeEnd('post start')

export default Post