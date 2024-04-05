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

const ServiceModal = ({ props }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [serviceData, setServiceData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    status: 1,
  })
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL

  useEffect(() => {
    setIsEdit(false)
    if (props.sId) {
      getServiceInfo(props.sId)
      setIsEdit(true)
    }
  }, [props.open])

  const handleClose = () => {
    props.setOpen(false)
    setServiceData({
      name: '',
      category: '',
      description: '',
      price: '',
      status: 1,
      createdAt: new Date(),
    })
  }

  const handleInputChange = (field, value) => {
    setServiceData({ ...serviceData, [field]: value })
  }

  const createService = async () => {
    try {
      await axios.post(`${url}/createService`, serviceData).then((response) => {
        handleClose()
      })
    } catch (error) {
      console.log(error)
    }
  }

  const updateService = async () => {
    try {
      await axios.post(`${url}/updateService`, serviceData).then((response) => {
        handleClose()
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getServiceInfo = async (id) => {
    try {
      await axios.get(`${url}/getServiceById/${id}`).then((response) => {
        const data = response.data[0]
        setServiceData({
          name: data.name,
          serviceId: data.serviceId,
          category: data.category,
          description: data.description,
          price: data.price,
        })
      })
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
              {isEdit ? <h2>Update Service</h2> : <h2>New Service</h2>}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Service"
                    variant="outlined"
                    fullWidth
                    value={serviceData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Price"
                    variant="outlined"
                    fullWidth
                    value={serviceData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      value={serviceData.category}
                      label="Category"
                      onChange={(e) =>
                        handleInputChange('category', e.target.value)
                      }
                    >
                      <MenuItem value={'Haircuts'}>Haircuts</MenuItem>
                      <MenuItem value={'Coloring'}>Coloring</MenuItem>
                      <MenuItem value={'Styling'}>Styling</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    value={serviceData.description}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  {isEdit ? (
                    <Button
                      variant="contained"
                      style={{ float: 'right' }}
                      onClick={updateService}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      style={{ float: 'right' }}
                      onClick={createService}
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
export default ServiceModal
