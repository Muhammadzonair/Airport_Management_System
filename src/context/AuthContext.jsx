import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const stored = localStorage.getItem('ams_auth')
    if(stored) setUser(JSON.parse(stored))
  }, [])

  useEffect(()=>{
    if(user) localStorage.setItem('ams_auth', JSON.stringify(user))
    else localStorage.removeItem('ams_auth')
  }, [user])

  function login({ email, password }){
    // Simple front-end auth: accept any email/password — but check registered users from localStorage
    const users = JSON.parse(localStorage.getItem('ams_users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if(found){
      setUser({ id: found.id, name: found.name, email: found.email })
      return { ok:true }
    }
    return { ok:false, error: 'Invalid credentials' }
  }

  function register({ name, email, password }){
    // Minimal register that stores to users list
    const users = JSON.parse(localStorage.getItem('ams_users') || '[]')
    if(users.find(u=>u.email===email)) return { ok:false, error: 'Email taken' }
    const newUser = { id: Date.now().toString(), name, email, password }
    users.push(newUser)
    localStorage.setItem('ams_users', JSON.stringify(users))
    setUser({ id: newUser.id, name:newUser.name, email:newUser.email })
    return { ok:true }
  }

  function logout(){
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}
