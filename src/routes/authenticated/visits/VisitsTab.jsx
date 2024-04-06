import React, { useState, useEffect } from 'react'
import { Box, Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid'
import RegisterModal from './modals/RegisterModal'
import axios from 'axios'
import AssignModal from './modals/AssignModal'
import CompleteModal from './modals/CompleteModal'
import VisibilityIcon from '@mui/icons-material/Visibility'

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
        Add Visit
      </Button>
    </GridToolbarContainer>
  )
}

export default function VisitTab() {
  const [rows, setRows] = useState([])
  const [open, setOpen] = useState(false)
  const [openActive, setOpenActive] = useState(false)
  const [openComplete, setOpenComplete] = useState(false)
  const [visitId, setVisitId] = useState(null)
  const [rowModesModel, setRowModesModel] = useState({})

  const url = import.meta.env.VITE_REACT_APP_SERVER_URL

  useEffect(() => {
    getVisits()
  }, [open, openActive, openComplete])

  const getVisits = async () => {
    try {
      const response = await axios.get(`${url}/visits`)
      setRows(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteVisit = async (visitId) => {
    try {
      await axios.post(`${url}/deleteVisit`, { visitId }).then((response) => {
        setRows(rows.filter((row) => row.visitId !== visitId))
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleSaveClick = (visitId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [visitId]: { mode: GridRowModes.View },
    })
  }

  const handleCompleteClick = (visitId) => () => {
    setOpenComplete(true)
    setVisitId(visitId)
  }

  const handleEditClick = (visitId) => () => {
    setOpenActive(true)
    setVisitId(visitId)
  }

  const handleDeleteClick = (visitId) => () => {
    deleteVisit(visitId)
  }

  const handleCancelClick = (visitId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [visitId]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row) => row.visitId === visitId)
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.visitId !== visitId))
    }
  }

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false }
    console.log(updatedRow)
    setRows(
      rows.map((row) => (row.visitId === newRow.visitId ? updatedRow : row))
    )
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns = [
    { field: 'visitId', headerName: 'Visit ID', flex: 1, editable: false },
    {
      field: 'customerId',
      headerName: 'Customer',
      flex: 1,
      editable: false,
      valueGetter: (params) =>
        `${params.row.customerfName || ''} ${params.row.customerlName || ''}`,
    },
    {
      field: 'employeeId',
      headerName: 'Employee',
      flex: 1,
      editable: false,
      valueGetter: (params) =>
        `${params.row.employeefName || ''} ${params.row.employeelName || ''}`,
    },
    {
      field: 'feedbackId',
      headerName: 'Feedback',
      flex: 1,
      editable: false,
    },
    { field: 'itemId', headerName: 'Item', flex: 1, editable: false },
    { field: 'serviceName', headerName: 'Service', flex: 1, editable: false },
    {
      field: 'visitDate',
      headerName: 'Visit Date',
      flex: 2,
      editable: false,
      valueFormatter: (params) => {
        const visitDate = new Date(params.value)
        const hours = visitDate.getHours()
        const minutes = visitDate.getMinutes()
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12
        const formattedMinutes = minutes.toString().padStart(2, '0')
        return `${(visitDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${visitDate
          .getDate()
          .toString()
          .padStart(
            2,
            '0'
          )}/${visitDate.getFullYear()} ${formattedHours}:${formattedMinutes} ${ampm}`
      },
    },
    {
      field: 'endDate',
      headerName: 'Visit End Date',
      flex: 2,
      editable: false,
      valueFormatter: (params) => {
        const visitDate = new Date(params.value)
        const hours = visitDate.getHours()
        const minutes = visitDate.getMinutes()
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12
        const formattedMinutes = minutes.toString().padStart(2, '0')
        return `${(visitDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${visitDate
          .getDate()
          .toString()
          .padStart(
            2,
            '0'
          )}/${visitDate.getFullYear()} ${formattedHours}:${formattedMinutes} ${ampm}`
      },
    },
    {
      field: 'duration',
      headerName: 'Duration',
      flex: 1,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      editable: false,
      renderCell: (params) => {
        const statusValue = params.value
        let statusLabel = ''

        switch (statusValue) {
          case 0:
            statusLabel = 'New'
            break
          case 1:
            statusLabel = 'Ongoing'
            break
          case 2:
            statusLabel = 'Completed'
            break
          case 3:
            statusLabel = 'Feedback'
            break
          default:
            statusLabel = ''
        }

        return statusLabel
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
        const actions = []

        if (status === 0) {
          actions.push(
            <Tooltip title="Edit">
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />
            </Tooltip>
          )
        } else if (status === 1) {
          actions.push(
            <React.Fragment>
              <Tooltip title="Edit">
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  className="textPrimary"
                  onClick={handleEditClick(id)}
                  color="inherit"
                />
              </Tooltip>
              <Tooltip title="Finish">
                <GridActionsCellItem
                  icon={<TaskAltIcon />}
                  label="Finish"
                  className="textPrimary"
                  onClick={handleCompleteClick(id)}
                  color="inherit"
                />
              </Tooltip>
            </React.Fragment>
          )
        } else if (status === 2) {
          actions.push(
            <Tooltip title="View">
              <GridActionsCellItem
                icon={<VisibilityIcon />}
                label="View"
                className="textPrimary"
                onClick={handleCompleteClick(id)}
                color="inherit"
              />
            </Tooltip>
          )
        }

        actions.push(
          <Tooltip title="Delete">
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />
          </Tooltip>
        )

        return actions
      },
    },
  ]

  return (
    <Box
      sx={{
        height: '100%',
        width: '98%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <h2>Visits</h2>
      <DataGrid
        getRowHeight={() => 'auto'}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        getRowId={(row) => row.visitId}
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
      <RegisterModal props={{ open, setOpen, visitId }} />
      <AssignModal props={{ openActive, setOpenActive, visitId }} />
      <CompleteModal props={{ openComplete, setOpenComplete, visitId }} />
    </Box>
  )
}
