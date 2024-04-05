import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Product from './Product'
const ProductRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Product />} />
    </Routes>
  )
}
export default ProductRoutes
