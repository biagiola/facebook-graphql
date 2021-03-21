import React from 'react'

const PostImage = ({ imgName }) => {
  return (
    <div>
      {
        imgName ? (
          <div className="post__image">
            <img src={`http://localhost:9000/posts/retrieve/image/single?name=${imgName}`} alt='ProfileImage'/>
          </div>
        ) : ''
      }
    </div>
  )
}

export default PostImage
