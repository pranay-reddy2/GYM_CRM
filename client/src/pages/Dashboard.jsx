import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Users, Activity, UserPlus, Plus, Target, Dumbbell,
  AlertTriangle, Zap, Clock, CreditCard, ArrowRight,
  CheckCircle2, Flame, Star, Calendar, BarChart3, Sparkles,
  ChevronRight, TrendingUp, TrendingDown ,
  ArrowUpRight,
  Wallet,
} from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// ─── Greeting ────────────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

// ─── Risk Badge ───────────────────────────────────────────────────────────────
const RiskBadge = ({ days }) => {
  if (days >= 30)
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-500 font-semibold px-2.5 py-1 rounded-full border border-red-100">
        High Risk
      </span>
    );
  if (days >= 20)
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-500 font-semibold px-2.5 py-1 rounded-full border border-orange-100">
        Med Risk
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-500 font-semibold px-2.5 py-1 rounded-full border border-amber-100">
      At Risk
    </span>
  );
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-100 rounded-2xl ${className}`} />
);

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ title, value, icon: Icon, iconBg, iconColor, sub, onClick, accent }) => (
  <button
    onClick={onClick}
    className="group relative bg-white rounded-2xl border border-gray-100 p-6 text-left w-full hover:border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
  >
    {/* subtle top accent line */}
    <div className={`absolute top-0 left-0 right-0 h-0.5 ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />

    <div className="flex items-start justify-between mb-5">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon size={18} className={iconColor} />
      </div>
      <ChevronRight
        size={14}
        className="text-gray-200 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all duration-150 mt-1"
      />
    </div>

    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-1.5">{title}</p>
    <p className="text-3xl font-bold text-gray-900 leading-none tabular-nums">{value ?? "—"}</p>
    {sub && <p className="text-xs text-gray-400 mt-2 leading-relaxed">{sub}</p>}
  </button>
);

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, action, onAction }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2.5">
      <Icon size={15} className="text-gray-400" />
      <h3 className="text-sm font-semibold text-gray-700 tracking-tight">{title}</h3>
    </div>
    {action && (
      <button
        onClick={onAction}
        className="text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors"
      >
        {action}
      </button>
    )}
  </div>
);

