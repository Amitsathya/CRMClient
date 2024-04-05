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

const InventoryModal = ({ props }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [productOptions, setProductOptions] = useState([])
  const [inventoryData, setInventoryData] = useState({
    productId: '',
    category: '',
    quantity: '',
    location: '',
    createdAt: new Date(),
  })
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL

  useEffect(() => {
    setIsEdit(false)
    productList()
    if (props.pId) {
      getInventoryInfo(props.pId)
      setIsEdit(true)
    }
  }, [props.open])

  const handleClose = () => {
    props.setOpen(false)
    setInventoryData({
      productId: '',
      quantity: '',
      location: '',
      createdAt: new Date(),
    })
  }

  const handleInputChange = (field, value) => {
    setInventoryData({ ...inventoryData, [field]: value })
  }

  const createInventory = async () => {
    try {
      await axios
        .post(`${url}/createInventory`, inventoryData)
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
        .post(`${url}/updateInventory`, inventoryData)
        .then((response) => {
          handleClose()
        })
    } catch (error) {
      console.log(error)
    }
  }

  const productList = async () => {
    try {
      await axios
        .get(`${url}/productDropdown`, inventoryData)
        .then((response) => {
          setProductOptions(response.data)
        })
    } catch (error) {
      console.log(error)
    }
  }

  const getInventoryInfo = async (id) => {
    try {
      await axios.get(`${url}/getInventoryById/${id}`).then((response) => {
        const data = response.data[0]
        setInventoryData({
          productId: data.productId,
          quantity: data.quantity,
          location: data.location,
          itemId: data.itemId,
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
              {isEdit ? <h2>Update Inventory</h2> : <h2>New Inventory</h2>}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="productId-label">Product</InputLabel>
                    <Select
                      labelId="productId-label"
                      value={inventoryData.productId}
                      label="Product"
                      onChange={(e) =>
                        handleInputChange('productId', e.target.value)
                      }
                    >
                      {productOptions.map((product) => (
                        <MenuItem
                          key={product.productId}
                          value={product.productId}
                        >
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Quantity"
                    variant="outlined"
                    fullWidth
                    value={inventoryData.quantity}
                    onChange={(e) =>
                      handleInputChange('quantity', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Location"
                    variant="outlined"
                    fullWidth
                    value={inventoryData.location}
                    onChange={(e) =>
                      handleInputChange('location', e.target.value)
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
                      onClick={createInventory}
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
export default InventoryModal
