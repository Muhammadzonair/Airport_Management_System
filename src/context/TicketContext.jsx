import React, { createContext, useContext, useState, useEffect } from 'react'

const TicketContext = createContext()

export function TicketProvider({ children }){
  const [tickets, setTickets] = useState([])

  useEffect(()=>{
    const stored = localStorage.getItem('ams_tickets')
    if(stored) setTickets(JSON.parse(stored))
    else {
      // seed some sample tickets for demo
      const seed = [
        { id: 't1', code: 'AM100', from: 'LAX', to: 'JFK', time: '10:00', gate: 'A1', status: 'On Time' },
        { id: 't2', code: 'AM200', from: 'SFO', to: 'ORD', time: '13:30', gate: 'B2', status: 'Delayed' },
        { id: 't3', code: 'AM300', from: 'SEA', to: 'DEN', time: '15:45', gate: 'C3', status: 'On Time' }
      ]
      setTickets(seed)
      localStorage.setItem('ams_tickets', JSON.stringify(seed))
    }
  }, [])

  useEffect(()=>{
    localStorage.setItem('ams_tickets', JSON.stringify(tickets))
  }, [tickets])

  function addTicket(data){
    const newTicket = { id: Date.now().toString(), ...data }
    setTickets(prev => [...prev, newTicket])
    return newTicket
  }

  function updateTicket(id, updated){
    setTickets(prev => prev.map(t => t.id===id ? { ...t, ...updated } : t))
  }

  function deleteTicket(id){
    setTickets(prev => prev.filter(t => t.id!==id))
    // remove bookings for this ticket
    const bookings = JSON.parse(localStorage.getItem('ams_bookings')||'[]')
    const filtered = bookings.filter(b=>b.ticketId!==id)
    localStorage.setItem('ams_bookings', JSON.stringify(filtered))
  }

  function getBookings(){
    return JSON.parse(localStorage.getItem('ams_bookings')||'[]')
  }

  function bookTicket(userId, ticketId){
    const bookings = JSON.parse(localStorage.getItem('ams_bookings')||'[]')
    if(bookings.find(b=>b.userId===userId && b.ticketId===ticketId)) return { ok:false, error:'Already booked' }
    const newBooking = { id: Date.now().toString(), userId, ticketId, date: new Date().toISOString() }
    bookings.push(newBooking)
    localStorage.setItem('ams_bookings', JSON.stringify(bookings))
    return { ok:true, booking:newBooking }
  }

  function cancelBooking(bookingId){
    const bookings = JSON.parse(localStorage.getItem('ams_bookings')||'[]')
    const filtered = bookings.filter(b=>b.id!==bookingId)
    localStorage.setItem('ams_bookings', JSON.stringify(filtered))
  }

  function updateBookingUser(bookingId, newUserId){
    const bookings = JSON.parse(localStorage.getItem('ams_bookings')||'[]')
    const updated = bookings.map(b => b.id===bookingId ? { ...b, userId: newUserId } : b)
    localStorage.setItem('ams_bookings', JSON.stringify(updated))
    return updated.find(b=>b.id===bookingId)
  }

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicket, deleteTicket, getBookings, bookTicket, cancelBooking, updateBookingUser }}>
      {children}
    </TicketContext.Provider>
  )
}

export function useTickets(){
  return useContext(TicketContext)
}
