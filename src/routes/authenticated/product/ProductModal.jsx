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

const ProductModal = ({ props }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [productData, setProductData] = useState({
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
    if (props.pId) {
      getProductInfo(props.pId)
      setIsEdit(true)
    }
  }, [props.open])

  const handleClose = () => {
    props.setOpen(false)
    setProductData({
      name: '',
      category: '',
      description: '',
      price: '',
      status: 1,
      createdAt: new Date(),
    })
  }

  const handleInputChange = (field, value) => {
    setProductData({ ...productData, [field]: value })
  }

  const createProduct = async () => {
    try {
      await axios.post(`${url}/createProduct`, productData).then((response) => {
        handleClose()
      })
    } catch (error) {
      console.log(error)
    }
  }

  const updateCustomer = async () => {
    try {
      await axios.post(`${url}/updateProduct`, productData).then((response) => {
        handleClose()
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getProductInfo = async (id) => {
    try {
      await axios.get(`${url}/getProductById/${id}`).then((response) => {
        const data = response.data[0]
        setProductData({
          name: data.name,
          productId: data.productId,
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
              {isEdit ? <h2>Update Product</h2> : <h2>New Product</h2>}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Product"
                    variant="outlined"
                    fullWidth
                    value={productData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Price"
                    variant="outlined"
                    fullWidth
                    value={productData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      value={productData.category}
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
                    value={productData.description}
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
                      onClick={updateCustomer}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      style={{ float: 'right' }}
                      onClick={createProduct}
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
export default ProductModal
