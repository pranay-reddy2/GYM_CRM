import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, Dumbbell, Target, Laptop, AlertTriangle, Settings } from 'lucide-react'
function Sidebar() {
  return (
    <div className="bg-gray-800 text-white w-64 h-full p-4">
      <div className="flex items-center space-x-2 mb-6 mt-2">
        <Laptop /><h3>Gym CRM</h3>
      </div>

      <NavLink
        to="/" end
        className={({ isActive }) =>
          `flex items-center space-x-2 py-2 px-4 ${isActive ? 'bg-teal-600' : 'hover:bg-gray-600'}`
        }
      >
        <LayoutDashboard />
        <span className="ml-2">Dashboard</span>
      </NavLink>
      <NavLink
        to="/members"
        className={({ isActive }) =>
          `flex items-center space-x-2 py-2 px-4 ${isActive ? 'bg-teal-600' : 'hover:bg-gray-600'}`
        }
      >
        <Users />
        <span className="ml-2">Members</span>
      </NavLink>

      <NavLink
        to="/checkins"
        className={({ isActive }) =>
          `flex items-center space-x-2 py-2 px-4 ${isActive ? 'bg-teal-600' : 'hover:bg-gray-600'}`
        }
      >
        <Calendar />
        <span className="ml-2">Check-ins</span>
      </NavLink>
      <NavLink
        to="/trainers"
        className={({ isActive }) =>
          `flex items-center space-x-2 py-2 px-4 ${isActive ? 'bg-teal-600' : 'hover:bg-gray-600'}`
        }
      >
        <Dumbbell />
        <span className="ml-2">Trainers</span>
      </NavLink>
      <NavLink
        to="/leads"
        className={({ isActive }) =>
          `flex items-center space-x-2 py-2 px-4 ${isActive ? 'bg-teal-600' : 'hover:bg-gray-600'}`
        }
      >
        <Target />
        <span className="ml-2">Leads</span>
      </NavLink>
      <NavLink
        to="/alerts"
        className={({ isActive }) =>
          `flex items-center space-x-2 py-2 px-4 ${isActive ? 'bg-teal-600' : 'hover:bg-gray-600'}`
        }
      >
        <AlertTriangle />
        <span className="ml-2">Alerts</span>
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex items-center space-x-2 py-2 px-4 ${isActive ? 'bg-teal-600' : 'hover:bg-gray-600'}` 
        }
      >
        <Settings />
        <span className="ml-2">Settings</span>
      </NavLink>
    </div>
  )
}

export default Sidebar