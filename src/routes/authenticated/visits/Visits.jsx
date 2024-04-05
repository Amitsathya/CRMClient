import React, { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import VisitTab from './VisitsTab'
import ActiveTab from './ActiveTab'

export const Visits = () => {
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Visits" />
          <Tab label="Active" />
        </Tabs>
      </Box>
      {value === 0 && <VisitTab />}
      {value === 1 && <ActiveTab />}
    </Box>
  )
}
