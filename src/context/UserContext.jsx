import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export function UserProvider({ children }){
  const [users, setUsers] = useState([])

  useEffect(()=>{
    const stored = localStorage.getItem('ams_users')
    if(stored) setUsers(JSON.parse(stored))
  }, [])

  useEffect(()=>{
    localStorage.setItem('ams_users', JSON.stringify(users))
  }, [users])

  function addUser(data){
    const newUser = { id: Date.now().toString(), ...data }
    setUsers(prev => [...prev, newUser])
    return newUser
  }

  function updateUser(id, updated){
    setUsers(prev => prev.map(u => u.id===id ? { ...u, ...updated } : u))
  }

  function deleteUser(id){
    setUsers(prev => prev.filter(u => u.id!==id))
    // Also remove bookings referencing this user
    const bookings = JSON.parse(localStorage.getItem('ams_bookings')||'[]')
    const filtered = bookings.filter(b=>b.userId!==id)
    localStorage.setItem('ams_bookings', JSON.stringify(filtered))
  }

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUsers(){
  return useContext(UserContext)
}
