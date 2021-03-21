import React, { useState, useEffect, useRef } from 'react'
import axios from '../../../axios'
import { Avatar } from '@material-ui/core'
import { EmojiEmotions } from '@material-ui/icons'
import EmojiPicker from '../../EmojiPicker/EmojiPicker'
import './PostComments.css'
import { useStateValue } from '../../../Store/StateProvider'


const CommentsEditForm = ({ postId, /* user,  email,  avatar, */ text, setCurrentComments }) => {
  const [comment, setComment] = useState('') // individual comment that is sent to db
  const [toggleEmojiPicker, setToggleEmojiPicker] = useState(false)
  const node = useRef()
  const [{ user }] = useStateValue()

  // add comment to the db and dom
  const handleComments = e => {
    e.preventDefault()

    let userComment = {
      user: user.displayName,
      email: user.email,
      avatar: user.photoURL,
      text: comment,
      timestamp: new Date()
    }

    axios.post('/comments/add/' + postId, { userComment })
      .then( resp => {
        console.log('then axios handlecomments')

        console.log('resp.data._id', resp.data._id)
        console.log('resp.data.length', resp.data.length)

        // comment id comming from the db
        userComment._id = resp.data._id
        
        setCurrentComments(oldComments => [...oldComments, userComment]) // this is for the dom

        setComment('')
        
      })
      .catch( err => console.log( 'error', err ) )
  }

  // listening when is clicked
  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [])

  // add emojis
  const onEmojiClick = (event, emojiObject) => {
    console.log('onEmojiClick')
    setComment( comment => comment.concat(emojiObject.emoji))
  }

  // toggle emoji picker
  const handleClick = e => {
    if (node.current.contains(e.target)) {
      setToggleEmojiPicker(true)
      return;
    }
    // outside click 
    setToggleEmojiPicker(false)
  }

  return (
    <div>
      {/* add comment */}
      <form onSubmit={ handleComments }>
        <Avatar src={ user.photoURL } className='post__comments__avatar'/>
        <div className='post__comments__send'>
          <input 
            id={ postId + 'comment' }
            type='text' 
            placeholder='Write comment' 
            value={ comment } 
            onChange={ e => setComment(e.target.value) } 
          />
          
          <div onClick={ () => setToggleEmojiPicker(!toggleEmojiPicker) }>
            <EmojiEmotions 
              style={{ 
                display: !toggleEmojiPicker ? '' : 'none',
                color: 'grey', 
                cursor: 'pointer',
                position: 'relative',
                left: '9px', 
                top: '5px' }}/>
          </div>
          
          <div ref={ node } style={{ color: 'grey', cursor: 'pointer' }}>
            <EmojiPicker
              toggleEmojiPicker={ toggleEmojiPicker }
              setToggleEmojiPicker={ setToggleEmojiPicker }
              onEmojiClick={ onEmojiClick }
            />
          </div>
        </div>

        <button type='submit'>Comment</button>
      </form>
    </div>
  )
}

export default CommentsEditForm
