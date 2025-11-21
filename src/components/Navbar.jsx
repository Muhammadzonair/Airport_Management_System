import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar(){
  const { user, logout } = useAuth()
  const nav = useNavigate()

  function doLogout(){
    logout()
    nav('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <i className="bi bi-airplane-engines me-2"></i>
          AirportMS
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navmenu">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/dashboard">
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/users">
                <i className="bi bi-people me-1"></i> Users
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/tickets">
                <i className="bi bi-ticket-perforated me-1"></i> Flights
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/bookings">
                <i className="bi bi-calendar2-check me-1"></i> Bookings
              </Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="navbar-text me-3 d-flex align-items-center">
                  <i className="bi bi-person-circle me-2"></i>
                  {user.name}
                </span>
                <button 
                  className="btn btn-outline-light d-flex align-items-center" 
                  onClick={doLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-outline-light d-flex align-items-center">
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
