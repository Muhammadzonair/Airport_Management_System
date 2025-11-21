import React, { useState } from 'react'
import NavBar from '../components/Navbar'
import { useTickets } from '../context/TicketContext'
import { useAuth } from '../context/AuthContext'
import { useUsers } from '../context/UserContext'
import Modal from '../components/Modal'

export default function Tickets(){
  const { tickets, addTicket, updateTicket, deleteTicket, bookTicket, getBookings } = useTickets()
  const { user } = useAuth()
  const { users } = useUsers()
  const [form, setForm] = useState({ code:'', from:'', to:'', time:'', gate:'', status:'On Time' })
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState(null)

  function submit(e){
    e.preventDefault()
    if(editing){
      updateTicket(editing, form)
      setEditing(null)
    } else {
      addTicket(form)
    }
    setForm({ code:'', from:'', to:'', time:'', gate:'', status:'On Time' })
  }

  function startEdit(t){
    setEditing(t.id)
    setForm({ code:t.code, from:t.from, to:t.to, time:t.time, gate:t.gate, status:t.status })
  }

  const [confirm, setConfirm] = useState({ show:false, id:null, text:'' })

  function askDelete(id){
    setConfirm({ show:true, id, text:'Delete this flight? This will remove associated bookings.' })
  }

  function doDeleteConfirmed(){
    if(confirm.id) deleteTicket(confirm.id)
    setConfirm({ show:false, id:null, text:'' })
  }

  function doBook(ticketId){
    if(!user){ setMessage('Please login to book'); return }
    const res = bookTicket(user.id, ticketId)
    if(!res.ok) setMessage(res.error)
    else setMessage('Booked successfully')
    setTimeout(()=>setMessage(null), 2000)
  }

  const bookings = getBookings()

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        <h3>Flights</h3>
        {message && <div className="alert alert-info">{message}</div>}
        <div className="row">
          <div className="col-md-5">
            <div className="card">
              <div className="card-body">
                <h5>{editing ? 'Edit Flight' : 'Add Flight'}</h5>
                <form onSubmit={submit}>
                  <input className="form-control mb-2" placeholder="Code" value={form.code} onChange={e=>setForm({...form, code:e.target.value})} required />
                  <div className="d-flex gap-2 mb-2">
                    <input className="form-control" placeholder="From" value={form.from} onChange={e=>setForm({...form, from:e.target.value})} required />
                    <input className="form-control" placeholder="To" value={form.to} onChange={e=>setForm({...form, to:e.target.value})} required />
                  </div>
                  <div className="d-flex gap-2 mb-2">
                    <input className="form-control" placeholder="Time" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} required />
                    <input className="form-control" placeholder="Gate" value={form.gate} onChange={e=>setForm({...form, gate:e.target.value})} required />
                  </div>
                  <select className="form-select mb-2" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
                    <option>On Time</option>
                    <option>Delayed</option>
                    <option>Cancelled</option>
                  </select>
                  <button className="btn btn-primary">{editing ? 'Save' : 'Add'}</button>
                  {editing && <button type="button" className="btn btn-secondary ms-2" onClick={()=>{setEditing(null); setForm({ code:'', from:'', to:'', time:'', gate:'', status:'On Time' })}}>Cancel</button>}
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card">
              <div className="card-body">
                <h5>All Flights</h5>
                <table className="table table-hover">
                  <thead><tr><th>Code</th><th>Route</th><th>Time</th><th>Gate</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {tickets.map(t=> (
                      <tr key={t.id}>
                        <td>{t.code}</td>
                        <td>{t.from} → {t.to}</td>
                        <td>{t.time}</td>
                        <td>{t.gate}</td>
                        <td>{t.status}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1" onClick={()=>startEdit(t)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger me-1" onClick={()=>askDelete(t.id)}>Delete</button>
                          <button className="btn btn-sm btn-success" onClick={()=>doBook(t.id)}>Book</button>
                        </td>
                      </tr>
                    ))}
                    {tickets.length===0 && <tr><td colSpan={6}>No flights</td></tr>}
                  </tbody>
                </table>

                {confirm.show && (
                  <Modal title="Confirm" onClose={()=>setConfirm({ show:false, id:null, text:'' })} onConfirm={doDeleteConfirmed}>
                    <p>{confirm.text}</p>
                  </Modal>
                )}

                <div className="mt-3">
                  <h6>Bookings (per-flight)</h6>
                  {tickets.map(t=> (
                    <div key={t.id} className="mb-2">
                      <strong>{t.code}</strong>
                      <div>
                        {bookings.filter(b=>b.ticketId===t.id).map(b=>{
                          const u = users.find(x=>x.id===b.userId)
                          return <span key={b.id} className="badge bg-secondary me-1">{u? u.name : 'Unknown'}</span>
                        })}
                        {bookings.filter(b=>b.ticketId===t.id).length===0 && <small className="text-muted ms-2">No bookings</small>}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
