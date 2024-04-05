import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Visits } from './Visits'
const VisitsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Visits />} />
    </Routes>
  )
}
export default VisitsRoutes
