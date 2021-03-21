import React from 'react'
import Story from './Story/Story'
import './StoryReel.css'

import story1 from '../../assets/story1.3.webp'
import story2 from '../../assets/story2.3.webp'
import story3 from '../../assets/story3.3.webp'

import avatar1 from '../../assets/avatar1.1.webp'
import avatar2 from '../../assets/avatar2.1.webp'
import avatar3 from '../../assets/avatar3.1.webp'

const StoryReel = () => {
  return (
    <div className='storyReel' >
      <Story
        image={story1}
        profileSrc={avatar1}
        title='Sonny Sangha'
      />
      <Story
        image={story2}
        profileSrc={avatar2}
        title='Rafeh Qazi '
      />
      <Story
        image={story3}
        profileSrc={avatar3}
        title='Nazariy Dumanskyy '
      />

    </div>
  )
}

export default StoryReel
