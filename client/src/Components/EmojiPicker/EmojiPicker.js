import React, { useEffect } from 'react'
import { EmojiEmotions } from '@material-ui/icons'
import './EmojiPicker.css'
import Picker from 'emoji-picker-react'

function EmojiPicker ({ onEmojiClick, toggleEmojiPicker, setToggleEmojiPicker }) {
  useEffect(() => {
  }, [toggleEmojiPicker])

  return (
    <div 
      
      style={{ position: 'absolute' }}>
      <EmojiEmotions 
        onClick={ () => setToggleEmojiPicker(!toggleEmojiPicker) }
        style={{ 
          display: toggleEmojiPicker ? '' : 'none',
          position: 'relative', 
          right: '15px', 
          top: '5px', 
          color: '#4178F2'
        }} 
      />

      <div style={{ display: toggleEmojiPicker ? '' : 'none' , position: 'absolute', zIndex: 100, top: '35px', right: '10px'}}>
        <Picker 
          groupVisibility={{
            flags: false,
            symbols: false
          }}
          disableSearchBar={ true }
          onEmojiClick={ onEmojiClick } 
        /> 
      </div>
      
    </div>
  )
}

export default EmojiPicker
