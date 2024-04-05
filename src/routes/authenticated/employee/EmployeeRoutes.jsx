import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Employee from './Employee'
const EmployeeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Employee />} />
    </Routes>
  )
}
export default EmployeeRoutes
