import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inventory from './Inventory'
const InventoryRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Inventory />} />
    </Routes>
  )
}
export default InventoryRoutes
