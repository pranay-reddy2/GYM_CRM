import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Members from '../pages/Members'
import Checkins from '../pages/Checkins'
import Trainers from '../pages/Trainers'
import Leads from '../pages/Leads'
import MemberProfile from '../pages/MemberProfile'
import Settings from '../pages/Settings'
import TrainerProfile from '../pages/TrainerProfile'

function Maincontent() {
  return (
    <div className="bg-gray-100 flex-1 p-6">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/checkins" element={<Checkins />} />
        <Route path="/trainers" element={<Trainers />}/>
        <Route path="/leads" element={<Leads />} />
        <Route path="/members/:id" element={<MemberProfile />}/>
        <Route path="/settings" element={<Settings />} />
        <Route path="/trainers/:id" element={<TrainerProfile />} />
      </Routes>
    </div>
  )
}
export default Maincontent