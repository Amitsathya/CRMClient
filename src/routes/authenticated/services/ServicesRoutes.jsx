import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Services from './Services'
const ServicesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Services />} />
    </Routes>
  )
}
export default ServicesRoutes
