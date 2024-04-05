import React, { useState } from 'react'
import { Snackbar, Alert } from '@mui/material'

export default function createAlert() {
  const [open, setOpen] = useState(false)
  const [alertProps, setAlertProps] = useState({})

  const showAlert = ({ type, message }) => {
    setAlertProps({ type, message })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={alertProps.type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {alertProps.message}
      </Alert>
    </Snackbar>
  )

  return showAlert
}
