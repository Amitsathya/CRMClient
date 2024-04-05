import React, { useState, useEffect } from 'react'
import { Box, Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
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

export default function ActiveTab() {
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
      await axios.get(`${url}/activeVisits`).then((response) => {
        setRows(response.data)
      })
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
      editable: true,
      valueGetter: (params) =>
        `${params.row.customerfName || ''} ${params.row.customerlName || ''}`,
    },
    {
      field: 'employeeId',
      headerName: 'Employee',
      flex: 1,
      editable: true,
      valueGetter: (params) =>
        `${params.row.employeefName || ''} ${params.row.employeelName || ''}`,
    },
    {
      field: 'feedbackId',
      headerName: 'Feedback',
      flex: 1,
      editable: true,
    },
    { field: 'itemId', headerName: 'Item', flex: 1, editable: true },
    { field: 'serviceName', headerName: 'Service', flex: 1, editable: true },
    {
      field: 'visitDate',
      headerName: 'Visit Date',
      flex: 2,
      editable: true,
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
      field: 'status',
      headerName: 'Status',
      flex: 1,
      editable: true,
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

        let voidIcon = <TaskAltIcon />

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
          <Tooltip title="Finish">
            <GridActionsCellItem
              icon={voidIcon}
              label="Void"
              className="textPrimary"
              onClick={handleCompleteClick(id)}
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
        width: '98%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <h2>Active</h2>
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
