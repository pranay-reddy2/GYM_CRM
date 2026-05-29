import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Dumbbell,
  Target,
  Settings,
  CreditCard,
  Sparkles,
} from 'lucide-react'

// ─── Nav structure ────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/',        end: true, icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/members',           icon: Users,            label: 'Members'   },
      { to: '/checkins',          icon: CalendarCheck,    label: 'Check-ins' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { to: '/trainers', icon: Dumbbell,   label: 'Trainers' },
      { to: '/leads',    icon: Target,     label: 'Leads'    },
      { to: '/billing',  icon: CreditCard, label: 'Billing'  },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

// ─── Dumbbell logo mark ───────────────────────────────────────────────────────
function DumbbellMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ color: '#0d9488' }}
    >
      <line x1="6.5" y1="12" x2="17.5" y2="12" />
      <rect x="3" y="9.5" width="2" height="5" rx="1" />
      <rect x="1" y="10.5" width="2" height="3" rx="0.5" />
      <rect x="19" y="9.5" width="2" height="5" rx="1" />
      <rect x="21" y="10.5" width="2" height="3" rx="0.5" />
    </svg>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .gsb * {
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }

        .gsb {
          display: flex;
          flex-direction: column;
          width: 232px;
          min-width: 232px;
          height: 100%;
          background: #f8fafc;
          border-right: 1px solid #e2e8f0;
          overflow: hidden;
        }

        /* ── Logo ── */
        .gsb__logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px 18px 16px;
          border-bottom: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .gsb__logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #f0fdfa;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid #99f6e4;
        }

        .gsb__logo-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }

        .gsb__logo-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
          line-height: 1.2;
          white-space: nowrap;
        }

        .gsb__logo-tagline {
          font-size: 10px;
          font-weight: 500;
          color: #94a3b8;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* ── Scroll area ── */
        .gsb__nav {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 8px 0 4px;
          scrollbar-width: none;
        }
        .gsb__nav::-webkit-scrollbar { display: none; }

        /* ── Group ── */
        .gsb__group {
          padding: 10px 0 2px;
        }

        .gsb__group + .gsb__group {
          border-top: 1px solid #e2e8f0;
          margin-top: 4px;
        }

        .gsb__group-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #94a3b8;
          padding: 0 18px 5px;
          display: block;
        }

        /* ── Nav item ── */
        .gsb__link {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 14px 8px 16px;
          margin: 1px 8px;
          border-radius: 7px;
          font-size: 13.5px;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          position: relative;
          transition: color 0.15s ease, background 0.15s ease;
          border-left: 2px solid transparent;
        }

        .gsb__link:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .gsb__link--active {
          color: #0d9488 !important;
          background: #f0fdfa !important;
          border-left-color: #0d9488 !important;
          font-weight: 600;
        }

        .gsb__link-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          color: #94a3b8;
          transition: color 0.15s ease;
        }

        .gsb__link:hover .gsb__link-icon {
          color: #475569;
        }

        .gsb__link--active .gsb__link-icon {
          color: #0d9488 !important;
        }

        /* ── Footer ── */
        .gsb__footer {
          flex-shrink: 0;
          padding: 10px 14px 14px;
          border-top: 1px solid #e2e8f0;
        }

        .gsb__ai-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 7px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .gsb__ai-badge svg {
          color: #94a3b8;
          flex-shrink: 0;
        }

        .gsb__ai-text {
          font-size: 11px;
          font-weight: 500;
          color: #94a3b8;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        .gsb__ai-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #0d9488;
          margin-left: auto;
          flex-shrink: 0;
          animation: aipulse 2.4s ease-in-out infinite;
        }

        @keyframes aipulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.3); }
        }
      `}</style>

      <aside className="gsb" aria-label="Sidebar navigation">

        {/* Logo */}
        <div className="gsb__logo">
          <div className="gsb__logo-icon">
            <DumbbellMark />
          </div>
          <div className="gsb__logo-text">
            <span className="gsb__logo-name">Gym CRM</span>
            <span className="gsb__logo-tagline">Management Suite</span>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="gsb__nav">
          {NAV_GROUPS.map((group) => (
            <div className="gsb__group" key={group.label}>
              <span className="gsb__group-label">{group.label}</span>

              {group.items.map(({ to, end, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `gsb__link${isActive ? ' gsb__link--active' : ''}`
                  }
                >
                  <Icon className="gsb__link-icon" size={16} strokeWidth={1.75} aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="gsb__footer">
          <div className="gsb__ai-badge" aria-label="Powered by AI">
            <Sparkles size={12} strokeWidth={1.75} />
            <span className="gsb__ai-text">Powered by AI</span>
            <span className="gsb__ai-dot" />
          </div>
        </div>

      </aside>
    </>
  )
}

export default Sidebar