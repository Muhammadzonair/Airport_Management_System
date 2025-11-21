import React, { useEffect } from 'react'

export default function Modal({ title, children, onClose, onConfirm }){
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Prevent scroll on mount
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => document.body.style.overflow = 'unset'
  }, [])

  return (
    <div 
      className="modal-overlay"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div 
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0" id="modal-title">{title}</h5>
          <button 
            className="btn btn-link text-dark p-0" 
            onClick={onClose}
            aria-label="Close"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="modal-body mb-4">
          {children}
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button 
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={onClose}
          >
            <i className="bi bi-x me-1"></i>
            Cancel
          </button>
          {onConfirm && (
            <button 
              className="btn btn-primary d-flex align-items-center"
              onClick={onConfirm}
            >
              <i className="bi bi-check2 me-1"></i>
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
