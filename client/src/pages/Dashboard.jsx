import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Users, Activity, UserPlus, Plus, Target, Dumbbell,
  TrendingUp, TrendingDown, AlertTriangle, Zap,
  Clock, CreditCard, ArrowRight, CheckCircle2,
  Flame, Star, Calendar, BarChart3, Sparkles,
  User, ChevronRight
} from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Mini sparkline bar chart
const MiniBar = ({ values = [], color = "bg-teal-400" }) => {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {values.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${color} opacity-70`}
          style={{ height: `${(v / max) * 100}%`, minHeight: 2 }}
        />
      ))}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, color, bg, onClick, sub }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" : ""}`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
        <Icon size={18} className={color} />
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
          {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <p className="text-xs text-gray-400 font-medium">{title}</p>
    <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
    {trendLabel && <p className="text-xs text-gray-400 mt-1">{trendLabel}</p>}
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const RiskBadge = ({ days }) => {
  if (days >= 30) return <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">High Risk</span>;
  if (days >= 20) return <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full">Med Risk</span>;
  return <span className="text-xs bg-yellow-100 text-yellow-600 font-semibold px-2 py-0.5 rounded-full">At Risk</span>;
};

const QuickAction = ({ icon: Icon, label, desc, color, bg, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition group text-left"
  >
    <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
      <Icon size={16} className={color} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
    <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition" />
  </button>
);

// Time of day greeting
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

// Format time ago
const timeAgo = (checkinTime) => {
  if (!checkinTime) return "";
  return checkinTime;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => fetch(`${API_URL}/api/dashboard/stats`).then(r => r.json()),
  });

  const { data: atRiskMembers = [] } = useQuery({
    queryKey: ["dashboard-at-risk"],
    queryFn: () => fetch(`${API_URL}/api/dashboard/at-risk`).then(r => r.json()),
  });

  const { data: activity = [] } = useQuery({
    queryKey: ["dashboard-activity"],
    queryFn: () => fetch(`${API_URL}/api/dashboard/activity`).then(r => r.json()),
  });

  const { data: checkins = [] } = useQuery({
    queryKey: ["checkins"],
    queryFn: () => fetch(`${API_URL}/api/checkins`).then(r => r.json()),
  });

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: () => fetch(`${API_URL}/api/members`).then(r => r.json()),
  });

  // Derived stats
  const activeInsideNow = checkins.filter(c => !c.check_out).length;
  const todayCheckins = checkins.length;
  const activeMembers = members.filter(m => m.status === "Active").length;
  const inactiveMembers = members.filter(m => m.status === "Inactive").length;

  // Plan breakdown
  const planCounts = members.reduce((acc, m) => {
    acc[m.plan] = (acc[m.plan] || 0) + 1;
    return acc;
  }, {});

  // Today's date
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  if (statsLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* TOP HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-400 font-medium">{today}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{getGreeting()} 👋</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {activeInsideNow > 0
                ? `${activeInsideNow} member${activeInsideNow > 1 ? "s" : ""} currently inside the gym`
                : "No members currently checked in"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/checkins")}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition shadow-sm"
            >
              <Clock size={15} />
              Check-in
            </button>
            <button
              onClick={() => navigate("/members")}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-700 transition shadow-sm"
            >
              <Plus size={15} />
              Add Member
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Members"
            value={stats?.totalMembers ?? 0}
            icon={Users}
            bg="bg-blue-50"
            color="text-blue-600"
            sub={`${activeMembers} active · ${inactiveMembers} inactive`}
            onClick={() => navigate("/members")}
          />
          <StatCard
            title="Inside Now"
            value={activeInsideNow}
            icon={Activity}
            bg="bg-green-50"
            color="text-green-600"
            sub={`${todayCheckins} total today`}
            onClick={() => navigate("/checkins")}
          />
          <StatCard
            title="At-Risk Members"
            value={stats?.atRiskMembers ?? 0}
            icon={AlertTriangle}
            bg="bg-red-50"
            color="text-red-500"
            sub="10+ days inactive"
            onClick={() => navigate("/alerts")}
          />
          <StatCard
            title="Open Leads"
            value={stats?.totalLeads ?? 0}
            icon={Target}
            bg="bg-amber-50"
            color="text-amber-600"
            sub="In pipeline"
            onClick={() => navigate("/leads")}
          />
        </div>

        {/* SECONDARY ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Revenue Card */}
          <div className="bg-gray-900 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <CreditCard size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Revenue This Month</p>
                </div>
              </div>
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <p className="text-3xl font-bold">
              ₹{(stats?.revenue || 0).toLocaleString("en-IN")}
            </p>
            <div className="mt-4">
              <MiniBar values={[20, 45, 30, 60, 40, 70, 55, stats?.revenue ? Math.min(100, stats.revenue / 100) : 30]} color="bg-teal-400" />
            </div>
            <button
              onClick={() => navigate("/members")}
              className="mt-3 text-xs text-gray-400 hover:text-white flex items-center gap-1 transition"
            >
              View payments <ArrowRight size={11} />
            </button>
          </div>

          {/* Membership Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700">Membership Plans</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(planCounts).length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">No members yet</p>
              ) : (
                Object.entries(planCounts).map(([plan, count]) => {
                  const pct = members.length ? Math.round((count / members.length) * 100) : 0;
                  const barColor = plan === "Monthly" ? "bg-blue-400" : plan === "Quarterly" ? "bg-teal-400" : "bg-purple-400";
                  return (
                    <div key={plan}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-600">{plan}</span>
                        <span className="text-gray-400">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">{activeMembers} active members</p>
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <CheckCircle2 size={11} />
                {members.length > 0 ? Math.round((activeMembers / members.length) * 100) : 0}% active
              </div>
            </div>
          </div>

          {/* Active Trainers */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell size={16} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700">Trainers</h3>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats?.activeTrainers ?? 0}</p>
                <p className="text-xs text-gray-400">Active trainers</p>
              </div>
              <div className="w-14 h-14 rounded-full border-4 border-teal-100 flex items-center justify-center">
                <Star size={20} className="text-teal-500" />
              </div>
            </div>
            <button
              onClick={() => navigate("/trainers")}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              View All Trainers
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* At-Risk Members */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                  <Flame size={14} className="text-red-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Churn Risk</h3>
              </div>
              <button onClick={() => navigate("/alerts")} className="text-xs text-teal-600 hover:underline font-medium">
                View all
              </button>
            </div>

            {atRiskMembers.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 size={28} className="text-green-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">All clear!</p>
                <p className="text-xs text-gray-400 mt-0.5">No at-risk members 🎉</p>
              </div>
            ) : (
              <div className="space-y-2">
                {atRiskMembers.slice(0, 4).map(member => (
                  <div
                    key={member.id}
                    onClick={() => navigate(`/members/${member.id}`)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {member.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-400">{member.days_inactive}d inactive</p>
                      </div>
                    </div>
                    <RiskBadge days={Number(member.days_inactive)} />
                  </div>
                ))}
              </div>
            )}

            {atRiskMembers.length > 0 && (
              <button
                onClick={() => navigate("/alerts")}
                className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-800 py-2 hover:bg-gray-50 rounded-lg transition"
              >
                <Sparkles size={12} className="text-purple-400" />
                Generate AI re-engagement messages
              </button>
            )}
          </div>

          {/* Recent Activity Feed */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Activity size={14} className="text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Live Activity</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-400">Live</span>
              </div>
            </div>

            {activity.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={28} className="text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No activity yet today</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {activity.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {item.member_name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.member_name}</p>
                      <p className="text-xs text-gray-400">Checked in · {item.check_in}</p>
                    </div>
                    <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                <Zap size={14} className="text-purple-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <QuickAction icon={UserPlus} label="Add New Member" desc="Register a new gym member" bg="bg-blue-50" color="text-blue-600" onClick={() => navigate("/members")} />
              <QuickAction icon={Target} label="Add Lead" desc="Track a potential member" bg="bg-amber-50" color="text-amber-600" onClick={() => navigate("/leads")} />
              <QuickAction icon={Clock} label="Log Check-in" desc="Record a member visit" bg="bg-green-50" color="text-green-600" onClick={() => navigate("/checkins")} />
              <QuickAction icon={Sparkles} label="AI Messages" desc="Generate re-engagement messages" bg="bg-purple-50" color="text-purple-600" onClick={() => navigate("/alerts")} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}