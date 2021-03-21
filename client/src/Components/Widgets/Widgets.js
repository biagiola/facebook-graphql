import React, { useState, useEffect } from 'react'
import { Search, MoreHoriz, ToggleOn, WifiOff } from '@material-ui/icons'
import { IconButton, Menu, MenuItem } from '@material-ui/core'
import { useStateValue } from '../../Store/StateProvider'
import ChatBox from './ChatBox'
import './Chat.css'

import io from "socket.io-client"
const ENDPOINT = 'http://localhost:9000/'
let socket

let usersExamples = [
  {
    id: 0,
    username: 'David Biagiola',
    avatar: 'https://avatars.githubusercontent.com/u/41311088?s=460&u=cb78401b64bd7176ea16502ced22aeac939c907e&v=4',
    active: true
  },
  {
    id: 1,
    username: 'Andrea Rodriguez',
    avatar: 'https://avatars.githubusercontent.com/u/75449997?s=400&u=4aa88a70ba6fb1412c93a11a823a18d23f4c56b1&v=4',
    active: true
  },
  {
    id: 2,
    username: 'John Muller',
    avatar: 'https://avatars.githubusercontent.com/u/80167324?s=400&u=d5b654c14fa686418cc9f02bd26f21fc9000d1d7&v=4',
    active: true
  },
  {
    id: 3,
    username: 'José Abatte',
    avatar: 'https://avatars.githubusercontent.com/u/68688806?s=400&u=d73f6e3367a271603bc3f7d5dfc5153b149f6239&v=4',
    active: true
  },
  {
    id: 4,
    username: 'Carla Smith',
    avatar: 'https://avatars.githubusercontent.com/u/73504235?s=400&u=465e0b1ab02836b17911c31c1d66871dc99b4516&v=4',
    active: true
  },
  {
    id: 5,
    username: 'Julio Bernal',
    avatar: 'https://avatars.githubusercontent.com/u/31912784?s=400&u=a4fa6898f17a27cf5b9889eab03bd72793044af6&v=4',
    active: true
  },
]

const Widgets = () => {
  const [{ user }, dispatch] = useStateValue()
  const [anchorEl, setAnchorEl] = useState(null) 
  const [openChat, setOpenChat] = useState(false)
  const [open, setOpen] = useState(false)
  const [userSelectedId, setUserSelectedId] = useState(null)
  const [name, setName] = useState('David')
  const [room, setRoom] = useState('House')
  const [users, setUsers] = useState('');
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

/*   useEffect(() => {
    console.log('header socket init')
    socket = io(ENDPOINT)
  }, [])

  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ])
    });
    
    // socket.on("roomData", ({ users }) => {
    //  setUsers(users);
    //}); 
  }, []) */

  const changeChatStatus = () => {
    console.log('changeChatStatus')
    // close modal
    setAnchorEl(null) 
    setOpen(!open)

    socket = io(ENDPOINT)

    socket.emit('join', { name, room }, (error) => {
      console.log('header socket join')
      if(error) {
        alert(error)
      } else {
        console.log('it works')
      }
    })

    socket.on('message', message => {
      console.log('response from the server', message)
      setMessages(messages => [ ...messages, message ])
    });
  }

  const handleChat = (userId) => {
    setOpenChat(true)
    setUserSelectedId(userId)
  }

  return (
    <div style={{ backgroundColor: '#F0F2F5', marginTop: '10px', display: 'flex', flexDirection: 'column' }}>
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

        {open ? <div className="chat__box">
          { usersExamples.map( user => (
            <div 
              key={user.id}
              className='chat__box__user' 
              onClick={() => handleChat(user.id)}>
              {/* Avatar */}
              <div className='chat__box__avatar'>
                <img src={user.avatar} className='user__avatar'/>
                <div className="user__status"></div>
              </div>
              {/* Name */}
              <div className='chat__box__name'>{user.username}</div>
              {openChat && user.id == userSelectedId ? 
          <ChatBox  
            key={user.id} 
            name={user.username}
            avatar={user.avatar}
          /> : 
          <div></div>
        }
              
            </div>
            ))}
          </div> : 
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
