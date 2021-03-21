import React from 'react'
import './App.css'
import Feed from './Components/Feed/Feed'
import Header from './Components/Header/Header'
import Login from './Components/Login/Login'
import Sidebar from './Components/Sidebar/Sidebar'
import Widgets from './Components/Widgets/Widgets'
import { useStateValue } from './Store/StateProvider'
function App() {
  const [{ user }] = useStateValue()


  return (
    <div className="App">
      {
        user  ? ( 
          <>
            <Header />
      
            <div className="app__body">
              <Sidebar />
              <Feed />
              <Widgets />  
              {/*  */}
            </div>
          </>
        ) : (
          <Login />
        )
      }
    </div>
  )

}

export default App
