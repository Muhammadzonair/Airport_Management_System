import React from 'react'
import AppRouter from './routes/Router'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { TicketProvider } from './context/TicketContext'

export default function App(){
  return (
    <AuthProvider>
      <UserProvider>
        <TicketProvider>
          <AppRouter />
        </TicketProvider>
      </UserProvider>
    </AuthProvider>
  )
}
