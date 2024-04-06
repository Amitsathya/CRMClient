import React, { useState, useEffect } from 'react'
import {
  Grid,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from '@mui/material'
import axios from 'axios'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

const RegisterModal = ({ props }) => {
  const [customerOptions, setCustomerOptions] = useState([])
  // const [employeeOptions, setEmployeeOptions] = useState([])
  // const [inventoryOptions, setInventoryOptions] = useState([])
  // const [serviceOptions, setServiceOptions] = useState([])
  const [visitData, setVisitData] = useState({
    customerId: '',
    phone: '',
    visitDate: new dayjs(Date()),
    notes: '',
  })
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL

  useEffect(() => {
    fetchOptions()
  }, [props.open])

  const handleClose = () => {
    props.setOpen(false)
    setVisitData({
      customerId: '',
      phone: '',
      visitDate: new dayjs(Date()),
    })
  }

  const handleInputChange = (field, value) => {
    if (field === 'customerId') {
      const selectedCustomer = customerOptions.find(
        (customer) => customer.customerId === value
      )
      console.log(selectedCustomer)
      setVisitData({
        ...visitData,
        [field]: value,
        phone: selectedCustomer ? selectedCustomer.phone : '',
        notes: selectedCustomer ? selectedCustomer.notes : '',
      })
    } else {
      setVisitData({ ...visitData, [field]: value })
    }
  }

  const createVisit = async () => {
    try {
      await axios.post(`${url}/createVisit`, visitData).then((response) => {
        handleClose()
      })
    } catch (error) {
      console.log(error)
    }
  }

  const fetchOptions = async () => {
    try {
      const [customers, employees, inventory, services] = await Promise.all([
        axios.get(`${url}/customers`),
      ])
      setCustomerOptions(customers.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <React.Fragment>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          fullScreen={fullScreen}
          open={props.open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
          maxWidth="md"
        >
          <DialogContent>
            <DialogContentText>
              <Paper
                elevation={4}
                style={{
                  padding: '1rem',
                  margin: '0rem',
                }}
              >
                <h2>New Visit</h2>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="customerId-label">Customer</InputLabel>
                      <Select
                        labelId="customerId-label"
                        value={visitData.customerId}
                        label="Customer"
                        onChange={(e) =>
                          handleInputChange('customerId', e.target.value)
                        }
                      >
                        {customerOptions.map((customer) => (
                          <MenuItem
                            key={customer.customerId}
                            value={customer.customerId}
                          >
                            {customer.fName} {customer.lName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      disabled
                      label="Mobile Number"
                      variant="outlined"
                      fullWidth
                      value={visitData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DateTimePicker
                      label="Start Time"
                      variant="outlined"
                      fullWidth
                      value={visitData.visitDate}
                      onChange={(value) =>
                        handleInputChange('visitDate', value)
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      disabled
                      id="outlined-multiline-static"
                      label="Notes"
                      multiline
                      rows={4}
                      value={visitData.notes}
                      onChange={(e) =>
                        handleInputChange('notes', e.target.value)
                      }
                      style={{ width: '100%', fontSize: '1rem' }}
                    />
                  </Grid>{' '}
                  {/* Rest of the form fields */}
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      style={{ float: 'right' }}
                      onClick={createVisit}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </React.Fragment>
  )
}
export default RegisterModal
