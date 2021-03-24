import { Button } from '@material-ui/core'
import React, { useEffect } from 'react'
import './Login.css'
import { auth, provider } from '../../firebase'
import { useStateValue } from '../../Store/StateProvider'
import { actionTypes } from '../../Store/reducers/Reducer'

import fbCircle from '../../assets/240px-Facebook_Logo_circle(2019).png'
import facebook from '../../assets/1280px-Facebook_Logo_(2019).svg2.png'

function Login() {
  const [{},dispatch] = useStateValue()

  const signIn = () => {
    auth.signInWithPopup(provider)
      .then(result => {
        console.log('result', result)
        
        /* add user */
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user
        })

        localStorage.setItem('user', JSON.stringify(result.user))

      }).catch(error => console.log(error.message))
  }

  useEffect(() => {
    /* turn socket on */
    dispatch({
      type: actionTypes.DISCONNECT_SOCKET,
      scoketStatus: false
    })
  }, [])

  return (
    <div className='login' >
      <div className='login__logo'>

        <img src={fbCircle} alt='fb circle' />

        <img src={facebook} alt="" />
      </div>
      
      <div className='login__buttonSubmit' onClick={signIn}>
        <Button type='submit' >Sign In</Button>
      </div>
    </div>
  )
}

export default Login
