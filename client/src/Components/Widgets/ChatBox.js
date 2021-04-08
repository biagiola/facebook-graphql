import React, { useState, useEffect } from 'react'
import { Send, Minimize, Close } from '@material-ui/icons'
import { useStateValue } from '../../Store/StateProvider'
import './Chat.css'

const ChatBox = (
  { user0, user1, handleChat, socket, messagesRecieve, isReciever }) => {
  const [{ user }] = useStateValue()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  console.log('isReciever', isReciever)

  const handleMessage = (e) => {
    e.preventDefault()
    
    setMessages(messages => [ ...messages, message ])
    //setMessage('')
  }

  // send message to db
  useEffect(() => {
    //console.log('socketUserLogged', socketUserLogged)

    let data = {
      user0, 
      user1,
      messages
    }
    console.log(data)

    socket.emit('mensajito', (data), (error) => {
      if(error) {
        alert(error)
      } else {
        setMessage('')
      }
    })
  }, [messages])

  return (
    <div className='chat__dialog'>
      {/* header */}
      <div className='chat__dialog__header'>
        {/* left */}
        <div style={{display: 'flex'}}>
          <img src={isReciever ? user0.avatar : user1.avatar}/>
          <div>
            <div className='chat__dialog__name'>{isReciever ? user0.email : user1.email}</div>
            <div className='chat__dialog__active'>
              <div className='active__now__green'></div>
              <div className='active__now'>Active now</div>
            </div>
          </div>
        </div>
        {/* right */}
        <div style={{ display: 'flex', flexDirection: 'row'}}>
          <div style={{ cursor: 'pointer'}}>
            <Minimize style={{color: 'rgb(197 197 197)'}} fontSize='small' />
          </div>
          <div onClick={() => handleChat(null, 'close')} style={{ cursor: 'pointer'}}>
            <Close style={{color: 'rgb(197 197 197)'}} fontSize='small' />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className='chat__dialog__messages'>
        {/* left */}
        <div className="chat__dialog__left">
          {
            messages.map( message => (
              <p key={Math.random()} className='chat__sent__left'>{message}</p>
            ))
          }
        </div>

        {/* right */}
        <div className="chat__dialog__right">
          {
            messagesRecieve ? messagesRecieve.map( message => (
              <p key={Math.random()} className='chat__sent__right'>{message}</p>
            )) : ''
          } 
        </div>
      </div>

      {/* Sender */}
      <form className="chat__dialog__sender" onSubmit={handleMessage}>
        {/* input text */}
        <input 
          type='text'
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        {/* button */}
        <button>
          <Send style={{ color: '#1e54bf' }}/>
        </button>
      </form>
    </div>
  )
}

export default ChatBox