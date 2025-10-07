import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Purchases from './pages/Purchases'
import Withdrawals from './pages/Withdrawals'
import Packages from './pages/Packages'
import Courses from './pages/Courses'
import CourseDetails from './pages/CourseDetails'
import CourseVideos from './pages/CourseVideos'
import Analytics from './pages/Analytics'
import PackageReferralCodes from './pages/PackageReferralCodes'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="withdrawals" element={<Withdrawals />} />
          <Route path="packages" element={<Packages />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetails />} />
          <Route path="courses/:id/videos" element={<CourseVideos />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="package-referral-codes" element={<PackageReferralCodes />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App