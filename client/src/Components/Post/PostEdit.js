import React, { useState , useEffect, useRef } from 'react'
import { EmojiEmotions } from '@material-ui/icons'
import Picker from 'emoji-picker-react'
import axios from '../../axios'
import Message from './Message'
import './Post.css'
import { useStateValue } from '../../Store/StateProvider'
import { actionTypes } from '../../Store/reducers/Reducer'

const PostEdit = ({ message, id, username, email, imgName, avatar, timestamp, showEditBox, setShowEditBox }) => {
  const [toggleEmojiPicker, setToggleEmojiPicker] = useState(false)
  const [messageCopy, setMessageCopy] = useState(message)
  const [newMessage, setNewMessage] = useState(message) // input message

  const [{}, dispatch] = useStateValue()

  const node = useRef()

  const handleClickInsideOutside = e => {
    if (node.current.contains(e.target)) {
      // inside click
      setShowEditBox(true)
      return
    }
    // outside click 
    setToggleEmojiPicker(false) // important when the user doesnt close the emoji picker
    setShowEditBox(false)
  }

  // click outside/inside
  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", handleClickInsideOutside)
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickInsideOutside)
    };
  }, [])

  useEffect(() => {
    console.log('showEditBox',showEditBox)
  }, [showEditBox])

  // add emojis
  const onEmojiClick = (event, emojiObject) => {
    setNewMessage( newMessage => newMessage.concat(emojiObject.emoji))
  }

  // copy of post text
  useEffect(() => {
    if(message.length > 0) setNewMessage(message)
  }, [])

  // update post
  const handleUpdate = e => {
    e.preventDefault()

    let postUpdated = {
      user: username,
      email: email,
      imgName: imgName,
      avatar: avatar,
      text: newMessage,
      comments: [],
      timestamp: new Date()
    }
    axios.post( 'posts/update/' + id + '/', { postUpdated } )
      .then( res => {
        console.log( 'handleUpdate comment',res.data )
      } )
      .catch( err => console.log( 'error', err ) ) 

    // close the edit box
    setShowEditBox(!showEditBox)
    
    // set copy of last message edited
    setMessageCopy(newMessage)

    dispatch({
      type: actionTypes.OPEN_EDIT_POST_BOX,
      openEditPostBox: {
        id: id,
        show: true,
        text: newMessage
      }
    })
  }

  return (
    <div>
      <Message 
        messageCopy={ messageCopy }
        postId={ id }
      />
      
      {showEditBox ? 
        <form 
          ref={ node } 
          onSubmit={ handleUpdate } 
          className='post__update__form'>

          <div className='post__update__inputBox'>
            <input 
              id={ id + 'post'}
              type='text' 
              placeholder='write here'
              className='post__update__text'
              value={ message === null ? 'write it...' :  newMessage } 
              onChange={ e => setNewMessage(e.target.value) } 
            /> 
            <EmojiEmotions 
              style={{ display: toggleEmojiPicker ? 'none' : '' }}
              className='post__update__emojiToggler'
              onClick={ () => setToggleEmojiPicker(!toggleEmojiPicker) }
            />
          </div>
          <button type='submit' className='post__update__button'>Update</button>
          {
            toggleEmojiPicker ? 
              <div>
                <EmojiEmotions 
                  style={{ display: !toggleEmojiPicker ? 'none' : '' }}
                  className='post__update__emojiTogglerCliked'
                  onClick={ () => setToggleEmojiPicker(!toggleEmojiPicker) }
                />
                <div className='post__update__emojiPicker'>
                  <Picker 
                    groupVisibility={{
                      flags: false,
                    }}
                    disableSkinTonePicker={true}
                    disableSearchBar={true}
                    id="pickerEmoji"
                    toggleEmojiPicker={ toggleEmojiPicker }
                    onEmojiClick={ onEmojiClick } 
                  />
                </div>
              </div>  
            : <div></div>
          }
        </form> 
        : <div ref={ node }></div>
      }
    </div>
  )
}

export default PostEdit