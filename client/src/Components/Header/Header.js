import React, { useState, useEffect } from 'react'
import { Search, Home, Flag, SubscriptionsOutlined, StorefrontOutlined, SupervisedUserCircle, Add, Forum, NotificationsActive, ExitToApp, ExpandMore } from '@material-ui/icons'
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core'
import { useStateValue } from '../../Store/StateProvider'
import { auth } from '../../firebase'
import { actionTypes } from '../../Store/reducers/Reducer'
import fbCircle from '../../assets/240px-Facebook_Logo_circle(2019).png'
import './Header.css'

const Header = () => {
  const [{ user }, dispatch] = useStateValue()
  const [anchorEl, setAnchorEl] = useState(null) 

  //console.log('header user', user)

  // modal opens
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  }
  // modal close
  const handleClose = () => {
    setAnchorEl(null);
  }

  const signOut = () => {
    console.log('signOut')
    auth.signOut()
      .then(result => {
        //console.log('user logout', result)

        dispatch({
          type: actionTypes.SET_USER,
          user: null
        })

        localStorage.removeItem('user')

      }).catch(error => alert(error.message))
  }

  return (
    <div className='header'>
      {/* left */}
      <div className="header__left">
        <div className="header__logo">
          <img src={fbCircle} alt="Facebook logo" />
        </div>

        <div className="header__input">
          <Search />
          <input placeholder='Search Facebook' type="text" />
        </div>
      </div>
      
      {/* center */}
      <div className="header__center">
        <div className="header__option header__option--active">
          <Home fontSize='large' />
        </div>
        <div className="header__option">
          <Flag fontSize='large' />
        </div>
        <div className="header__option">
          <SubscriptionsOutlined fontSize='large' />
        </div>
        <div className="header__option">
          <StorefrontOutlined fontSize='large' />
        </div>
        <div className="header__option">
          <SupervisedUserCircle fontSize='large' />
        </div>
      </div>

      {/* right */}
      <div className="header__right">
        <div className="header__info">
          <Avatar src={ user.photoURL } />
          <h4>{ user.displayName }</h4>
        </div>
        <div className="header__right__options">
          <IconButton>
            <Add />
          </IconButton>

          <IconButton >
            <Forum />
          </IconButton>

          <IconButton>
            <NotificationsActive />
          </IconButton>

          <IconButton aria-controls="header-modal" aria-haspopup="true" onClick={handleClick}>
            <ExpandMore />
          </IconButton>

          {/* logout modal */}
          <Menu
            id="header-modal"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={signOut}>
              <ExitToApp />
              <div className='post__Menu__options'>Log out</div>
            </MenuItem>
            
          </Menu>
        </div>
      </div>
    </div>
  )
}

export default Header
