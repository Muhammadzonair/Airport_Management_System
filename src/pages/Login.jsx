import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NavBar from '../components/Navbar'

export default function Login(){
  const { login } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Reset errors when form changes
  useEffect(() => {
    setErrors({})
    setError(null)
  }, [form])

  async function handle(e){
    e.preventDefault()
    setErrors({})
    setError(null)

    // Validation
    const newErrors = {}
    if(!form.email.trim()) newErrors.email = 'Email is required'
    if(!form.password) newErrors.password = 'Password is required'
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(form.email && !emailRegex.test(form.email)) {
      newErrors.email = 'Invalid email format'
    }

    if(Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const res = await login({ email: form.email, password: form.password })
      if(res.ok) {
        nav('/dashboard')
      } else {
        setError(res.error)
      }
    } catch(err) {
      setError('An unexpected error occurred')
    }
    setLoading(false)
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <NavBar />
      
      <div className="flex-grow-1 d-flex align-items-center py-5" style={{background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5 col-lg-4">
              <div className="card shadow-lg">
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <i className="bi bi-airplane-engines display-4 text-primary"></i>
                    <h3 className="mt-3 mb-1">Welcome Back</h3>
                    <p className="text-muted">Sign in to continue</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="bi bi-exclamation-circle-fill me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handle} noValidate>
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input 
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          placeholder="Email Address"
                          value={form.email}
                          onChange={e => setForm({...form, email: e.target.value})}
                          disabled={loading}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-key"></i>
                        </span>
                        <input 
                          type="password"
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          placeholder="Password"
                          value={form.password}
                          onChange={e => setForm({...form, password: e.target.value})}
                          disabled={loading}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button 
                        type="submit" 
                        className="btn btn-primary py-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Signing in...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Sign In
                          </>
                        )}
                      </button>

                      <Link 
                        to="/register" 
                        className="btn btn-outline-secondary py-2"
                        disabled={loading}
                      >
                        <i className="bi bi-person-plus me-2"></i>
                        Create Account
                      </Link>
                    </div>
                  </form>
                </div>
              </div>

              <div className="text-center mt-4 text-muted small">
                <i className="bi bi-shield-check me-1"></i>
                Secure login • Local storage only
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
