import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Splash from '../pages/Splash'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Users from '../pages/Users'
import Tickets from '../pages/Tickets'
import Bookings from '../pages/Bookings'
import { useAuth } from '../context/AuthContext'

export default function AppRouter(){
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // on mount, route to splash
    if(window.location.pathname === '/'){
      navigate('/splash')
    }
  }, [])

  return (
    <Routes>
      <Route path="/splash" element={<Splash/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/users" element={<Users/>} />
      <Route path="/tickets" element={<Tickets/>} />
      <Route path="/bookings" element={<Bookings/>} />
      <Route path="*" element={<Dashboard/>} />
    </Routes>
  )
}
