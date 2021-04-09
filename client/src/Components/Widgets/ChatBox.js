import React, { useState, useEffect } from 'react'

import ChatHeader from './ChatHeader'
import ChatText from './ChatText'
import ChatSend from './ChatSend'
import './Chat.css'

const ChatBox = ({ 
  messages, message, currentEmail, destinyEmail,
  setMessage, sendMessage, typeChat }) => {

  console.log('messages',messages)



  return (
    <div className='chat__dialog'>
      <div className="chat__header">
        <ChatHeader 
          avatar={message}
        />
      </div>
      <div className='chat__dialog__messages'>
        { messages.length > 0  ?
          messages.map( message => (
            <ChatText 
              key={Math.random()}
              message={message} 
              currentEmail={currentEmail}
              position={messages.length - 1}
            />
          ))
          : ''
        }
      </div>
      <div className='chat__dialog__input'>
        <ChatSend 
          message={message} 
          setMessage={setMessage} 
          sendMessage={sendMessage}
          destinyEmail={destinyEmail}
        />
      </div>
    </div>
  )
}

export default ChatBox

//handleChat, socket