import React, { useState, useEffect } from 'react'
import { Box, Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import showAlert from '../../../components/Alert'
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid'
import CustomerModal from './CustomerModal'
import axios from 'axios'

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
        Add Customer
      </Button>
    </GridToolbarContainer>
  )
}

export default function Customer() {
  const [rows, setRows] = useState([])
  const [open, setOpen] = useState(false)
  const [cId, setCid] = useState()
  const [rowModesModel, setRowModesModel] = useState({})
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL

  useEffect(() => {
    getCustomers()
    setCid()
  }, [open])

  const getCustomers = async () => {
    try {
      await axios.get(`${url}/customers`).then((response) => {
        setRows(response.data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const deleteCustomer = async (customerId) => {
    try {
      await axios
        .post(`${url}/deleteCustomer`, { customerId })
        .then((response) => {
          setRows(rows.filter((row) => row.customerId !== customerId))
        })
    } catch (error) {
      console.log(error)
    }
  }

  const voidCustomer = async (customerId) => {
    try {
      const currentStatus =
        rows.find((row) => row.customerId === customerId)?.status || 0
      const newStatus = currentStatus === 0 ? 1 : 0
      const body = {
        customerId: customerId,
        status: newStatus,
      }
      await axios.post(`${url}/updateCustomer`, body).then((response) => {
        setRows(
          rows.map((row) =>
            row.customerId === customerId ? { ...row, status: newStatus } : row
          )
        )
        showAlert({
          type: 'error',
          message: 'An error occurred while updating customer status.',
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const updateCustomer = async (customerId) => {
    // try {
    //   await axios.post(`${url}/updateCustomer`, body).then((response) => {})
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (customerId) => () => {
    setOpen(true)
    setCid(customerId)
  }

  const handleSaveClick = (customerId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [customerId]: { mode: GridRowModes.View },
    })
  }

  const handleDeleteClick = (customerId) => () => {
    deleteCustomer(customerId)
  }

  const handleVoidClick = (customerId) => () => {
    voidCustomer(customerId)
  }

  const handleCancelClick = (customerId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [customerId]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row) => row.customerId === customerId)
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.customerId !== customerId))
    }
  }

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false }
    console.log(updatedRow)
    setRows(
      rows.map((row) =>
        row.customerId === newRow.customerId ? updatedRow : row
      )
    )
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }
  const columns = [
    {
      field: 'customerId',
      headerName: 'Customer ID',
      flex: 1,
      editable: false,
    },
    {
      field: 'fName',
      headerName: 'First Name',
      flex: 2,
      editable: true,
    },
    {
      field: 'lName',
      headerName: 'Last Name',
      flex: 2,
      editable: true,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'sex',
      headerName: 'Sex',
      flex: 1,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Male', 'Female', 'Other'],
    },
    {
      field: 'city',
      headerName: 'City',
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
      field: 'phone',
      headerName: 'Phone Number',
      type: 'number',
      flex: 2,
      align: 'left',
      headerAlign: 'left',
      editable: true,
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
      <h2>Customer</h2>
      <DataGrid
        getRowHeight={() => 'auto'}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        getRowId={(row) => row.customerId}
        slots={{
          toolbar: () => <EditToolbar setOpen={setOpen} />,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        processRowUpdate={processRowUpdate}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 15]}
      />
      <CustomerModal
        props={{ open, setOpen, cId, modal: true }}
      ></CustomerModal>
    </Box>
  )
}
