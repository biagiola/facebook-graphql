import React, { useState, useEffect } from 'react'
import { useStateValue } from '../../../Store/StateProvider'
import IsolatedComment from './IsolatedComment'
import './PostComments.css'
import CommentsEditForm from './CommentsEditForm'

console.time('postComments start')

function PostComments({ id, username, avatar, comments }) {
  const [usersComments, setUsersComments] = useState([]) // all comments from the db
  const [currentComments, setCurrentComments] = useState([]) // from the input user to make realtime rendering dom
  
  const [{ user }] = useStateValue()

  useEffect(() => {
    // when post have no comments 
    if (typeof(comments) === 'string') {
      setUsersComments([])
    } else {
      comments.map( usercomment => setUsersComments(prevUserComment => [...prevUserComment, usercomment]))
    }
  }, [])

  const filterComment = commentId => {
    if (usersComments.length > 0) { setUsersComments( usersComments.filter(usersComment => usersComment._id !== commentId )) }
    if (currentComments.length > 0) { setCurrentComments( currentComments.filter(currentComment => currentComment._id !== commentId )) }
  }

  useEffect(() => {
  }, [usersComments])

  useEffect(() => {
  }, [currentComments])

  return (
    <div className='post__comments'>
      
      <CommentsEditForm
        user={ username }
        email={ user.email }
        avatar={ avatar }
        setCurrentComments={ setCurrentComments }
        postId={ id }
      />
        
      <div className='post__comments__box'>
        
        {/* Comments from db */}
        {
          usersComments.length > 0 ?
          usersComments.map(
            userComment =>
              /* we need to make every userComment in a different component to reach the real id; MenuItem always grab the last id by default */
              <IsolatedComment
                key={ /* userComment._id */Math.random() }  
                postId={ id }
                commentId={ userComment._id }
                userComment={ userComment.text }
                username={ userComment.user }
                email={ userComment.email }
                avatar={ userComment.avatar }
                filterComment={ filterComment }
              />
            ): ''
        }
        
        {/* Currents comments; give the sensation of realtime app */}
        {
          currentComments.length > 0 ? 
            currentComments.map( 
              current => 
                <IsolatedComment
                  key={ current.timestamp}  
                  postId={ id}  
                  commentId={ current._id }
                  userComment={ current.text }
                  username={ current.user }
                  email={ current.email }
                  avatar={ current.avatar }
                  filterComment={ filterComment }
                />
              ) 
            : ''
        }
      </div>
    </div>
  )
}

console.timeEnd('postComments start')

export default PostComments