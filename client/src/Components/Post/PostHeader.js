import React from 'react'
import moment from 'moment'
import { Avatar, Button } from '@material-ui/core'
import { MoreHoriz } from '@material-ui/icons'

const PostHeader = ({ username, avatar, timestamp, handleClick }) => {
  return (
    <div className="post__top">
      <div className="post__top__left">
        <Avatar src={ avatar } className='post__avatar' />
        <div className="post__topInfo">
        <h3>{ username }</h3>
          <p>{ moment(moment(new Date(parseInt(timestamp)).toUTCString()).format("YYYYMMDD"), "YYYYMMDD").fromNow() }</p>
          <p>{ moment( new Date(parseInt(timestamp)).toUTCString() ).format('YYYY-MM-DD') }</p>
        </div>
      </div>
      <div >
        <Button aria-controls="simple-menu2" aria-haspopup="true" onClick={ handleClick }>
          <MoreHoriz className="post__top__right"/>
        </Button>
      </div>
    </div>
  )
}

export default PostHeader
