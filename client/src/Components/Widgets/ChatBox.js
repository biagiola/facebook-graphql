import React from 'react'
import { Send, Minimize, Close } from '@material-ui/icons';
import './Chat.css'

const ChatBox = ({ name, avatar }) => {
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
        <div>
          <Minimize style={{color: 'rgb(197 197 197)'}} fontSize='small' />
          <Close style={{color: 'rgb(197 197 197)'}} fontSize='small' />
        </div>
      </div>
      <div className='chat__dialog__messages'>

      </div>
      <div className="chat__dialog__sender">
        <input 
          type='text'
        />
        <Send style={{ color: '#1e54bf' }}/>
      </div>
    </div>
  )
}

export default ChatBox