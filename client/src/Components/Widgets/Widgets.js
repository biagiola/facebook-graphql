import React, { useState, useEffect } from 'react'
import { Search, MoreHoriz, ToggleOn, WifiOff } from '@material-ui/icons'
import { IconButton, Menu, MenuItem } from '@material-ui/core'
import { useStateValue } from '../../Store/StateProvider'
import ChatBox from './ChatBox'
import { auth } from '../../firebase'
import { actionTypes } from '../../Store/reducers/Reducer'
import './Chat.css'

import io from "socket.io-client"
const ENDPOINT = 'http://localhost:9000/'
let socket

const Widgets = () => {
  const [{ user, socketStatus }, dispatch] = useStateValue()
  const [anchorEl, setAnchorEl] = useState(null) 
  const [openChat, setOpenChat] = useState(false)
  const [open, setOpen] = useState(false)
  const [userSelectedId, setUserSelectedId] = useState(null)
  const [users, setUsers] = useState('')
  const [room, setRoom] = useState('facebookapp')

  // modal opens
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  }
  // modal close
  const handleClose = () => {
    setAnchorEl(null);
  }

  const changeChatStatus = () => {
    // close modal
    setAnchorEl(null) 
    // close chat users
    setOpen(!open)
  }

  useEffect(() => {
    console.log('open, user useEffect', open, user)
    console.log('user.id', user.id)
    // create the socket
    socket = io(ENDPOINT)

    let name = user.displayName
    let email = user.email
    let avatar = user.photoURL
    console.log('user changeChatStatus', user)

    /* add new user */
    socket.emit('join', { name, email, avatar, room }, (error) => {
      console.log('header socket join')
      if(error) {
        alert(error)
      } else {
        console.log('it works')
      }
    })
  }, [ENDPOINT])

  useEffect(() => {
    /* set a new room */
    socket.on("roomData", ({ users }) => {
      console.log('roomData, users', users)
      setUsers(users);
    });

    // recieve that message
    socket.on("probando", ( data ) => {
      console.log('probando, message**', data)
    })

  }, [])

  const handleChat = (userId, stage) => {
    console.log(stage)
    if (stage == 'open') {
      setOpenChat(true)
    } 
    if (stage == 'close') {
      setOpenChat(false)
    }
    
    if (userSelectedId == null) {
      setUserSelectedId(userId)
    } else {
      setUserSelectedId(null)
    }
  }

  // logout
  useEffect(() => {
    console.log('socketStatus', socketStatus)
    if (socketStatus === true) {
      auth.signOut()
      .then(result => {
        console.log('socketStatus', socketStatus)

        // remove user from local storage
        localStorage.removeItem('user')  

        dispatch({
          type: actionTypes.SET_USER,
          user: null
        })

        socket.emit('cerrar')
        socket.off()  

      }).catch(error => alert(error.message))
    }
  }, [socketStatus])

  return (
    <div style={{ backgroundColor: '#F0F2F5', marginTop: '10px', display: 'flex', flexDirection: 'column' }}>
      {/* <div>
        <iframe 
          title='oktanaPage'
          src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fdiscord&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=false&hide_cover=false&show_facepile=true&appId" 
          width="340" 
          height="400" 
          style={{border:"none", overflow:"hidden"}} 
          scrolling="no" 
          frameBorder="0" 
          allowtransparency="true" 
          allow="encrypted-media">
        </iframe>
      </div> */}
      
      <div className='chat__divader'></div>

      {/* chat */}
      <div className='chat'>
        {/* header */}
        <div className="chat__header">
          {/* left */}
          <div className='chat__header__left'>
            <div style={{color: 'rgb(82 82 82)'}}>Contacts</div>
          </div>
          {/* right */}
          <div className='chat__header__right'>
            <IconButton >
              <Search style={{ color: 'grey' }} />
            </IconButton>
            <IconButton aria-controls="header-modal" aria-haspopup="true" onClick={handleClick}>
              <MoreHoriz style={{ color: 'grey' }} />
            </IconButton>
          </div>
          {/* menu - change chat status */}
          <Menu
            id="header-modal"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={changeChatStatus}>
              <ToggleOn />
              <div className='post__Menu__options'>On/Off</div>
            </MenuItem>
          </Menu>
        </div>

        {!open ? 
          <div className='chat__box'>
            {/* online users */}
            {users.length > 0 ? users.map( onlineUser => (
              <div key={onlineUser.id}>
                <div 
                  className='chat__box__user' 
                  onClick={() => handleChat(onlineUser.id, 'open')}>
                  {/* Avatar */}
                  <div className='chat__box__avatar'>
                    <img src={onlineUser.avatar} className='user__avatar'/>
                    <div className="user__status"></div>
                  </div>
                  {/* Name */}
                  <div className='chat__box__name'>{onlineUser.name}</div>
                </div>
                {/* Chat with */}
                {  }
                {openChat && onlineUser.id == userSelectedId ? 
                  <ChatBox  
                    key={onlineUser.id + 'chat'} 
                    id={onlineUser.id}
                    name={onlineUser.name}
                    avatar={onlineUser.avatar}
                    email={onlineUser.email}
                    handleChat={handleChat}
                    socket={socket}
                    socketStatus={socketStatus}
                  /> : 
                  <div></div>
                }
              </div>
            )) : ''} 
          </div> 
          : 
          <div className='chat__disconnected' onClick={changeChatStatus}>
            <div>Your're offline</div>
            <WifiOff style={{ color: '#1e54bf', paddingLeft: '5px'}} />
          </div>
        }
      </div>
    </div>
  )
}

export default Widgets
