import React from 'react'
import './Sidebar.css'
import SidebarRow from './SidebarRow/SidebarRow'
import covidIcon from '../../assets/covidLogoLeft.png'
import friendsIcon from '../../assets/friendsLogoLeft.png'
import groupsIcon from '../../assets/groupsLogoLeft.png'
import messengerIcon from '../../assets/messengerLogoLeft.png'
import marketplaceIcon from '../../assets/marketplaceLogoLeft.png'
import pagesIcon from '../../assets/pagesLogoLeft.png'
import videoIcon from '../../assets/videoLogoLeft.png'
import { useStateValue } from '../../Store/StateProvider'

const Sidebar = () => {
  const [{ user }] = useStateValue()

  return (
    <div style={{ backgroundColor: '#F0F2F5'}}>
      <SidebarRow src={user.photoURL} title={user.displayName} />
      
      <SidebarRow src={ covidIcon } title='COVID-19 Information Center' />
      <SidebarRow src={ friendsIcon } title='Friends' />
      <SidebarRow src={ groupsIcon } title='Groups' />
      <SidebarRow src={ messengerIcon } title='Messenger' />
      <SidebarRow src={ marketplaceIcon } title='Marketplace' />
      <SidebarRow src={ pagesIcon } title='Pages' />
      <SidebarRow src={ videoIcon } title='video' />
    </div>
  )
}

export default Sidebar
