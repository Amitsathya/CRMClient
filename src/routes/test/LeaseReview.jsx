import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'

import {
  Paper,
  Typography,
  FilledInput,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Grid,
} from '@mui/material'

export default function LeaseReview({ unitJson, tenancyJson, rows }) {
  useEffect(() => {}, [])
  return (
    <div style={{ paddingLeft: '1rem' }}>
      <h2>Unit Information</h2>
      <Paper>
        <Grid container spacing={3} style={{}}>
          <Grid
            item
            xs="auto"
            style={{
              textAlign: 'right',
              padding: '0',
              margin: '1rem 0rem 1rem 4rem',
            }}
          >
            <span>
              <b>
                Name :
                <br />
                Address :
                <br />
                City :
                <br />
                State :
                <br />
                Zip Code :
              </b>
            </span>
          </Grid>
          <Grid
            item
            style={{
              padding: '0',
              margin: '1rem 0.3rem',
            }}
          >
            <span>
              {' '}
              {unitJson.name}
              <br /> {unitJson.streetAddress}
              <br /> {unitJson.city}
              <br /> {unitJson.state}
              <br /> {unitJson.zipCode}
            </span>
          </Grid>
        </Grid>
      </Paper>
      <h2>Lease Information</h2>
      <Paper>
        <Grid container spacing={3}>
          <Grid
            item
            style={{
              textAlign: 'right',
              padding: '0',
              margin: '1rem 0rem 1rem 4rem',
            }}
          >
            <span>
              <b>
                Lease Start Date :
                <br />
                Lease End Date :
                <br />
                Rent :
                <br />
                Deposit :
                <br />
                Rental Type :
                <br />
                Utilities Included :
                <br />
              </b>
            </span>
          </Grid>
          <Grid
            item
            xs
            style={{
              padding: '0',
              margin: '1rem 0.3rem',
            }}
          >
            <span>
              {tenancyJson.checkin}
              <br />
              {tenancyJson.checkout}
              <br />
              {tenancyJson.rate}
              <br />
              {tenancyJson.deposit}
              <br />
              {tenancyJson.rentalType}
              <span>
                {tenancyJson.electricity == 1 ? <li> Electricity</li> : null}
                {tenancyJson.water == 1 ? <li>Water</li> : null}
                {tenancyJson.garbage == 1 ? <li>Garbage</li> : null}
                {tenancyJson.sewage == 1 ? <li>Sewage</li> : null}
              </span>
            </span>
          </Grid>
        </Grid>
      </Paper>
      <h2>Tenant Information</h2>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b> First Name</b>
              </TableCell>
              <TableCell>
                <b>Last Name</b>
              </TableCell>
              <TableCell>
                <b>Phone Number</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Address</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.fname}</TableCell>
                <TableCell>{row.lname}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}
