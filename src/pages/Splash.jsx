import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Splash(){
  const nav = useNavigate()
  const { user } = useAuth()
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Show animation on mount
    setShow(true)
    
    // Redirect after animation
    const t = setTimeout(() => {
      if(user) nav('/dashboard')
      else nav('/login')
    }, 2000)
    
    return () => clearTimeout(t)
  }, [user, nav])

  return (
    <div className="splash">
      <div className={`splash-content ${show ? 'show' : ''}`}>
        <div className="splash-icon mb-4">
          <i className="bi bi-airplane-engines display-1"></i>
        </div>
        <h1>Airport Management</h1>
        <p className="lead mb-4">Manage users, flights, and bookings</p>
        <div className="splash-loader">
          <div className="spinner"></div>
        </div>
      </div>

      <style>{`
        .splash-content {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s ease-out;
        }
        .splash-content.show {
          opacity: 1;
          transform: translateY(0);
        }
        .splash-icon {
          animation: float 3s ease-in-out infinite;
        }
        .splash h1 {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #fff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .splash .lead {
          font-size: 1.25rem;
          opacity: 0.9;
        }
        .splash-loader {
          margin-top: 2rem;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  )
}
