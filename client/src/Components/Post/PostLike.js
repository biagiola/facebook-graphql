import React, { useState } from 'react'
import { AccountCircle, ThumbUp, ChatBubbleOutline, NearMe, ExpandMoreOutlined } from '@material-ui/icons'
import axios from '../../axios'

const PostLike = ({ id, user, email, imgName, text, avatar, like, timestamp }) => {
  const [likeCliked, setLikeCliked] = useState(like)

  // like post
  const handleLike = () => {
    console.log('handlelike', id)
    setLikeCliked(!likeCliked)

    const postUpdated = {
      user: user,
      email: email,
      imgName: imgName,
      text: text,
      avatar: avatar,
      like: !like,
      timestamp: timestamp
    }
    console.log('postData', postUpdated)

    axios.post('posts/update/' + id, {postUpdated})
      .then(res => console.log(res.data))
  }

  return (
    <div className="post__options">
      <div /* className="post__option"  */
        onClick={ handleLike } 
        className={ likeCliked ? "post__liked" : "post__disliked" }>
        <ThumbUp />
        <p>Like</p>
      </div>
      <div className="post__option" /* onClick={() => setActiveComment(!activeComment)} */>
        <ChatBubbleOutline />
        <p>Comment</p>
      </div>
      <div className="post__option">
        <NearMe />
        <p>Share</p>
      </div>
      <div className="post__option">
        <AccountCircle />
        <ExpandMoreOutlined />
      </div>
    </div>
  )
}

export default PostLike
