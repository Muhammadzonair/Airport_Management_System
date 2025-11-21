import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NavBar from '../components/Navbar'

export default function Register(){
  const { register } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handle(e){
    e.preventDefault()
    const res = await register({ name, email, password })
    if(res.ok) nav('/dashboard')
    else setError(res.error)
  }

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3>Register</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handle}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} required />
                  </div>
                  <button className="btn btn-primary">Register</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
