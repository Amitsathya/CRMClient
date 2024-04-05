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
import InventoryModal from './InventoryModal'

const initialRows = [
  {
    id: 1,
    productName: 'Shampoo',
    category: 'Hair Care',
    quantity: 50,
    location: 'Warehouse A',
  },
  {
    id: 2,
    productName: 'Conditioner',
    category: 'Hair Care',
    quantity: 40,
    location: 'Warehouse B',
  },
  {
    id: 3,
    productName: 'Hair Styling Gel',
    category: 'Hair Care',
    quantity: 30,
    location: 'Warehouse C',
  },
  {
    id: 4,
    productName: 'Hair Brush',
    category: 'Hair Accessories',
    quantity: 60,
    location: 'Warehouse D',
  },
  {
    id: 5,
    productName: 'Hair Dryer',
    category: 'Hair Accessories',
    quantity: 20,
    location: 'Warehouse E',
  },
  // Add more inventory data as needed
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
        Add Inventory
      </Button>
    </GridToolbarContainer>
  )
}

const Inventory = () => {
  const [rows, setRows] = useState([])
  const [open, setOpen] = useState(false)
  const [pId, setPid] = useState()
  const [rowModesModel, setRowModesModel] = useState({})
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL

  useEffect(() => {
    getInventory()
    setPid()
  }, [open])

  const getInventory = async () => {
    try {
      await axios.get(`${url}/inventory`).then((response) => {
        setRows(response.data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const deleteInventory = async (itemId) => {
    try {
      await axios
        .post(`${url}/deleteInventory`, { itemId })
        .then((response) => {
          setRows(rows.filter((row) => row.itemId !== itemId))
        })
    } catch (error) {
      console.log(error)
    }
  }

  const voidInventory = async (itemId) => {
    try {
      const currentStatus =
        rows.find((row) => row.itemId === itemId)?.status || 0
      const newStatus = currentStatus === 0 ? 1 : 0
      const body = {
        itemId: itemId,
        status: newStatus,
      }
      await axios.post(`${url}/updateInventory`, body).then((response) => {
        setRows(
          rows.map((row) =>
            row.itemId === itemId ? { ...row, status: newStatus } : row
          )
        )
        showAlert({
          type: 'error',
          message: 'An error occurred while updating inventory status.',
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const updateInventory = async (itemId) => {
    // try {
    //   await axios.post(`${url}/updateInventory`, body).then((response) => {})
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (itemId) => () => {
    setOpen(true)
    setPid(itemId)
  }

  const handleSaveClick = (itemId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [itemId]: { mode: GridRowModes.View },
    })
  }

  const handleDeleteClick = (itemId) => () => {
    deleteInventory(itemId)
  }

  const handleVoidClick = (itemId) => () => {
    voidInventory(itemId)
  }

  const handleCancelClick = (itemId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [itemId]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row) => row.itemId === itemId)
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.itemId !== itemId))
    }
  }

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false }
    console.log(updatedRow)
    setRows(
      rows.map((row) => (row.itemId === newRow.itemId ? updatedRow : row))
    )
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }
  const columns = [
    { field: 'itemId', headerName: 'Item ID', flex: 1, editable: false },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 2,
      editable: true,
    },
    { field: 'category', headerName: 'Category', flex: 2, editable: true },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      flex: 1,
      editable: true,
    },
    { field: 'location', headerName: 'Location', flex: 2, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 2,
      cellClassName: 'actions',
      getActions: ({ id }) => {
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
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
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
      <h2>Inventory</h2>
      <DataGrid
        getRowHeight={() => 'auto'}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        getRowId={(row) => row.itemId}
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
      <InventoryModal props={{ open, setOpen, pId }}></InventoryModal>
    </Box>
  )
}

export default Inventory
