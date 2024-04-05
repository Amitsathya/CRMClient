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

const EmployeeModal = ({ props }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [serviceOptions, setServiceOptions] = useState([])
  const [employeeData, setEmployeeData] = useState({
    fName: '',
    lName: '',
    position: '',
    department: '',
    salary: '',
    status: 1,
    services: [],
    createdAt: new Date(),
  })
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL

  useEffect(() => {
    setIsEdit(false)
    fetchServices()
    if (props.eId) {
      getEmployeeInfo(props.eId)
      setIsEdit(true)
    }
  }, [props.open])

  const handleClose = () => {
    props.setOpen(false)
    setEmployeeData({
      fName: '',
      lName: '',
      position: '',
      department: '',
      salary: '',
      status: 1,
      services: [],
      createdAt: new Date(),
    })
  }

  const handleInputChange = (field, value) => {
    setEmployeeData({ ...employeeData, [field]: value })
  }

  const createEmployee = async () => {
    try {
      await axios
        .post(`${url}/createEmployee`, employeeData)
        .then((response) => {
          handleClose()
        })
    } catch (error) {
      console.log(error)
    }
  }

  const updateCustomer = async () => {
    try {
      await axios
        .post(`${url}/updateEmployee`, employeeData)
        .then((response) => {
          handleClose()
        })
    } catch (error) {
      console.log(error)
    }
  }

  const getEmployeeInfo = async (id) => {
    try {
      await axios.get(`${url}/getEmployeeById/${id}`).then((response) => {
        const data = response.data[0]
        setEmployeeData({
          fName: data.fName,
          employeeId: data.employeeId,
          lName: data.lName,
          position: data.position,
          department: data.department,
          salary: data.salary,
          // services: [data.services],
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${url}/services`)
      setServiceOptions(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <React.Fragment>
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
              {isEdit ? <h2>Update Employee</h2> : <h2>New Employee</h2>}
              <h4>
                Full Name <span style={{ color: 'red' }}>*</span>
              </h4>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    value={employeeData.fName}
                    onChange={(e) => handleInputChange('fName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={employeeData.lName}
                    onChange={(e) => handleInputChange('lName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Position"
                    variant="outlined"
                    fullWidth
                    value={employeeData.position}
                    onChange={(e) =>
                      handleInputChange('position', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="services-label">Services</InputLabel>
                    <Select
                      labelId="services-label"
                      multiple
                      value={employeeData.services}
                      label="Services"
                      onChange={(e) =>
                        handleInputChange('services', e.target.value)
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
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="department-label">Department</InputLabel>
                    <Select
                      labelId="department-label"
                      value={employeeData.department}
                      label="Department"
                      onChange={(e) =>
                        handleInputChange('department', e.target.value)
                      }
                    >
                      <MenuItem value={'Hair Stylists'}>Hair Stylists</MenuItem>
                      <MenuItem value={'Nail Technicians'}>
                        Nail Technicians
                      </MenuItem>
                      <MenuItem value={'Estheticians'}>Estheticians</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Salary"
                    variant="outlined"
                    fullWidth
                    value={employeeData.salary}
                    onChange={(e) =>
                      handleInputChange('salary', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  {isEdit ? (
                    <Button
                      variant="contained"
                      style={{ float: 'right' }}
                      onClick={updateCustomer}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      style={{ float: 'right' }}
                      onClick={createEmployee}
                    >
                      Submit
                    </Button>
                  )}
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
    </React.Fragment>
  )
}
export default EmployeeModal
