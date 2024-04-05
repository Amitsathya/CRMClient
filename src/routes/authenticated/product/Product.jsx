import React, { useState, useEffect } from 'react'
import { Box, Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid'
import axios from 'axios'
import ProductModal from './ProductModal'

const initialRows = [
  {
    id: 1,
    productName: 'Shampoo',
    category: 'Hair Care',
    description: 'Professional shampoo for all hair types.',
    price: 15,
  },
  {
    id: 2,
    productName: 'Conditioner',
    category: 'Hair Care',
    description: 'Moisturizing conditioner for smooth hair.',
    price: 12,
  },
  {
    id: 3,
    productName: 'Hair Styling Gel',
    category: 'Hair Care',
    description: 'Strong hold hair styling gel for men and women.',
    price: 10,
  },
  {
    id: 4,
    productName: 'Hair Brush',
    category: 'Hair Accessories',
    description: 'High-quality hair brush for detangling and styling.',
    price: 8,
  },
  {
    id: 5,
    productName: 'Hair Dryer',
    category: 'Hair Accessories',
    description: 'Professional hair dryer for quick drying.',
    price: 30,
  },
  // Add more product data as needed
]

function EditToolbar({ setOpen }) {
  const handleClick = () => {
    setOpen(true)
  }
  return (
    <GridToolbarContainer
      sx={{
        justifyContent: 'flex-end', // Align content to the right
      }}
    >
      <Button color="primary" onClick={handleClick}>
        Add Product
      </Button>
    </GridToolbarContainer>
  )
}

const Product = () => {
  const [rows, setRows] = useState([])
  const [rowModesModel, setRowModesModel] = useState({})
  const [open, setOpen] = useState(false)
  const [pId, setPid] = useState()
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL
  useEffect(() => {
    getProducts()
    setPid()
  }, [open])

  const getProducts = async () => {
    try {
      await axios.get(`${url}/products`).then((response) => {
        setRows(response.data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const deleteProducts = async (productId) => {
    try {
      await axios
        .post(`${url}/deleteProduct`, { productId })
        .then((response) => {
          setRows(rows.filter((row) => row.productId !== productId))
        })
    } catch (error) {
      console.log(error)
    }
  }

  const voidProducts = async (productId) => {
    try {
      const currentStatus =
        rows.find((row) => row.productId === productId)?.status || 0
      const newStatus = currentStatus === 0 ? 1 : 0
      const body = {
        productId: productId,
        status: newStatus,
      }
      await axios.post(`${url}/updateProduct`, body).then((response) => {
        setRows(
          rows.map((row) =>
            row.productId === productId ? { ...row, status: newStatus } : row
          )
        )
        showAlert({
          type: 'error',
          message: 'An error occurred while updating employee status.',
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const updateProducts = async (productId) => {
    // try {
    //   await axios.post(`${url}/updateProducts`, body).then((response) => {})
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (productId) => () => {
    setOpen(true)
    setPid(productId)
  }

  const handleSaveClick = (productId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [productId]: { mode: GridRowModes.View },
    })
  }

  const handleDeleteClick = (productId) => () => {
    deleteProducts(productId)
  }

  const handleVoidClick = (productId) => () => {
    voidProducts(productId)
  }

  const handleCancelClick = (productId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [productId]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row) => row.productId === productId)
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.productId !== productId))
    }
  }

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false }
    console.log(updatedRow)
    setRows(
      rows.map((row) => (row.productId === newRow.productId ? updatedRow : row))
    )
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns = [
    { field: 'productId', headerName: 'Product ID', flex: 1, editable: false },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 2,
      editable: true,
    },
    { field: 'category', headerName: 'Category', flex: 2, editable: true },
    {
      field: 'description',
      headerName: 'Description',
      flex: 3,
      editable: true,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      flex: 1,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      editable: true,
      type: 'number',
      renderCell: (params) => {
        const statusValue = params.value
        return statusValue === 1 ? 'Active' : 'Inactive'
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 2,
      cellClassName: 'actions',
      getActions: ({ id, row }) => {
        const { status } = row
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

        let voidIcon = <VerifiedUserIcon />
        if (status == 1) {
          voidIcon = <PersonRemoveIcon />
        }

        return [
          <Tooltip title="Edit">
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip title="Delete">
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip title="Void">
            <GridActionsCellItem
              icon={voidIcon}
              label="Void"
              className="textPrimary"
              onClick={handleVoidClick(id)}
              color="inherit"
            />
          </Tooltip>,
        ]
      },
    },
  ]

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <h2>Products</h2>
      <DataGrid
        getRowHeight={() => 'auto'}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        getRowId={(row) => row.productId}
        slots={{
          toolbar: () => <EditToolbar setOpen={setOpen} />,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 15]}
      />
      <ProductModal props={{ open, setOpen, pId }}></ProductModal>
    </Box>
  )
}
export default Product
