import React from 'react'
import { useStateValue } from '../../Store/StateProvider'
import { Minimize, Close } from '@material-ui/icons'
import './Chat.css'

const ChatHeader = () => {
  const [{ user }] = useStateValue()

  return (
    <div className='chat__dialog__header'>
      <div style={{display: 'flex'}}>
        <img src={user.photoURL}/>
        <div>
          <div className='chat__dialog__name'>{user.displayName}</div>
          <div className='chat__dialog__active'>
            <div className='active__now__green'></div>
            <div className='active__now'>Active now</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
        <div style={{ cursor: 'pointer'}}>
          <Minimize style={{color: 'rgb(197 197 197)'}} fontSize='small' />
        </div>
        <div /* onClick={() => handleChat(null, 'close')} */ style={{ cursor: 'pointer'}}>
          <Close style={{color: 'rgb(197 197 197)'}} fontSize='small' />
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
