import React, { useState, useEffect } from 'react'
import { Send, Minimize, Close } from '@material-ui/icons';
import './Chat.css'

const ChatBox = ({ name, avatar, handleChat }) => {
  const [recievedMessages, setRecievedMessages] = useState([])
  const [sentMessages, setSentMessages] = useState([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleMessage = (e) => {
    e.preventDefault()
    console.log(messages)
    setMessages([...messages, message])
    setMessage('')
  }

  return (
    <div className='chat__dialog'>
      {/* header */}
      <div className='chat__dialog__header'>
        {/* left */}
        <div style={{display: 'flex'}}>
          <img src={avatar}/>
          <div className='chat__dialog__name'>{name}</div>
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
        {
          messages.map( message => (
            <p key={Math.random()} className='chat__sent'>{message}</p>
          ))
        }
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