import React, { useState, useEffect } from 'react'
import { Avatar, Button, Menu, MenuItem } from '@material-ui/core'
import { Edit, DeleteOutline } from '@material-ui/icons'
import PostEdit from './PostEdit'
import axios from '../../axios'
import { useStateValue } from '../../Store/StateProvider'
import { actionTypes } from '../../Store/reducers/Reducer'
import PostHeader from './PostHeader'


const PostMenu = ({ id, username, email, message, imgName, avatar, timestamp }) => {
  const [{ user }, dispatch] = useStateValue()
  const [anchorEl, setAnchorEl] = useState(null) // elements of the modal
  const [showEditBox, setShowEditBox] = useState(false)
  
  // modal opens
  const handleClick = event => { 
    setAnchorEl(event.currentTarget)
  }
  // modal close
  const handleClose = () => {
    setAnchorEl(null);
  }

  // delete post
  const handleDelete = () => {
    setAnchorEl(null) 

    if( user.email === email ) {
      // delete it from the DB
      axios.delete( 'posts/delete/' + id )
        .then( res => {
          console.log( res.data )

          if(res.data.value === true) {
            // delete it from the DOM
            dispatch({
              type: actionTypes.DELETE_POST,
              deletePostId: res.data.id 
            })

            return true
          }
        })
        .catch( err => console.log( 'error', err ) )
      
    } else {
      alert('You can delete this. Unauthorized user!!')
      return false
    } 
    // close the card options
    
  }

  // open the edit box
  const handleEdit = e => {
    e.preventDefault()
    // close modal
    setAnchorEl(null)
    // toggle edit post box
    if ( user.email === email ) {
      setShowEditBox(!showEditBox) 
    } else {
      alert('You can Edit this. Unauthorized user!!')
    }
  }

  return (
    <div>
      {/* Options Menu */}
      <Menu
        id="simple-menu2"
        anchorEl={ anchorEl }
        keepMounted
        open={ Boolean(anchorEl) }
        onClose={ handleClose } 
      >
        <div onClick={ handleDelete }>
          <MenuItem>
            <DeleteOutline/>
            <div className='post__Menu__options'>Delete</div>
          </MenuItem>
        </div>

        <div onClick={ handleEdit }>
          <MenuItem >
            <Edit />
            <div className='post__Menu__options'>Edit</div>
          </MenuItem>
        </div>
      </Menu>

      {/* Post Header */}
      <PostHeader 
        username={ username }
        avatar={ avatar }
        timestamp={ timestamp }
        handleClick={ handleClick }
      />

      {/* Edit Post */}
      <PostEdit
        id={ id }
        username={ username }
        email={ email }
        avatar={ user.photoURL }
        message={ message }
        imgName={ imgName }
        timestamp={ timestamp }
        showEditBox={ showEditBox } 
        setShowEditBox={ setShowEditBox }
      />
    </div>
  )
}

export default PostMenu


