import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icons } from './Icons';

const navConfig = {
  admin: [
    { section: 'Overview', items: [
      { label: 'Dashboard',      icon: 'Dashboard', path: '/admin/dashboard' },
      { label: 'Announcements',  icon: 'Megaphone', path: '/admin/announcements' },
    ]},
    { section: 'Management', items: [
      { label: 'Students',       icon: 'GraduationCap', path: '/admin/students' },
      { label: 'Faculty',        icon: 'Users',         path: '/admin/faculty' },
      { label: 'Subjects',       icon: 'BookOpen',      path: '/admin/subjects' },   // NEW
    ]},
    { section: 'Academics', items: [
      { label: 'Marks Overview', icon: 'Award',    path: '/admin/marks' },
      { label: 'Attendance',     icon: 'Calendar', path: '/admin/attendance' },
      { label: 'Assignments',    icon: 'FileText', path: '/admin/assignments' },
      { label: 'Study Materials',icon: 'BookOpen', path: '/admin/materials' },
    ]},
    { section: 'AI & Settings', items: [
      { label: 'College Info',   icon: 'Building', path: '/admin/college-info' },
    ]},
  ],
  faculty: [
    { section: 'Overview', items: [
      { label: 'Dashboard',       icon: 'Dashboard', path: '/faculty/dashboard' },
    ]},
    { section: 'Students', items: [
      { label: 'My Students',     icon: 'Users',    path: '/faculty/students' },
      { label: 'Assign Marks',    icon: 'Award',    path: '/faculty/marks' },
      { label: 'Attendance',      icon: 'Calendar', path: '/faculty/attendance' },
      { label: 'Assignments',     icon: 'FileText', path: '/faculty/assignments' },
    ]},
    { section: 'Resources', items: [
      { label: 'Study Materials', icon: 'BookOpen', path: '/faculty/materials' },
    ]},
    { section: 'Account', items: [
      { label: 'My Profile',      icon: 'User',     path: '/faculty/profile' },
    ]},
  ],
  student: [
    { section: 'Overview', items: [
      { label: 'Dashboard',       icon: 'Dashboard', path: '/student/dashboard' },
    ]},
    { section: 'Academics', items: [
      { label: 'My Attendance',   icon: 'Calendar', path: '/student/attendance' },
      { label: 'My Marks',        icon: 'Award',    path: '/student/marks' },
      { label: 'Assignments',     icon: 'FileText', path: '/student/assignments' },
      { label: 'Study Materials', icon: 'BookOpen', path: '/student/materials' },
      { label: 'Performance',     icon: 'BarChart', path: '/student/performance' },
      { label: 'My Faculty',      icon: 'Users',    path: '/student/faculty' },    // NEW
    ]},
    { section: 'Account', items: [
      { label: 'My Profile',      icon: 'User',     path: '/student/profile' },
    ]},
  ],
};

const AVATAR_COLORS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #22d3ee, #6366f1)',
  'linear-gradient(135deg, #10b981, #22d3ee)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const role      = user?.role?.toLowerCase() || 'student';
  const nav       = navConfig[role] || navConfig.student;

  const handleLogout = () => { logout(); navigate('/login'); };

  const avatarColor = AVATAR_COLORS[(user?.name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  const initials    = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const roleLabel   = { admin: 'Administrator', faculty: 'Faculty', student: 'Student' }[role] || role;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <img src="/eict_logo.png" alt="EICT" style={{ width: 32, height: 32, borderRadius: 6 }} />
          <span className="logo-text">EICT</span>
          <span className="logo-badge">PRO</span>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar" style={{ background: avatarColor }}>{initials}</div>
        <div className="user-info">
          <div className="user-name">{user?.name || 'User'}</div>
          <div className="user-role">{roleLabel}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {nav.map(section => (
          <div className="nav-section" key={section.section}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map(item => {
              const Icon     = Icons[item.icon] || Icons.Dashboard;
              const isActive = location.pathname === item.path
                            || location.pathname.startsWith(item.path + '/');
              return (
                <div
                  key={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="nav-icon"><Icon /></span>
                  {item.label}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item" onClick={() => navigate(`/${role}/profile`)}>
          <span className="nav-icon"><Icons.Settings /></span>
          Settings
        </div>
        <div className="nav-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
          <span className="nav-icon"><Icons.LogOut /></span>
          Sign Out
        </div>
      </div>
    </div>
  );
}
