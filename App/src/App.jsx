import { createContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import Register from './Components/Register'
import Login from './Components/Login'
import Protected from './Components/ProtectedRoute'
import Loading from './Components/Loading'
import Home from './Components/Home'

const AppContext = createContext()
const AppProvider = (props)=>{
  const state = {
    isAuth: props.isAuth,
    setIsAuth: props.setIsAuth,
    currentUser: props.currentUser,
    setCurrentUser: props.setCurrentUser
  }
  return (
    <AppContext.Provider value={state}>
      { props.children }
    </AppContext.Provider>
  )
}

function App() {
  const [ isAuth, setIsAuth ] = useState(false)
  const [ currentUser, setCurrentUser ] = useState({})
  const [ loaded, setLoaded ] = useState(false)

  useEffect(()=>{
    fetch(`${import.meta.env.VITE_API}/auth/verifyToken`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${document.cookie.split('=')[1]}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if(data.type === 'success'){
        setIsAuth(true)
        setCurrentUser(data.data)
      }
      setLoaded(true)
    }).catch(err => {
      setLoaded(true)
    })

  },[isAuth])

  if(!loaded){
    return (
      <Loading></Loading>
    )
  }
  return (
    <BrowserRouter>
      <AppProvider 
        {...{ isAuth, setIsAuth, currentUser, setCurrentUser }}
      >
        <AnimatePresence mode='wait'>
          <Routes>
            <Route path="/register" element={ <Register /> } />
            <Route path="/login" element={ <Login /> } />
            {/* THese are protected routes */}
            <Route element={ <Protected /> }>
              <Route path='/' element={ <Home /> } />
            </Route>
          </Routes>
        </AnimatePresence>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
export { AppContext,  AppProvider }
