import React, { useState } from 'react'
import NavBar from '../components/Navbar'
import { useTickets } from '../context/TicketContext'
import { useUsers } from '../context/UserContext'
import Modal from '../components/Modal'
import Card from '../components/Card'

export default function Bookings(){
  const { tickets, getBookings, cancelBooking, updateBookingUser } = useTickets()
  const { users } = useUsers()
  const [bookings, setBookings] = useState(getBookings())
  const [message, setMessage] = useState(null)

  const [confirm, setConfirm] = useState({ show:false, id:null, text:'' })

  function askCancel(id){
    const booking = bookings.find(b => b.id === id)
    const user = users.find(u => u.id === booking.userId)
    const ticket = tickets.find(t => t.id === booking.ticketId)
    setConfirm({ 
      show: true, 
      id, 
      text: `Cancel booking for ${user?.name || 'Unknown'} on flight ${ticket?.code || 'Unknown'}?` 
    })
  }

  function doCancelConfirmed(){
    if(confirm.id) cancelBooking(confirm.id)
    setMessage('Booking cancelled successfully')
    setConfirm({ show:false, id:null, text:'' })
    setBookings(getBookings())
    setTimeout(() => setMessage(null), 2000)
  }

  // Assign missing user to a booking
  const [assign, setAssign] = useState({ show:false, bookingId:null, selectedUserId:'' })

  function openAssign(bookingId){
    const firstUser = users && users.length>0 ? users[0].id : ''
    setAssign({ show:true, bookingId, selectedUserId: firstUser })
  }

  function doAssignConfirmed(){
    if(assign.bookingId && assign.selectedUserId){
      updateBookingUser(assign.bookingId, assign.selectedUserId)
      setMessage('Booking assigned to user')
      setBookings(getBookings())
    }
    setAssign({ show:false, bookingId:null, selectedUserId:'' })
    setTimeout(()=>setMessage(null), 2000)
  }

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Bookings</h3>
          {message && <div className="alert alert-success py-2 px-3 m-0">{message}</div>}
        </div>
        <Card>
          <div className="table-responsive">
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Flight Details</th>
                  <th>Status</th>
                  <th>Booking Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b=>{
                  const user = users.find(u=>u.id===b.userId)
                  const ticket = tickets.find(t=>t.id===b.ticketId)
                  return (
                    <tr key={b.id}>
                      <td>
                        {user ? (
                          <div>
                            <div className="fw-medium">{user.name}</div>
                            <small className="text-muted">{user.email}</small>
                          </div>
                        ) : (
                          <div>
                            <span className="text-danger">User not found</span>
                            <div className="mt-2">
                              {users.length>0 ? (
                                <button className="btn btn-sm btn-outline-primary" onClick={()=>openAssign(b.id)}>Assign User</button>
                              ) : (
                                <small className="text-muted">No users available to assign</small>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                      <td>
                        {ticket ? (
                          <div>
                            <div className="fw-medium">{ticket.code}</div>
                            <small className="text-muted">{ticket.from} → {ticket.to}</small>
                            <div><small>Gate: {ticket.gate} • Time: {ticket.time}</small></div>
                          </div>
                        ) : (
                          <span className="text-danger">Flight not found</span>
                        )}
                      </td>
                      <td>
                        {ticket?.status === 'On Time' && <span className="badge bg-success">On Time</span>}
                        {ticket?.status === 'Delayed' && <span className="badge bg-warning">Delayed</span>}
                        {ticket?.status === 'Cancelled' && <span className="badge bg-danger">Cancelled</span>}
                        {!ticket && <span className="badge bg-secondary">Unknown</span>}
                      </td>
                      <td>{new Date(b.date).toLocaleString()}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          disabled={ticket?.status === 'Cancelled'}
                          onClick={() => askCancel(b.id)}
                        >
                          Cancel Booking
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {bookings.length===0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {confirm.show && (
          <Modal 
            title="Cancel Booking" 
            onClose={() => setConfirm({ show:false, id:null, text:'' })} 
            onConfirm={doCancelConfirmed}
          >
            <p>{confirm.text}</p>
            <p className="text-muted mb-0">This action cannot be undone.</p>
          </Modal>
        )}
        {assign.show && (
          <Modal title="Assign Booking User" onClose={()=>setAssign({ show:false, bookingId:null, selectedUserId:'' })} onConfirm={doAssignConfirmed}>
            <div className="mb-2">Select user to assign to this booking:</div>
            <select className="form-select mb-2" value={assign.selectedUserId} onChange={e=>setAssign({...assign, selectedUserId:e.target.value})}>
              {users.map(u=> <option key={u.id} value={u.id}>{u.name} — {u.email}</option>)}
            </select>
            <small className="text-muted">This will link the booking to the selected user.</small>
          </Modal>
        )}
      </div>
    </div>
  )
}
