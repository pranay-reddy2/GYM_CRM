import { useState, useEffect } from "react";

// Route-to-label mapping for breadcrumb display
const ROUTE_LABELS = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/members": "Members",
  "/members/new": "New Member",
  "/checkins": "Check-ins",
  "/check-ins": "Check-ins",
  "/attendance": "Attendance",
  "/billing": "Billing",
  "/payments": "Payments",
  "/reports": "Reports",
  "/analytics": "Analytics",
  "/staff": "Staff",
  "/settings": "Settings",
  "/classes": "Classes",
  "/schedule": "Schedule",
  "/equipment": "Equipment",
  "/leads": "Leads",
  "/communications": "Communications",
};

function getBreadcrumbs(pathname) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "Dashboard", path: "/" }];
  }

  const crumbs = [];
  let accumulated = "";

  for (let i = 0; i < segments.length; i++) {
    accumulated += "/" + segments[i];
    const label =
      ROUTE_LABELS[accumulated] ||
      segments[i]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, path: accumulated });
  }

  return crumbs;
}

function BellIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function DropdownChevron({ open }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 0.2s ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function Header() {
  const [pathname, setPathname] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/"
  );
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [hasNotif] = useState(true); // static badge for visual purposes

  // Keep breadcrumb in sync with browser navigation
  useEffect(() => {
    const handlePop = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest("[data-header-dropdown]")) {
        setAvatarOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const breadcrumbs = getBreadcrumbs(pathname);
  const currentPage = breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .gym-header * {
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
        }

        .gym-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 24px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* Breadcrumb */
        .gym-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }

        .gym-breadcrumb__crumb {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }

        .gym-breadcrumb__link {
          font-size: 13.5px;
          font-weight: 500;
          color: #9ca3af;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.15s ease;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }

        .gym-breadcrumb__link:hover {
          color: #0d9488;
        }

        .gym-breadcrumb__separator {
          color: #d1d5db;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .gym-breadcrumb__current {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Right controls */
        .gym-header__right {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        /* Notification button */
        .gym-notif-btn {
          position: relative;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: transparent;
          border: none;
          color: #6b7280;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .gym-notif-btn:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .gym-notif-btn.active {
          background: #f0fdf9;
          color: #0d9488;
        }

        .gym-notif-badge {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 7px;
          height: 7px;
          background: #0d9488;
          border-radius: 50%;
          border: 1.5px solid #ffffff;
        }

        /* Notification dropdown */
        .gym-notif-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 300px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
          overflow: hidden;
          animation: dropdownFade 0.15s ease;
        }

        .gym-notif-header {
          padding: 12px 16px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f3f4f6;
        }

        .gym-notif-header span {
          font-size: 12.5px;
          font-weight: 600;
          color: #1f2937;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .gym-notif-clear {
          font-size: 11.5px;
          font-weight: 500;
          color: #0d9488;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .gym-notif-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 11px 16px;
          border-bottom: 1px solid #f9fafb;
          transition: background 0.12s;
          cursor: default;
        }

        .gym-notif-item:last-child {
          border-bottom: none;
        }

        .gym-notif-item:hover {
          background: #f9fafb;
        }

        .gym-notif-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #0d9488;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .gym-notif-dot.read {
          background: #e5e7eb;
        }

        .gym-notif-text {
          flex: 1;
          min-width: 0;
        }

        .gym-notif-text p {
          margin: 0;
          font-size: 12.5px;
          color: #374151;
          line-height: 1.4;
          font-weight: 500;
        }

        .gym-notif-text span {
          font-size: 11px;
          color: #9ca3af;
          font-weight: 400;
        }

        /* Avatar button */
        .gym-avatar-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 6px 4px 4px;
          border-radius: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease;
          margin-left: 4px;
        }

        .gym-avatar-btn:hover {
          background: #f3f4f6;
        }

        .gym-avatar-btn.active {
          background: #f0fdf9;
        }

        .gym-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .gym-avatar-initials {
          font-size: 11.5px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.04em;
        }

        .gym-avatar-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1px;
        }

        .gym-avatar-name {
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.2;
        }

        .gym-avatar-role {
          font-size: 11px;
          font-weight: 400;
          color: #9ca3af;
          line-height: 1.2;
        }

        .gym-avatar-chevron {
          color: #9ca3af;
          margin-left: 2px;
        }

        /* Avatar dropdown */
        .gym-avatar-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 210px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
          overflow: hidden;
          animation: dropdownFade 0.15s ease;
        }

        .gym-dropdown-profile {
          padding: 14px 16px 12px;
          border-bottom: 1px solid #f3f4f6;
        }

        .gym-dropdown-profile-name {
          font-size: 13.5px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 2px;
        }

        .gym-dropdown-profile-email {
          font-size: 11.5px;
          color: #9ca3af;
          margin: 0;
        }

        .gym-dropdown-section {
          padding: 6px;
        }

        .gym-dropdown-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 10px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
        }

        .gym-dropdown-item:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .gym-dropdown-item.danger {
          color: #ef4444;
        }

        .gym-dropdown-item.danger:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        .gym-dropdown-item svg {
          opacity: 0.7;
          flex-shrink: 0;
        }

        .gym-dropdown-divider {
          height: 1px;
          background: #f3f4f6;
          margin: 2px 6px;
        }

        /* Dropdown wrapper */
        .gym-dropdown-wrapper {
          position: relative;
        }

        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 480px) {
          .gym-avatar-meta,
          .gym-avatar-chevron {
            display: none;
          }
          .gym-header {
            padding: 0 16px;
          }
        }
      `}</style>

      <header className="gym-header">
        {/* Breadcrumb */}
        <nav className="gym-breadcrumb" aria-label="Breadcrumb">
          {breadcrumbs.length > 1
            ? breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <span key={crumb.path} className="gym-breadcrumb__crumb">
                    {i > 0 && (
                      <span className="gym-breadcrumb__separator" aria-hidden="true">
                        <ChevronIcon />
                      </span>
                    )}
                    {isLast ? (
                      <span className="gym-breadcrumb__current" aria-current="page">
                        {crumb.label}
                      </span>
                    ) : (
                      <button
                        className="gym-breadcrumb__link"
                        onClick={() => {
                          window.history.pushState({}, "", crumb.path);
                          setPathname(crumb.path);
                        }}
                      >
                        {crumb.label}
                      </button>
                    )}
                  </span>
                );
              })
            : (
              <span className="gym-breadcrumb__current" aria-current="page">
                {currentPage}
              </span>
            )}
        </nav>

        {/* Right controls */}
        <div className="gym-header__right">

          {/* Notification Bell */}
          <div className="gym-dropdown-wrapper" data-header-dropdown>
            <button
              className={`gym-notif-btn${notifOpen ? " active" : ""}`}
              aria-label="Notifications"
              onClick={() => {
                setNotifOpen((v) => !v);
                setAvatarOpen(false);
              }}
            >
              <BellIcon />
              {hasNotif && <span className="gym-notif-badge" />}
            </button>

            {notifOpen && (
              <div className="gym-notif-dropdown" role="menu">
                <div className="gym-notif-header">
                  <span>Notifications</span>
                  <button className="gym-notif-clear">Mark all read</button>
                </div>
                {[
                  { text: "3 membership renewals due today", time: "2m ago", read: false },
                  { text: "New member John D. registered", time: "18m ago", read: false },
                  { text: "Monthly revenue report ready", time: "1h ago", read: true },
                ].map((n, i) => (
                  <div className="gym-notif-item" key={i} role="menuitem">
                    <span className={`gym-notif-dot${n.read ? " read" : ""}`} />
                    <div className="gym-notif-text">
                      <p>{n.text}</p>
                      <span>{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="gym-dropdown-wrapper" data-header-dropdown>
            <button
              className={`gym-avatar-btn${avatarOpen ? " active" : ""}`}
              aria-label="User menu"
              aria-expanded={avatarOpen}
              onClick={() => {
                setAvatarOpen((v) => !v);
                setNotifOpen(false);
              }}
            >
              <div className="gym-avatar-circle" aria-hidden="true">
                <span className="gym-avatar-initials">GY</span>
              </div>
              <div className="gym-avatar-meta">
                <span className="gym-avatar-name">Gym Owner</span>
                <span className="gym-avatar-role">Admin</span>
              </div>
              <span className="gym-avatar-chevron">
                <DropdownChevron open={avatarOpen} />
              </span>
            </button>

            {avatarOpen && (
              <div className="gym-avatar-dropdown" role="menu">
                <div className="gym-dropdown-profile">
                  <p className="gym-dropdown-profile-name">Gym Owner</p>
                  <p className="gym-dropdown-profile-email">admin@gymcrm.io</p>
                </div>
                <div className="gym-dropdown-section">
                  <button className="gym-dropdown-item" role="menuitem">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    My Profile
                  </button>
                  <button className="gym-dropdown-item" role="menuitem">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                    Settings
                  </button>
                  <button className="gym-dropdown-item" role="menuitem">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    Support
                  </button>
                </div>
                <div className="gym-dropdown-divider" />
                <div className="gym-dropdown-section">
                  <button className="gym-dropdown-item danger" role="menuitem">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;