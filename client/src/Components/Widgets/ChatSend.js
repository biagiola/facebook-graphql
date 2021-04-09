import React from 'react'
import { Send } from '@material-ui/icons'
import './Chat.css'

const ChatSend = ({ setMessage, sendMessage, message, destinyEmail }) => (
  <form className="chat__dialog__sender" onSubmit={e => sendMessage(e, destinyEmail)}>
    <input 
      type='text'
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
    />
    <button><Send style={{ color: '#1e54bf' }}/></button>
  </form>
)

export default ChatSend

{/* 
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
    />
    <button onClick={e => sendMessage(e)}>Send</button>
  </form> 

  //onChange={e => setMessage(e.target.value)}

*/}
