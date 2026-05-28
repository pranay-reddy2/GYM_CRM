import { useQuery } from '@tanstack/react-query'
import StatCard from "../components/StatCard"
import { Users, Activity, UserPlus, AlertTriangle } from "lucide-react"

const API_URL = import.meta.env.VITE_BACKEND_URL

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetch(`${API_URL}/api/dashboard/stats`).then(r => r.json())
  })

  if (isLoading) return <div className="p-6 text-gray-500">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={stats.totalMembers} icon={Users} color="border-blue-500" />
        <StatCard title="Active Members" value={stats.activeMembers} icon={Activity} color="border-green-500" />
        <StatCard title="New Leads" value={stats.totalLeads} icon={UserPlus} color="border-yellow-500" />
        <StatCard title="Active Check-ins" value={stats.activeCheckins} icon={AlertTriangle} color="border-red-500" />
      </div>
    </div>
  )
}

export default Dashboard