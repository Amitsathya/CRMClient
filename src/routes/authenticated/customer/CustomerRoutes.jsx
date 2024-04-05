import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterCustomer from '../../public/RegisterCustomer'
import Customer from './Customer'
const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Customer />} />
      <Route path="/registerCustomer" element={<RegisterCustomer />} />
    </Routes>
  )
}
export default CustomerRoutes
