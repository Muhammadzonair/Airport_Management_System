import React, { useState, useEffect } from 'react'
import NavBar from '../components/Navbar'
import { useUsers } from '../context/UserContext'
import Modal from '../components/Modal'

export default function Users(){
  const { users, addUser, updateUser, deleteUser } = useUsers()
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState(null)
  const [confirm, setConfirm] = useState({ show:false, id:null, text:'' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Reset errors when form changes
  useEffect(() => {
    setErrors({})
  }, [form])

  async function submit(e){
    e.preventDefault()
    setErrors({})
    
    // Validation
    const newErrors = {}
    if(!form.name.trim()) newErrors.name = 'Name is required'
    if(!form.email.trim()) newErrors.email = 'Email is required'
    if(!editing && !form.password) newErrors.password = 'Password is required'
    if(form.password && form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(form.email && !emailRegex.test(form.email)) newErrors.email = 'Invalid email format'
    
    if(Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      if(editing){
        await updateUser(editing, { name: form.name.trim(), email: form.email.trim() })
        setMessage({ type: 'success', text: 'User updated successfully' })
        setEditing(null)
      } else {
        await addUser({ name: form.name.trim(), email: form.email.trim(), password: form.password })
        setMessage({ type: 'success', text: 'User added successfully' })
      }
      setForm({ name:'', email:'', password:'' })
    } catch(err) {
      setMessage({ type: 'danger', text: err.message || 'An error occurred' })
    }
    setLoading(false)
    setTimeout(() => setMessage(null), 3000)
  }

  function startEdit(u){
    setEditing(u.id)
    setForm({ name:u.name, email:u.email, password:'' })
  }

  function askDelete(id, name){
    setConfirm({ 
      show:true, 
      id, 
      text: `Are you sure you want to delete user "${name}"? This will remove all their bookings.` 
    })
  }

  async function doDelete(){
    setLoading(true)
    try {
      await deleteUser(confirm.id)
      setMessage({ type: 'success', text: 'User deleted successfully' })
    } catch(err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to delete user' })
    }
    setConfirm({ show:false, id:null, text:'' })
    setLoading(false)
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">
            <i className="bi bi-people me-2"></i>
            Users
          </h3>
          <span className="badge bg-primary">{users.length} total</span>
        </div>

        {message && (
          <div className={`alert alert-${message.type} d-flex align-items-center`}>
            <i className={`bi bi-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
            {message.text}
          </div>
        )}

        <div className="row g-4">
          <div className="col-md-5">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  <i className={`bi bi-${editing ? 'pencil-square' : 'person-plus'} me-2`}></i>
                  {editing ? 'Edit User' : 'Add New User'}
                </h5>
                
                <form onSubmit={submit} className="needs-validation" noValidate>
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person"></i>
                      </span>
                      <input 
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Full Name"
                        value={form.name}
                        onChange={e => setForm({...form, name:e.target.value})}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input 
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Email Address"
                        type="email"
                        value={form.email}
                        onChange={e => setForm({...form, email:e.target.value})}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>

                  {!editing && (
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-key"></i>
                        </span>
                        <input 
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          placeholder="Password"
                          type="password"
                          value={form.password}
                          onChange={e => setForm({...form, password:e.target.value})}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>
                    </div>
                  )}

                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary d-flex align-items-center"
                      disabled={loading}
                    >
                      {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                      <i className={`bi bi-${editing ? 'check-lg' : 'plus-lg'} me-1`}></i>
                      {editing ? 'Save Changes' : 'Add User'}
                    </button>
                    
                    {editing && (
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setEditing(null)
                          setForm({ name:'', email:'', password:'' })
                          setErrors({})
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">
                  <i className="bi bi-table me-2"></i>
                  User List
                </h5>
                
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-person-circle text-primary me-2"></i>
                              {u.name}
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <div className="d-flex gap-2 justify-content-end">
                              <button 
                                className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                onClick={() => startEdit(u)}
                                disabled={loading}
                              >
                                <i className="bi bi-pencil me-1"></i>
                                Edit
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                onClick={() => askDelete(u.id, u.name)}
                                disabled={loading}
                              >
                                <i className="bi bi-trash me-1"></i>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center text-muted py-4">
                            <i className="bi bi-inbox display-1"></i>
                            <p className="mt-3">No users found. Add your first user above.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {confirm.show && (
          <Modal 
            title={<><i className="bi bi-exclamation-triangle text-danger me-2"></i>Confirm Delete</>}
            onClose={() => setConfirm({ show:false, id:null, text:'' })}
            onConfirm={doDelete}
          >
            <p>{confirm.text}</p>
            <div className="alert alert-warning">
              <i className="bi bi-info-circle me-2"></i>
              This action cannot be undone.
            </div>
          </Modal>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  )
}
