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

const initialRows = [
  {
    id: 1,
    customerName: 'Alice Brown',
    feedback: 'Very satisfied with the service!',
    rating: 5,
  },
  {
    id: 2,
    customerName: 'David Lee',
    feedback: 'Impressive work, thank you!',
    rating: 4,
  },
  {
    id: 3,
    customerName: 'Emily Davis',
    feedback: 'Satisfactory experience overall.',
    rating: 3,
  },
  {
    id: 4,
    customerName: 'Michael Wilson',
    feedback: 'Could improve in certain areas.',
    rating: 3,
  },
  {
    id: 5,
    customerName: 'Sophia Martinez',
    feedback: 'Excellent customer service!',
    rating: 5,
  },
  // Add more feedback data as needed
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
      {/* <Button color="primary" onClick={handleClick}>
        Add Service
      </Button> */}
    </GridToolbarContainer>
  )
}

export default function Feedback() {
  const [rows, setRows] = useState([])
  const [rowModesModel, setRowModesModel] = useState({})
  const [open, setOpen] = useState(false)
  const [fId, setFid] = useState()
  const url = import.meta.env.VITE_REACT_APP_SERVER_URL
  useEffect(() => {
    getFeedbacks()
    setFid()
  }, [open])
  const getFeedbacks = async () => {
    try {
      await axios.get(`${url}/feedbacks`).then((response) => {
        setRows(response.data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const deleteFeedbacks = async (feedbackId) => {
    try {
      await axios
        .post(`${url}/deleteFeedback`, { feedbackId })
        .then((response) => {
          setRows(rows.filter((row) => row.feedbackId !== feedbackId))
        })
    } catch (error) {
      console.log(error)
    }
  }

  const voidFeedbacks = async (feedbackId) => {
    try {
      const currentStatus =
        rows.find((row) => row.feedbackId === feedbackId)?.status || 0
      const newStatus = currentStatus === 0 ? 1 : 0
      const body = {
        feedbackId: feedbackId,
        status: newStatus,
      }
      await axios.post(`${url}/updateFeedback`, body).then((response) => {
        setRows(
          rows.map((row) =>
            row.feedbackId === feedbackId ? { ...row, status: newStatus } : row
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

  const updateFeedbacks = async (feedbackId) => {
    // try {
    //   await axios.post(`${url}/updateFeedbacks`, body).then((response) => {})
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (feedbackId) => () => {
    setOpen(true)
    setFid(feedbackId)
  }

  const handleSaveClick = (feedbackId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [feedbackId]: { mode: GridRowModes.View },
    })
  }

  const handleDeleteClick = (feedbackId) => () => {
    deleteFeedbacks(feedbackId)
  }

  const handleVoidClick = (feedbackId) => () => {
    voidFeedbacks(feedbackId)
  }

  const handleCancelClick = (feedbackId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [feedbackId]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row) => row.feedbackId === feedbackId)
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.feedbackId !== feedbackId))
    }
  }

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false }
    console.log(updatedRow)
    setRows(
      rows.map((row) =>
        row.feedbackId === newRow.feedbackId ? updatedRow : row
      )
    )
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns = [
    {
      field: 'feedbackId',
      headerName: 'Feedback ID',
      flex: 1,
      editable: false,
    },
    {
      field: 'customerName',
      headerName: 'Customer Name',
      flex: 2,
      editable: true,
      valueGetter: (params) =>
        `${params.row.fName || ''} ${params.row.lName || ''}`,
    },
    { field: 'feedback', headerName: 'Feedback', flex: 3, editable: true },
    {
      field: 'rating',
      headerName: 'Rating',
      type: 'number',
      flex: 1,
      editable: true,
    },
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
          // <Tooltip title="Edit">
          //   <GridActionsCellItem
          //     icon={<EditIcon />}
          //     label="Edit"
          //     className="textPrimary"
          //     onClick={handleEditClick(id)}
          //     color="inherit"
          //   />
          // </Tooltip>,
          <Tooltip title="Delete">
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />
          </Tooltip>,
          // <Tooltip title="Void">
          //   <GridActionsCellItem
          //     icon={<CancelIcon />}
          //     label="Cancel"
          //     className="textPrimary"
          //     onClick={handleCancelClick(id)}
          //     color="inherit"
          //   />
          // </Tooltip>,
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
      <h2>Feedback</h2>
      <DataGrid
        getRowHeight={() => 'auto'}
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        getRowId={(row) => row.feedbackId}
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
    </Box>
  )
}
