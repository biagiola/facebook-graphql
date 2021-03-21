import React, { useState, useEffect } from 'react'
import './Feed.css'
import MessageSender from '../MessageSender/MessageSender'
import Post from '../Post/Post'
import StoryReel from '../StoryReel/StoryReel'
import SkeletonPost from '../../skeletons/SkeletonPost'
import axios from '../../axios'
import { useStateValue } from '../../Store/StateProvider'
import { actionTypes } from '../../Store/reducers/Reducer'

console.time('feed start')

const Feed = () => {
  const [postsData, setPostsData] = useState([]) // posts comming from db
  const [currentPost, setCurrentPost] = useState([]) // post comming in realtime user interaction
  const [{ deletePostId }, dispatch] = useStateValue()
  
  // fetch the posts
  useEffect(() => {
    syncFeed()
  }, [])

  // filter post
  useEffect(() => {
    filterPost(deletePostId)

    // cleanup function
    return () => {
      dispatch({
        type: actionTypes.DELETE_POST,
        deletePostId: null
      })
    }
  }, [deletePostId])

  const syncFeed = () => {
    axios.get('posts/retrieve')
    .then( res => {
      setPostsData(res.data)
    })
    .catch( err => console.log(err))
  }

  // delete post from the dom
  const filterPost = id => {
    // for posts that already are in the db
    setPostsData( postsData.filter( postdata => (postdata._id !== id))) 
    // for posts that is generated in realtime
    setCurrentPost( currentPost.filter( currentdata => (currentdata._id !== id))) 
  }

  useEffect(() => {
    console.log('useEffect* postsData', postsData)
  }, [postsData])

  useEffect(() => {
    console.log('useEffect* currentPost', currentPost)
  }, [currentPost])

  return (
    <div className='feed' >
      
      <StoryReel />
      
      <MessageSender 
        currentPost={ 
          currentPost => setCurrentPost( old => [currentPost, ...old])
        } 
      />

      { postsData.length === 0 && [1,2,3,4,5].map((n) => <SkeletonPost key={n} theme="light" />) }
      
      {/*  newest post */}
      {/* {
        currentPost.length > 0 ?
        currentPost.map( entry => (
          <Post key={entry.timestamp}
            id={entry._id}
            avatar={entry.avatar}
            message={entry.text}
            like={entry.like}
            timestamp={entry.timestamp}
            imgName={entry.imgName}
            username={entry.user}
            email={entry.email}
            comments={entry.comments}
          /> 
        )) : ''
      } */}
      
      {/* data that already exists */}
      {/* {
        postsData.length > 0 ? postsData.map(entry =>  
          <Post key={entry.timestamp} 
            id={entry._id}
            setCurrentPost={ setCurrentPost }
            avatar={entry.avatar}
            message={entry.text}
            like={entry.like}
            timestamp={entry.timestamp}
            imgName={entry.imgName}
            username={entry.user}
            email={entry.email}
            comments={entry.comments}
          /> 
        ) : ''
      } */}
    </div>
  )
}

console.timeEnd('feed start')

export default Feed
