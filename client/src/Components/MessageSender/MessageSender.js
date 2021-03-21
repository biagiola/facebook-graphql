import React, { useEffect, useState } from 'react'
import './MessageSender.css'
import PostModal from '../Modal/PostModal'
import { Avatar } from '@material-ui/core'
import { Videocam, PhotoLibrary, InsertEmoticon } from '@material-ui/icons'
import { useStateValue } from '../../Store/StateProvider'
import axios from '../../axios'
import FormData from 'form-data'

const MessageSender = ({ currentPost }) => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  
  const [image, setImage] = useState(null)
  const [{ user }] = useStateValue()

  // upload the image
  const handleImage = e => {
    console.log('hangleImage called')
    console.log('e.target.files[0]', e.target.files[0])
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  // add post to db and dom
  const handleSubmit = e => {
    e.preventDefault()
    
    // close the modal
    setOpen(false)
    console.log('handleSubmit ', input)
    
    // post with image
    if (image) {
      const imgForm = new FormData()
      imgForm.append('file', image, image.name)

      console.log('image.name', image)
      console.log('image.name', image.name)

      axios.post('posts/upload/image', imgForm, {
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-type': `multipart/form-data; boundary=${imgForm._boundary}`,
        }
      }).then( res => {
        console.log(res.data)

        const postData = {
          user: user.displayName,
          email: user.email,
          imgName: res.data.filename,
          text: input,
          avatar: user.photoURL,
          like: false,
          timestamp: Date.now(),
          comments: []
        }
        console.log(postData)
        
        savePost(postData) // save post in the db
      })
    } 
    // post without image  
    else {
      const postData = {
        user: user.displayName,
        email: user.email,
        text: input,
        avatar: user.photoURL,
        like: false,
        timestamp: Date.now(),
        comments: []
      }
      
      savePost(postData) // save post in the db
    }
    // reset residual values for another upload
    
    setInput('')
    setImage(null)
  }

  // save it into db
  const savePost = postData => {
    try {
      // add the post to db
      axios.post('posts/upload/post', postData)
        .then(resp => {
         console.log('post saved resp:', resp)
  
         postData._id = resp.data // add the id comming from db
  
         currentPost(postData) // add post for realtime render
  
         currentPost._id = resp.data
  
        })
    } catch(error) {
      console.log('Cannot rendered post.!!')
    }
  }

  useEffect(() => {
    //console.log('MessageSender postsData', postsData)
  }, [open])

  return (
    <div className='messageSender' >
      <div className="messageSender__top">
        <Avatar src={ user.photoURL } />
          {/* input that open the modal */}
          <input 
            id="openModal"
            type="text" 
            className='messageSender__input' 
            placeholder="What's on your mind?" 
            onClick={ () => setOpen(true) } 
          />
          {/* Modal according to user input click */}
          <PostModal 
            user={ user }
            open={open} 
            setOpen={setOpen} 
            handleSubmit={handleSubmit} 
            input={input}
            setInput={setInput}
            handleImage={ handleImage }
          />
      </div>

      <div className="messageSender__bottom">
        <div className="messageSender__option">
          <Videocam style={{ color: 'red' }} />
          <h3>Live Video</h3>
        </div>
        <div className="messageSender__option" onClick={ () => setOpen(true) }>
          <PhotoLibrary style={{ color: 'green' }} />
          <h3>Photo/Video</h3>
        </div>
        <div className="messageSender__option">
          <InsertEmoticon style={{ color: 'orange' }} />
          <h3>Feeling/Activity</h3>
        </div>
      </div>

    </div>
  )
}

export default MessageSender
