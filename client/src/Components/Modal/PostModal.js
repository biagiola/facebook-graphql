import React, { useState } from 'react'
import { Avatar, makeStyles, Modal, IconButton, Button, TextField, Grid, Input } from '@material-ui/core'
import { PhotoLibrary } from '@material-ui/icons'
import { Close } from '@material-ui/icons'
import PostEmojiPicker from '../EmojiPicker/PostEmojiPicker'

import './PostModal.css'
  
/* position config */
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height: "310px",
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
/* modal styles */
const useStyles = makeStyles( theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    height: 240,
    backgroundColor: theme.palette.background.paper,
    border: '0px',
    borderRadius: '15px',
    outline: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  postModalForm: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'green',
  },
  top: {
    fontWeight: '700',
    fontSize: '1.2rem',
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eff2f5'
  },
  title: {
    display: 'inline-block',
  },
  middle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'space-between',
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  avatar: {
    padding: '10px'
  },
  name: {
    color: 'gray',
    padding: '10px'
  }
}));

function PostModal({ user, handleSubmit, open, setOpen,  input, setInput, handleImage }){
  const [modalStyle] = useState(getModalStyle)
  const classes = useStyles()
  const [toggleEmojiPicker, setToggleEmojiPicker] = useState(false)
  
  /* add emojis to the post text */
  const onEmojiClick = (event, emojiObject) => {
    setInput(input => input.concat(emojiObject.emoji))
  }
  
  return (
    <Modal className='postModal' open={ open } onClose={() => setOpen(false)} >
      <div style={ modalStyle } className={ classes.paper }>
      
        <form onSubmit={ handleSubmit }>
          <Grid 
            container 
            spacing={ 2 }
            direction="column"
            justify="space-between"
            alignItems="stretch"
          >
            <Grid item xs={ 12 }>
              <center className={ classes.top }>
                <div></div>
                <div className={ classes.title }>Create post</div>
                <div onClick={ () => setOpen(false) }>
                  <IconButton style={{ padding: '0px' }} >
                    <Close style={{ cursor: 'pointer' }} />
                  </IconButton>
                </div>
              </center>
            </Grid>  
            <Grid item xs={ 12 }>
              <center className={ classes.middle }>
                {/* avatar */}
                <div className={ classes.avatar }>
                  <Avatar src={ user.photoURL } />
                </div>
                {/* user name */}
                <div className={ classes.name }>
                  <h4>{ user.displayName }</h4>
                </div>
                
                {/* image upload */}
                <div>
                  <label className="custom-file-upload messageSender__option">
                    <PhotoLibrary style={{ color: 'green' }} />
                    <h3>Photo</h3>
                    <Input 
                      id="uploadImage"
                      type="file" 
                      onChange={ handleImage } 
                      className='postModal__filehandler' 
                      label="upload"
                    />
                  </label>
                </div>

                {/* emojis */}
                <div>
                  {<PostEmojiPicker 
                    toggleEmojiPicker={ toggleEmojiPicker }
                    setToggleEmojiPicker={ setToggleEmojiPicker }
                    onEmojiClick={ onEmojiClick }
                  />}
                </div>
                <div className="postModal__emoji">
                </div>
              </center>
            </Grid>
            <Grid item xs={ 12 }> 
              {/* textarea to the post */}
              <TextField
                id="outlined-multiline-static"
                label="What's in your mind"
                multiline
                autoFocus={ true }
                rows={ 6 }
                fullWidth
                variant="outlined"
                value={ input }
                onChange={ e  => setInput(e.target.value) }
              />
            
            </Grid>
            <Grid item xs={ 12 }>
              <div className="postModal__button__bgcolor">
                <Button className="postModal__button" type="submit">Send</Button>
              </div>
            </Grid>
          </Grid> 
        </form>
      </div>
    </Modal>
  )
}

export default PostModal
