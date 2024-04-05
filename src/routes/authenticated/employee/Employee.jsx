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
import EmployeeModal from './EmployeeModal'
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
        Add Employee
      </Button>
    </GridToolbarContainer>
  )
}

export default function Employee() {
  const [rows, setRows] = useState([])
  const [open, setOpen] = useState(false)
  const [eId, setEid] = useState()
  const [rowModesModel, setRowModesModel] = useState({})
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL

  useEffect(() => {
    getEmployees()
    setEid()
  }, [open])

  const getEmployees = async () => {
    try {
      await axios.get(`${url}/employees`).then((response) => {
        setRows(response.data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const deleteEmployee = async (employeeId) => {
    try {
      await axios
        .post(`${url}/deleteEmployee`, { employeeId })
        .then((response) => {
          setRows(rows.filter((row) => row.employeeId !== employeeId))
        })
    } catch (error) {
      console.log(error)
    }
  }

  const voidEmployee = async (employeeId) => {
    try {
      const currentStatus =
        rows.find((row) => row.employeeId === employeeId)?.status || 0
      const newStatus = currentStatus === 0 ? 1 : 0
      const body = {
        employeeId: employeeId,
        status: newStatus,
      }
      await axios.post(`${url}/updateEmployee`, body).then((response) => {
        setRows(
          rows.map((row) =>
            row.employeeId === employeeId ? { ...row, status: newStatus } : row
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

  const updateEmployee = async (employeeId) => {
    // try {
    //   await axios.post(`${url}/updateEmployee`, body).then((response) => {})
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (employeeId) => () => {
    setOpen(true)
    setEid(employeeId)
  }

  const handleSaveClick = (employeeId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [employeeId]: { mode: GridRowModes.View },
    })
  }

  const handleDeleteClick = (employeeId) => () => {
    deleteEmployee(employeeId)
  }

  const handleVoidClick = (employeeId) => () => {
    voidEmployee(employeeId)
  }

  const handleCancelClick = (employeeId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [employeeId]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row) => row.employeeId === employeeId)
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.employeeId !== employeeId))
    }
  }

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false }
    console.log(updatedRow)
    setRows(
      rows.map((row) =>
        row.employeeId === newRow.employeeId ? updatedRow : row
      )
    )
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }
  const columns = [
    {
      field: 'employeeId',
      headerName: 'Employee ID',
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
      field: 'position',
      headerName: 'Position',
      flex: 2,
      editable: true,
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 2,
      editable: true,
    },
    {
      field: 'salary',
      headerName: 'Salary',
      type: 'number',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
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
      <h2>Employee</h2>
      <DataGrid
        getRowHeight={() => 'auto'}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        getRowId={(row) => row.employeeId}
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
      <EmployeeModal props={{ open, setOpen, eId }}></EmployeeModal>
    </Box>
  )
}
