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
  Divider,
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

const AssignModal = ({ props }) => {
  const [customerOptions, setCustomerOptions] = useState([])
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [serviceOptions, setServiceOptions] = useState([])
  const [visitData, setVisitData] = useState({
    customerId: '',
    phone: '',
    visitId: '',
    visitDate: new dayjs(Date()),
    employeeId: '',
    serviceId: '',
    status: 1,
    notes: '',
  })
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL

  useEffect(() => {
    fetchOptions()
    visitDetails(props.visitId)
  }, [props.openActive])

  const handleClose = () => {
    props.setOpenActive(false)
    setVisitData({
      customerId: '',
      visitId: '',
      phone: '',
      visitDate: new dayjs(Date()),
      employeeId: '',
      serviceId: '',
      status: 1,
      notes: '',
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
      })
    } else {
      setVisitData({ ...visitData, [field]: value })
    }
  }

  const updateVisit = async () => {
    try {
      await axios.post(`${url}/updateVisit`, visitData).then((response) => {
        handleClose()
      })
    } catch (error) {
      console.log(error)
    }
  }

  const visitDetails = async (id) => {
    try {
      await axios.get(`${url}/getVisitById/${id}`).then((response) => {
        const data = response.data[0]
        const selectedCustomer = customerOptions.find(
          (customer) => customer.customerId === data.customerId
        )
        setVisitData({
          customerId: data.customerId,
          visitId: data.visitId,
          phone: selectedCustomer ? selectedCustomer.phone : '',
          visitDate: new dayjs(data.visitDate),
          employeeId: data.employeeId,
          serviceId: data.serviceId,
          status: 1,
          notes: data.notes,
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const fetchOptions = async () => {
    try {
      const [customers, employees, services] = await Promise.all([
        axios.get(`${url}/customers`),
        axios.get(`${url}/employees`),
        axios.get(`${url}/services`),
      ])
      setCustomerOptions(customers.data)
      setEmployeeOptions(employees.data)
      setServiceOptions(services.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <React.Fragment>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          fullScreen={fullScreen}
          open={props.openActive}
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
                <h2>Active Visit: {props.visitId}</h2>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth disabled>
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
                  <Grid item xs={12}>
                    <Divider variant="middle" style={{ marginTop: '1vh' }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="employeeId-label">Employee</InputLabel>
                      <Select
                        labelId="employeeId-label"
                        value={visitData.employeeId}
                        label="Customer"
                        onChange={(e) =>
                          handleInputChange('employeeId', e.target.value)
                        }
                      >
                        {employeeOptions.map((employee) => (
                          <MenuItem
                            key={employee.employeeId}
                            value={employee.employeeId}
                          >
                            {employee.fName} {employee.lName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="serviceId-label">Service</InputLabel>
                      <Select
                        labelId="serviceId-label"
                        value={visitData.serviceId}
                        label="Service"
                        onChange={(e) =>
                          handleInputChange('serviceId', e.target.value)
                        }
                      >
                        {serviceOptions.map((service) => (
                          <MenuItem
                            key={service.serviceId}
                            value={service.serviceId}
                          >
                            {service.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* Rest of the form fields */}
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      style={{ float: 'right' }}
                      onClick={updateVisit}
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
export default AssignModal
