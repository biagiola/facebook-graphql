import React, { useState, useEffect, useRef } from 'react'
import { Menu, MenuItem, IconButton, Avatar } from '@material-ui/core'
import { MoreHoriz, DeleteOutline, Edit  } from '@material-ui/icons'
import axios from '../../../axios'
import { useStateValue } from '../../../Store/StateProvider'

console.time('IsolatedComment start')

const IsolatedComment = ({ postId, commentId, userComment, username, email, avatar, filterComment }) => {
  const [{ user }] = useStateValue()
  const [anchorEl, setAnchorEl] = useState(null) 
  const [openEdit, setOpenEdit] = useState(false)
  const [comment, setComment] = useState(userComment)
  //const [toggleEmojiPicker, setToggleEmojiPicker] = useState(false)
  
  const node = useRef()

  const handleClickInsideOutside = e => {
    if (node.current.contains(e.target)) {
      // inside click
      setOpenEdit(true)
      return
    }
    // outside click 
    //setToggleEmojiPicker(false) // important when the user doesnt close the emoji picker
    setOpenEdit(false)
  }

  // click outside/inside
  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", handleClickInsideOutside)
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickInsideOutside)
    };
  }, [])
 
  const handleDelete = commentId => {
    // validate user
    if ( user.email === email ) {
      axios.delete( '/comments/delete/' + postId + '/' + commentId + '/' )
        .then(filterComment(commentId))
        .catch( err => console.log( 'error', err ) ) 
    } else {
      alert('You cand delete this comment. Unauthorized user!!')
    }  
    // close the card options
    setAnchorEl(null);
  }

  // open the edit comment box
  const handleEdit = e => {
    e.preventDefault()
    setAnchorEl(null)
    
    // open edit box
    if( user.email === email ) {
      setOpenEdit(!openEdit)
    } else {
      alert('You cand edit this comment. Unauthorized user!!')
    }
  }
  
  // update comment
  const handleUpdate = e => {
    e.preventDefault()
    
    let userCommentUpdated = {
      user: username,
      email: email,
      avatar: user.photoURL,
      text: comment,
      timestamp: new Date()
    }

    //console.log(userComment._id)
    
    axios.post( '/comments/update/' + postId + '/' + commentId + '/', { userCommentUpdated } )
      .then( res => {
        console.log( 'handleUpdate comment',res.data )
      } )
      .catch( err => console.log( 'error', err ) ) 
      
      // close modal
      setAnchorEl(null)

      // close the comment edit box again
      setOpenEdit(!openEdit)
  }

  // modal opens
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  }
  // modal close
  const handleClose = () => {
    setAnchorEl(null);
  }

  useEffect(() => {}, [])
  
  return (
    <div>
      <div key={ commentId } className='post__comment'>
        
        {/* Show the actual comment text */}
        { openEdit ?
          '' : 
          <div>
            <Avatar src={ avatar }/>
            <p className='post__comment__text'>{ comment }</p> 
          </div>
        }

        {/* Open the edit input to update  */}
        {
          openEdit ?
          <form 
            ref={ node }
            onSubmit={ handleUpdate }>
            <input 
              id='updateComment2'
              type='text' 
              placeholder='write here'
              className='post__comment__text'
              value={ comment == null ? 'write it...' : comment } 
              onChange={ e => setComment(e.target.value) } 
            /> 
            <button type='submit'>Comment</button>
          </form>: <div ref={ node }></div>
        }

        {/* Open the moreHorizontal opener modal and hide it when user is comment*/}
        {openEdit 
          ? '' 
          :<IconButton aria-controls="post-comment-modal" aria-haspopup="true" onClick={ handleClick }>
            <MoreHoriz />
          </IconButton>
        }
        
        <Menu
          id="post-comment-modal"
          anchorEl={ anchorEl }
          keepMounted
          open={ Boolean(anchorEl) }
          onClose={ handleClose }
        >
          <MenuItem onClick={ () => handleDelete(commentId) }>
            <DeleteOutline />
            <div className='post__Menu__options'>Delete</div>
          </MenuItem>
          
          <MenuItem onClick={ handleEdit }>
            <Edit />
            <div className='post__Menu__options'>Edit</div>
          </MenuItem>
          
        </Menu>
      </div>
    </div>
  )
}

console.timeEnd('IsolatedComment start')

export default IsolatedComment
