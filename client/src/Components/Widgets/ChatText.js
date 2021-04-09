import React, { useState, useEffect, useRef } from 'react'
import './Chat.css'

const ChatText = ({ message: { text, user }, currentEmail, position }) => {

  //let element = document.getElementsByClassName("paragraph")[position];
  let element = document.getElementsByClassName("paragraph")[position];
  console.log('element is ', element)
  //element.scrollTop = element.scrollHeight;
  if(element){
    element.scrollIntoView()
  }
  /* 
  console.log('text', text)
  console.log('user', user)
  console.log('user.avatar', user.avatar) */

  let isSentByCurrentUser = false
  useEffect(() => {
    if(user.email == currentEmail) {
      isSentByCurrentUser = true;
    }
  }, [])
  
  return (
    isSentByCurrentUser 
      ? <p 
          key={Math.random()} 
          className='chat__sent__left paragraph'
        >{text}</p>
      : <p 
          key={Math.random()} 
          className='chat__sent__right paragraph'
        >{text}</p>
  )
}

export default ChatText
