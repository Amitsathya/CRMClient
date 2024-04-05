import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CustomerRoutes from './authenticated/customer/CustomerRoutes'
import LeaseReview from './test/LeaseReview'
import EmployeeRoutes from './authenticated/employee/EmployeeRoutes'
import InventoryRoutes from './authenticated/inventory/InventoryRoutes'
import ProductRoutes from './authenticated/product/ProductRoutes'
import ServicesRoutes from './authenticated/services/ServicesRoutes'
import FeedbackRoutes from './authenticated/feedback/FeedbackRoutes'
import ResponsiveAppBar from '../components/AppBar'
import RegisterCustomer from './public/RegisterCustomer'
import VisitsRoutes from './authenticated/visits/VisitsRoutes'
const NotFound = () => (
  <div>
    <h1>404 - Not Found</h1>
    {/* You can add more content or redirect to a specific route */}
  </div>
)
const ParentRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/customer/*"
          element={
            <>
              <ResponsiveAppBar />
              <CustomerRoutes />
            </>
          }
        />
        <Route
          path="/visits/*"
          element={
            <>
              <ResponsiveAppBar />
              <VisitsRoutes />
            </>
          }
        />
        <Route
          path="/employee/*"
          element={
            <>
              <ResponsiveAppBar />
              <EmployeeRoutes />
            </>
          }
        />
        <Route
          path="/inventory/*"
          element={
            <>
              <ResponsiveAppBar />
              <InventoryRoutes />
            </>
          }
        />
        <Route
          path="/feedback/*"
          element={
            <>
              <ResponsiveAppBar />
              <FeedbackRoutes />
            </>
          }
        />
        <Route
          path="/product/*"
          element={
            <>
              <ResponsiveAppBar />
              <ProductRoutes />
            </>
          }
        />
        <Route
          path="/services/*"
          element={
            <>
              <ResponsiveAppBar />
              <ServicesRoutes />
            </>
          }
        />
        <Route path="/test" element={<LeaseReview />} />
        <Route
          path="/registerCustomer"
          element={
            <RegisterCustomer
              style={{
                padding: '1rem',
                margin: '3rem 20rem',
              }}
              props={{ modal: false }}
            />
          }
        />
        <Route
          path=""
          element={
            <>
              <ResponsiveAppBar />
              <CustomerRoutes />
            </>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
export default ParentRoutes
