import React, { useState, useEffect } from 'react'
import { Search, MoreHoriz, ToggleOn, WifiOff } from '@material-ui/icons'
import { IconButton, Menu, MenuItem } from '@material-ui/core'
import { useStateValue } from '../../Store/StateProvider'
import ChatBox from './ChatBox'
import { auth } from '../../firebase'
import { actionTypes } from '../../Store/reducers/Reducer'
import './Chat.css'

// socket client config
import io from 'socket.io-client'
const ENDPOINT = 'http://localhost:9000/'
let socket

const Widgets = () => {
  const [{ user, socketStatus }, dispatch] = useStateValue()
  const [anchorEl, setAnchorEl] = useState(null)      // modal
  const [open, setOpen] = useState(false)             // open/close chat list
  const [openChat, setOpenChat] = useState(false)     // chat box

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  
  const [onlineUsers, setOnlineUsers] = useState('')              // users in the chat (comming from the socket backend)
  const [userSelectedId, setUserSelectedId] = useState(null)      // user clicked from the chat list
  
  const [socketUserLogged, setSocketUserLogged] = useState(null)  // all the socket data from the user logged
  const [chatMessages, setChatMessages] = useState([])            // list of messages

  const [newMessage, setNewMessage] = useState(false)
  

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

  // add users to socket
  useEffect(() => {
    // create the socket
    socket = io(ENDPOINT)

    console.log(user);

    let name = user.displayName 
    let email = user.email
    let avatar = user.photoURL
    let room = 'facebookapp'
    // add new user - sender 
    socket.emit('join', { name, email, avatar, room }, (error) => {
      if(error) {
        alert(error)
      } 
    })
  }, [ENDPOINT])

  // online users and messages from chat
  useEffect(() => {
    // see all the users in the socket
    socket.on('roomData', ({ usersAvaible }) => {
      setOnlineUsers(usersAvaible)
    })

    // recieve messages and user data from the chat
    socket.on('dataFromSocket', (message) => {
      console.log('dataFromSocket **', message)
      setChatMessages(message)

      setMessages(messages => [ ...messages, message ])

      // check is there is a new message
      if(message.destinyEmail == user.email && message.text.length > 0) {
        console.log('tenes un nuevo mensaje', )
        setNewMessage(true)
        setOpenChat(true)

        //handleChat(data.user1.id, 'open')
      }
      
    })
  }, [])
  
  /* mensajito */
  const sendMessage = (e, destinyEmail) => {
    e.preventDefault()
    
    if(message) {
      socket.emit('sendMessage', {message, destinyEmail}, () => setMessage(''));
    }
  }

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
            {/* online users - select a user to chat */}
            {onlineUsers.length > 0 ? onlineUsers.map( onlineUser => (
              // show all users except the current logged
              ( onlineUser.email != user.email ?
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

                  {/* open to chat with */}                
                  {(openChat && onlineUser.id == userSelectedId) ? 
                    <ChatBox  
                      key={onlineUser.id + 'chat'} 
                      messages={messages}
                      message={message}
                      currentEmail={user.email}
                      destinyEmail={onlineUser.email}
                      setMessage={setMessage}
                      sendMessage={sendMessage}
                      typeChat={'clickedChat'}
                    /> : <div></div>
                  }
                </div>
                : ''
              )
            )) : ''} 

            {/* open if there is a new message */}
            {newMessage && openChat ? onlineUsers.map( onlineUser => (
                (onlineUser.email == chatMessages.destinyEmail) 
                  ? <div key={chatMessages.user.id + 'true'}>
                      <ChatBox  
                        key={onlineUser.id + 'newMessage'} 
                        messages={messages}
                        message={message}
                        currentEmail={user.email}
                        destinyEmail={chatMessages.destinyEmail}
                        setMessage={setMessage}
                        sendMessage={sendMessage}
                        typeChat={'commingChat'}
                      />
                    </div> 
                  : ''
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
{/*
  <div>
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
  </div> 

  // send message to db
  useEffect(() => {
    //console.log('socketUserLogged', socketUserLogged)
    socket.emit('mensajito', (), (error) => {
      if(error) {
        alert(error)
      } else {
        setMessage('')
      }
    })
  }, [messages])

*/}