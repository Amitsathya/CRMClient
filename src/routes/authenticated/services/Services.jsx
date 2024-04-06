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
import ServiceModal from './ServiceModal'
import axios from 'axios'

// const initialRows = [
//   {
//     id: 1,
//     serviceName: 'Haircut - Men',
//     category: 'Hair Services',
//     description: 'Professional haircut for men.',
//     price: 20,
//   },
//   {
//     id: 2,
//     serviceName: 'Haircut - Women',
//     category: 'Hair Services',
//     description: 'Professional haircut for women.',
//     price: 30,
//   },
//   {
//     id: 3,
//     serviceName: 'Hair Color',
//     category: 'Hair Services',
//     description: 'Hair coloring service for both men and women.',
//     price: 50,
//   },
//   {
//     id: 4,
//     serviceName: 'Shave',
//     category: 'Facial Services',
//     description: 'Traditional or modern shave services.',
//     price: 15,
//   },
//   {
//     id: 5,
//     serviceName: 'Beard Trim',
//     category: 'Facial Services',
//     description: 'Trim and shape your beard.',
//     price: 10,
//   },
//   // Add more services data as needed
// ]

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
        Add Service
      </Button>
    </GridToolbarContainer>
  )
}

const Services = () => {
  const [rows, setRows] = useState([])
  const [open, setOpen] = useState(false)
  const [sId, setSid] = useState()
  const [rowModesModel, setRowModesModel] = useState({})
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL

  useEffect(() => {
    getServices()
    setSid()
  }, [open])

  const getServices = async () => {
    try {
      await axios.get(`${url}/services`).then((response) => {
        setRows(response.data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const deleteServices = async (serviceId) => {
    try {
      await axios
        .post(`${url}/deleteService`, { serviceId })
        .then((response) => {
          setRows(rows.filter((row) => row.serviceId !== serviceId))
        })
    } catch (error) {
      console.log(error)
    }
  }

  const voidServices = async (serviceId) => {
    try {
      const currentStatus =
        rows.find((row) => row.serviceId === serviceId)?.status || 0
      const newStatus = currentStatus === 0 ? 1 : 0
      const body = {
        serviceId: serviceId,
        status: newStatus,
      }
      await axios.post(`${url}/updateService`, body).then((response) => {
        setRows(
          rows.map((row) =>
            row.serviceId === serviceId ? { ...row, status: newStatus } : row
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

  const updateServices = async (serviceId) => {
    // try {
    //   await axios.post(`${url}/updateServices`, body).then((response) => {})
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (serviceId) => () => {
    setOpen(true)
    setSid(serviceId)
  }

  const handleSaveClick = (serviceId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [serviceId]: { mode: GridRowModes.View },
    })
  }

  const handleDeleteClick = (serviceId) => () => {
    deleteServices(serviceId)
  }

  const handleVoidClick = (serviceId) => () => {
    voidServices(serviceId)
  }

  const handleCancelClick = (serviceId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [serviceId]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row) => row.serviceId === serviceId)
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.serviceId !== serviceId))
    }
  }

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false }
    console.log(updatedRow)
    setRows(
      rows.map((row) => (row.serviceId === newRow.serviceId ? updatedRow : row))
    )
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns = [
    { field: 'serviceId', headerName: 'Service ID', flex: 1, editable: false },
    {
      field: 'name',
      headerName: 'Service Name',
      flex: 2,
      editable: false,
    },
    { field: 'category', headerName: 'Category', flex: 2, editable: false },
    {
      field: 'description',
      headerName: 'Description',
      flex: 3,
      editable: false,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      flex: 1,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      editable: false,
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
      <h2>Services</h2>
      <DataGrid
        getRowHeight={() => 'auto'}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        getRowId={(row) => row.serviceId}
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
      <ServiceModal props={{ open, setOpen, sId }}></ServiceModal>
    </Box>
  )
}

export default Services
