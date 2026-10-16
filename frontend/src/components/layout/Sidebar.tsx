import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Cpu, 
  BarChart3, 
  FileSpreadsheet, 
  CheckSquare, 
  Settings, 
  LogOut,
  X,
  BookOpen,
  FileCheck
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard }
      ]
    },

    {
      title: 'Research Management',
      items: [
        { name: 'Publications', path: '/publications', icon: BookOpen },
        { name: 'Faculty', path: '/faculty', icon: Users },
        { name: 'Research Areas', path: '/analytics#areas', icon: Cpu }
      ]
    },
    {
      title: 'Insights',
      items: [
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Reports', path: '/reports', icon: FileSpreadsheet }
      ]
    },
    {
      title: 'Administration',
      items: [
        { name: 'Verification', path: '/verification', icon: CheckSquare },
        { name: 'Settings', path: '/settings', icon: Settings }
      ]
    }
  ];

  const visibleNavGroups = user?.role === 'Faculty'
    ? [
        {
          title: 'Overview',
          items: [
            { name: 'Dashboard', path: '/', icon: LayoutDashboard }
          ]
        },
        {
          title: 'Faculty Workspace',
          items: [
            { name: 'Upload New Research', path: '/publications/add', icon: FileText },
            { name: 'My Uploads', path: '/my-publications', icon: FileCheck },
            { name: 'Approved Publications', path: '/publications', icon: BookOpen }
          ]
        }
      ]
    : navGroups;

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path.split('#')[0]);
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-[260px] bg-white border-r border-gray-200/80 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header/Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900 tracking-tight block leading-none">ResearchHub</span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mt-0.5 block">Repository Platform</span>
            </div>
          </Link>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg lg:hidden hover:bg-gray-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
          {visibleNavGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                {group.title}
              </span>
              <ul className="space-y-1">
                {group.items.map((item, itemIdx) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <li key={itemIdx}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`
                          flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 group cursor-pointer
                          ${active 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }
                        `}
                      >
                        <Icon className={`w-4.5 h-4.5 transition-colors ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center border border-blue-700 shadow-xs">
                  {user?.initials || 'DK'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate leading-snug">{user?.name || 'Dr. Karthika'}</p>
                <p className="text-[10px] text-gray-500 font-medium truncate">{user?.role || 'Research Admin'}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
