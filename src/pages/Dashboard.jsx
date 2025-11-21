import React from 'react'
import NavBar from '../components/Navbar'
import { useUsers } from '../context/UserContext'
import { useTickets } from '../context/TicketContext'

export default function Dashboard(){
  const { users } = useUsers()
  const { tickets, getBookings } = useTickets()
  const bookings = getBookings()

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        <h3>Dashboard</h3>
        <div className="row">
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Users</h5>
                <p className="display-6">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Flights</h5>
                <p className="display-6">{tickets.length}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Bookings</h5>
                <p className="display-6">{bookings.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h5>Quick Flights</h5>
          <div className="card-grid mt-2">
            {tickets.map(t=> (
              <div className="card p-2" key={t.id}>
                <div className="card-body">
                  <h6>{t.code} — {t.from} → {t.to}</h6>
                  <p className="mb-0">Time: {t.time} • Gate: {t.gate}</p>
                  <small className="text-muted">Status: {t.status}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
