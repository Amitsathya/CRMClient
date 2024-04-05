import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Feedback from './Feedback'
const FeedbackRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Feedback />} />
    </Routes>
  )
}
export default FeedbackRoutes
