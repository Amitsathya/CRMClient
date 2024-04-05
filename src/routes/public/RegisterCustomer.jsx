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

const RegisterCustomer = ({ style, props }) => {
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL
  const [registerData, setRegisterData] = useState({
    fName: '',
    lName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
    source: '',
    age: null,
    sex: '',
    status: 0,
    createdAt: new Date(),
  })
  const [isEdit, setIsEdit] = useState(false)

  const handleInputChange = (field, value) => {
    setRegisterData({ ...registerData, [field]: value })
  }

  useEffect(() => {
    console.log(props)
    if (props.cId) {
      getCustomerInfo(props.cId)
      setIsEdit(true)
    }
  }, [])

  const getCustomerInfo = async (id) => {
    try {
      await axios.get(`${url}/getCustomerById/${id}`).then((response) => {
        const data = response.data[0]
        setRegisterData({
          fName: data.fName,
          customerId: data.customerId,
          lName: data.lName,
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          phone: data.phone,
          email: data.email,
          source: data.source,
          age: data.age,
          sex: data.sex,
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const createCustomer = async () => {
    try {
      await axios
        .post(`${url}/createCustomer`, registerData)
        .then((response) => {
          if (props.modal) {
            props.setOpen(false)
          }
        })
    } catch (error) {
      console.log(error)
    }
  }

  const updateCustomer = async () => {
    try {
      await axios
        .post(`${url}/updateCustomer`, registerData)
        .then((response) => {
          if (props.modal) {
            props.setOpen(false)
          }
        })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Paper elevation={4} style={{ ...style }}>
      {isEdit ? (
        <h2>Update Customer</h2>
      ) : (
        <h2>New Customer Registration Form</h2>
      )}
      <h3>Customer Details:</h3>
      <h4>
        Full Name <span style={{ color: 'red' }}>*</span>
      </h4>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            value={registerData.fName}
            onChange={(e) => handleInputChange('fName', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            value={registerData.lName}
            onChange={(e) => handleInputChange('lName', e.target.value)}
          />
        </Grid>
        {isEdit ? (
          <>
            <h4 style={{ marginLeft: '20px' }}>
              Address <span style={{ color: 'red' }}>*</span>
            </h4>
            <Grid item xs={12}>
              <TextField
                label="Street Address"
                variant="outlined"
                fullWidth
                value={registerData.address1}
                onChange={(e) => handleInputChange('address1', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Street Address Line 2"
                variant="outlined"
                fullWidth
                value={registerData.address2}
                onChange={(e) => handleInputChange('address2', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="City"
                variant="outlined"
                fullWidth
                value={registerData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="State"
                variant="outlined"
                fullWidth
                value={registerData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Postal Code"
                variant="outlined"
                fullWidth
                value={registerData.postalCode}
                onChange={(e) =>
                  handleInputChange('postalCode', e.target.value)
                }
              />
            </Grid>
            <Grid style={{ marginTop: '1rem' }} item xs={12} md={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={registerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </Grid>
            <Grid style={{ marginTop: '1rem' }} item xs={12} md={6}>
              <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                value={registerData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Age"
                variant="outlined"
                fullWidth
                value={registerData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="sex-label">Sex</InputLabel>
                <Select
                  labelId="sex-label"
                  value={registerData.sex}
                  label="Sex"
                  onChange={(e) => handleInputChange('sex', e.target.value)}
                >
                  <MenuItem value={'Male'}>Male</MenuItem>
                  <MenuItem value={'Female'}>Female</MenuItem>
                  <MenuItem value={'Other'}>Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="hear-label">
                  How did you hear about us?
                </InputLabel>
                <Select
                  labelId="hear-label"
                  value={registerData.source}
                  label="How did you hear about us?"
                  onChange={(e) => handleInputChange('source', e.target.value)}
                >
                  <MenuItem value={'Word of Mouth'}>Word of Mouth</MenuItem>
                  <MenuItem value={'Social Media'}>Social Media</MenuItem>
                  <MenuItem value={'Advertisement'}>Advertisement</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </>
        ) : (
          <></>
        )}
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
              onClick={createCustomer}
            >
              Submit
            </Button>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

export default RegisterCustomer
