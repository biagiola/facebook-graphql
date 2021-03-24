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
socket = io(ENDPOINT)

const Widgets = () => {
  const [{ user, socketStatus }, dispatch] = useStateValue()
  const [anchorEl, setAnchorEl] = useState(null) 
  const [openChat, setOpenChat] = useState(false)
  const [open, setOpen] = useState(false)
  const [userSelectedId, setUserSelectedId] = useState(null)
  const [users, setUsers] = useState('')
  //const [name, setName] = useState('David')
  const [room, setRoom] = useState('facebookapp')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

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
    
    /* set a new room */
    socket.on("roomData", ({ users }) => {
      console.log('roomData, users', users)
      setUsers(users);
    });
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

        socket.emit('disconnect')
        /* socket.emit('perro') */
        socket.off()  

      }).catch(error => alert(error.message))
    }

    return() => {
      // disconnect user from the chat
      //console.log('disconnected was executed, widgets')
      
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

        {open ? 
          <div className='chat__box'>
            {/* online users */}
            {users.length > 0 ? users.map( user => (
              <div key={user.id}>
                <div 
                  className='chat__box__user' 
                  onClick={() => handleChat(user.id, 'open')}>
                  {/* Avatar */}
                  <div className='chat__box__avatar'>
                    <img src={user.avatar} className='user__avatar'/>
                    <div className="user__status"></div>
                  </div>
                  {/* Name */}
                  <div className='chat__box__name'>{user.name}</div>
                </div>
                {/* Chat with */}
                {openChat && user.id == userSelectedId ? 
                  <ChatBox  
                    key={user.id + 'chat'} 
                    name={user.username}
                    avatar={user.avatar}
                    handleChat={handleChat}
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
