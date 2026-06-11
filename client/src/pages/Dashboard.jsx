import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  Users, Activity, Target, Dumbbell,
  AlertTriangle, Clock, Plus, ArrowRight,
  CheckCircle2, Flame, BarChart3, Calendar,
  Star, User,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_BACKEND_URL

const StatCard = ({ title, value, icon: Icon, color, bg, onClick, sub }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' : ''}`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
        <Icon size={18} className={color} />
      </div>
    </div>
    <p className="text-xs text-slate-400 font-medium">{title}</p>
    <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
)

const RiskBadge = ({ days }) => {
  if (days >= 30) return <span className="text-xs bg-rose-100 text-rose-600 font-semibold px-2 py-0.5 rounded-full">High Risk</span>
  if (days >= 20) return <span className="text-xs bg-amber-100 text-amber-600 font-semibold px-2 py-0.5 rounded-full">Med Risk</span>
  return <span className="text-xs bg-yellow-100 text-yellow-600 font-semibold px-2 py-0.5 rounded-full">At Risk</span>
}

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const navigate = useNavigate()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetch(`${API_URL}/api/dashboard/stats`).then(r => r.json()),
  })

const { data: atRiskMembers = [] } = useQuery({
  queryKey: ["dashboard-at-risk"],

  queryFn: async () => {
    const res = await fetch(
      `${API_URL}/api/alerts/at-risk`
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch at-risk members"
      );
    }

    return res.json();
  },
});
  const { data: activity = [] } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: () => fetch(`${API_URL}/api/dashboard/activity`).then(r => r.json()),
  })

  const { data: checkins = [] } = useQuery({
    queryKey: ['checkins'],
    queryFn: () => fetch(`${API_URL}/api/checkins`).then(r => r.json()),
  })

  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: () => fetch(`${API_URL}/api/members`).then(r => r.json()),
  })

  const activeInsideNow = checkins.filter(c => !c.check_out).length
  const todayCheckins = checkins.length
  const activeMembers = members.filter(m => m.status === 'Active').length
  const inactiveMembers = members.filter(m => m.status === 'Inactive').length

  const planCounts = members.reduce((acc, m) => {
    acc[m.plan] = (acc[m.plan] || 0) + 1
    return acc
  }, {})

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  if (statsLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">{today}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{getGreeting()} 👋</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {activeInsideNow > 0
                ? `${activeInsideNow} member${activeInsideNow > 1 ? 's' : ''} currently inside the gym`
                : 'No members currently checked in'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/checkins')}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition shadow-sm"
            >
              <Clock size={15} />
              Check-in
            </button>
            <button
              onClick={() => navigate('/members')}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              <Plus size={15} />
              Add Member
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Members"
            value={stats?.totalMembers ?? 0}
            icon={Users}
            bg="bg-indigo-50"
            color="text-indigo-600"
            sub={`${activeMembers} active · ${inactiveMembers} inactive`}
            onClick={() => navigate('/members')}
          />
          <StatCard
            title="Inside Now"
            value={activeInsideNow}
            icon={Activity}
            bg="bg-emerald-50"
            color="text-emerald-600"
            sub={`${todayCheckins} total today`}
            onClick={() => navigate('/checkins')}
          />
          <StatCard
            title="At-Risk Members"
            value={stats?.atRiskMembers ?? 0}
            icon={AlertTriangle}
            bg="bg-rose-50"
            color="text-rose-500"
            sub="10+ days inactive"
          />
          <StatCard
            title="Open Leads"
            value={stats?.totalLeads ?? 0}
            icon={Target}
            bg="bg-amber-50"
            color="text-amber-600"
            sub="In pipeline"
            onClick={() => navigate('/leads')}
          />
        </div>

        {/* Secondary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Membership Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700">Membership Plans</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(planCounts).length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No members yet</p>
              ) : (
                Object.entries(planCounts).map(([plan, count]) => {
                  const pct = members.length ? Math.round((count / members.length) * 100) : 0
                  const barColor = plan === 'Monthly' ? 'bg-indigo-400' : plan === 'Quarterly' ? 'bg-emerald-400' : 'bg-violet-400'
                  return (
                    <div key={plan}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-600">{plan}</span>
                        <span className="text-slate-400">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
              <p className="text-xs text-slate-400">{activeMembers} active members</p>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <CheckCircle2 size={11} />
                {members.length > 0 ? Math.round((activeMembers / members.length) * 100) : 0}% active
              </div>
            </div>
          </div>

          {/* Active Trainers */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell size={16} className="text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700">Trainers</h3>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-slate-900">{stats?.activeTrainers ?? 0}</p>
                <p className="text-xs text-slate-400">Active trainers</p>
              </div>
              <div className="w-14 h-14 rounded-full border-4 border-indigo-100 flex items-center justify-center">
                <Star size={20} className="text-indigo-500" />
              </div>
            </div>
            <button
              onClick={() => navigate('/trainers')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              View All Trainers
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* At-Risk Members */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
                  <Flame size={14} className="text-rose-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700">Churn Risk</h3>
              </div>
              {atRiskMembers.length > 0 && (
                <span className="text-xs text-slate-400 font-medium">{atRiskMembers.length} members</span>
              )}
            </div>

            {atRiskMembers.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 size={28} className="text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">All clear!</p>
                <p className="text-xs text-slate-400 mt-0.5">No at-risk members</p>
              </div>
            ) : (
              <div className="space-y-2">
                {atRiskMembers.slice(0, 5).map(member => (
                  <div
                    key={member.id}
                    onClick={() => navigate(`/members/${member.id}`)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {member.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-400">{member.days_inactive}d inactive</p>
                      </div>
                    </div>
                    <RiskBadge days={Number(member.days_inactive)} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Activity size={14} className="text-indigo-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700">Live Activity</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-400">Live</span>
              </div>
            </div>

            {activity.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={28} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No activity yet today</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {activity.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {item.member_name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{item.member_name}</p>
                      <p className="text-xs text-slate-400">Checked in · {item.check_in}</p>
                    </div>
                    <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