// ─── Quick Action Row ─────────────────────────────────────────────────────────
const QuickAction = ({ icon: Icon, label, desc, iconBg, iconColor, onClick }) => (
  <button
    onClick={onClick}
    className="group flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
  >
    <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-150`}>
      <Icon size={15} className={iconColor} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
    </div>
    <ChevronRight size={13} className="text-gray-200 group-hover:text-gray-400 transition-colors flex-shrink-0" />
  </button>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, sub }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
      <Icon size={20} className="text-gray-300" />
    </div>
    <p className="text-sm font-semibold text-gray-500">{title}</p>
    {sub && <p className="text-xs text-gray-400 mt-1 max-w-[180px] leading-relaxed">{sub}</p>}
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
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

  // Derived stats — no hardcoding
  const activeInsideNow = checkins.filter(c => !c.check_out).length;
  const todayCheckins = checkins.length;
  const activeMembers = members.filter(m => m.status === "Active").length;
  const inactiveMembers = members.filter(m => m.status === "Inactive").length;

  const planCounts = members.reduce((acc, m) => {
    acc[m.plan] = (acc[m.plan] || 0) + 1;
    return acc;
  }, {});

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const activeRate = members.length
    ? Math.round((activeMembers / members.length) * 100)
    : 0;

  const PLAN_COLORS = {
    Monthly: { bar: "bg-teal-500", dot: "bg-teal-500" },
    Quarterly: { bar: "bg-blue-500", dot: "bg-blue-500" },
    Annual: { bar: "bg-purple-500", dot: "bg-purple-500" },
  };
  const fallbackColor = { bar: "bg-gray-400", dot: "bg-gray-400" };

  if (statsLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-5">
          <Skeleton className="h-14 w-72" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-44" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              <span className="text-xs text-gray-400 font-medium tracking-wide">{today}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {getGreeting()} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {activeInsideNow > 0
                ? `${activeInsideNow} member${activeInsideNow !== 1 ? "s" : ""} currently inside the gym`
                : "No members currently checked in"}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => navigate("/checkins")}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
            >
              <Clock size={14} />
              Check-in
            </button>
            <button
              onClick={() => navigate("/members")}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition shadow-sm"
            >
              <Plus size={14} />
              Add Member
            </button>
          </div>
        </div>

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Members"
            value={stats?.totalMembers ?? 0}
            icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            accent="bg-gradient-to-r from-blue-400 to-blue-600"
            sub={`${activeMembers} active · ${inactiveMembers} inactive`}
            onClick={() => navigate("/members")}
          />
          <KpiCard
            title="Inside Now"
            value={activeInsideNow}
            icon={Activity}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            accent="bg-gradient-to-r from-green-400 to-teal-500"
            sub={`${todayCheckins} check-in${todayCheckins !== 1 ? "s" : ""} today`}
            onClick={() => navigate("/checkins")}
          />
          <KpiCard
            title="At-Risk Members"
            value={stats?.atRiskMembers ?? 0}
            icon={AlertTriangle}
            iconBg="bg-red-50"
            iconColor="text-red-500"
            accent="bg-gradient-to-r from-red-400 to-red-500"
            sub="10+ days inactive"
            onClick={() => navigate("/alerts")}
          />
          <KpiCard
            title="Open Leads"
            value={stats?.totalLeads ?? 0}
            icon={Target}
            iconBg="bg-amber-50"
            iconColor="text-amber-500"
            accent="bg-gradient-to-r from-amber-400 to-amber-500"
            sub="In pipeline"
            onClick={() => navigate("/leads")}
          />
        </div>

        {/* ── Secondary Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Revenue Card */}


          {/* Membership Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={BarChart3} title="Membership Plans" />

            {Object.entries(planCounts).length === 0 ? (
              <EmptyState icon={Users} title="No members yet" sub="Plans will appear here once members are added" />
            ) : (
              <>
                <div className="space-y-4">
                  {Object.entries(planCounts).map(([plan, count]) => {
                    const pct = members.length ? Math.round((count / members.length) * 100) : 0;
                    const colors = PLAN_COLORS[plan] ?? fallbackColor;
                    return (
                      <div key={plan}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                            <span className="text-xs font-semibold text-gray-700">{plan}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900 tabular-nums">{count}</span>
                            <span className="text-xs text-gray-400">({pct}%)</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors.bar} rounded-full transition-all duration-700`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <p className="text-xs text-gray-400">{members.length} total members</p>
                  <div className="flex items-center gap-1.5 text-xs text-teal-600 font-semibold">
                    <CheckCircle2 size={11} />
                    {activeRate}% active
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Trainers */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
            <SectionHeader icon={Dumbbell} title="Trainers" />

            {(stats?.activeTrainers ?? 0) > 0 ? (
              <div className="flex items-center justify-between flex-1">
                <div>
                  <p className="text-4xl font-bold text-gray-900 tabular-nums leading-none">
                    {stats.activeTrainers}
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5">Active trainers</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center">
                  <Star size={22} className="text-teal-500" />
                </div>
              </div>
            ) : (
              <EmptyState icon={Dumbbell} title="No trainers yet" sub="Add trainers to track them here" />
            )}

            <button
              onClick={() => navigate("/trainers")}
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition"
            >
              View All Trainers
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Churn Risk */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader
              icon={Flame}
              title="Churn Risk"
              action={atRiskMembers.length > 0 ? "View all" : undefined}
              onAction={() => navigate("/alerts")}
            />

            {atRiskMembers.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="All clear!"
                sub="No at-risk members right now 🎉"
              />
            ) : (
              <>
                <div className="space-y-1">
                  {atRiskMembers.slice(0, 4).map(member => (
                    <button
                      key={member.id}
                      onClick={() => navigate(`/members/${member.id}`)}
                      className="group flex items-center justify-between w-full p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {member.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{member.name}</p>
                          <p className="text-xs text-gray-400">{member.days_inactive}d inactive</p>
                        </div>
                      </div>
                      <RiskBadge days={Number(member.days_inactive)} />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/alerts")}
                  className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-teal-600 py-2.5 hover:bg-teal-50 rounded-xl transition-colors font-semibold"
                >
                  <Sparkles size={12} className="text-teal-500" />
                  Generate AI re-engagement messages
                </button>
              </>
            )}
          </div>

          {/* Live Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <Activity size={15} className="text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700 tracking-tight">Live Activity</h3>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                <span className="text-xs text-green-600 font-semibold">Live</span>
              </div>
            </div>

            {activity.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No activity yet"
                sub="Check-ins will appear here in real time"
              />
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {activity.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {item.member_name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.member_name}</p>
                      <p className="text-xs text-gray-400">Checked in · {item.check_in}</p>
                    </div>
                    <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={Zap} title="Quick Actions" />

            <div className="space-y-1">
              <QuickAction
                icon={UserPlus}
                label="Add New Member"
                desc="Register a new gym member"
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
                onClick={() => navigate("/members")}
              />
              <QuickAction
                icon={Target}
                label="Add Lead"
                desc="Track a potential member"
                iconBg="bg-amber-50"
                iconColor="text-amber-500"
                onClick={() => navigate("/leads")}
              />
              <QuickAction
                icon={Clock}
                label="Log Check-in"
                desc="Record a member visit"
                iconBg="bg-green-50"
                iconColor="text-green-600"
                onClick={() => navigate("/checkins")}
              />
              <QuickAction
                icon={Sparkles}
                label="AI Messages"
                desc="Generate re-engagement messages"
                iconBg="bg-teal-50"
                iconColor="text-teal-600"
                onClick={() => navigate("/alerts")}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}