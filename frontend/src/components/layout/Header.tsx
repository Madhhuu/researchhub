import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, Menu, CheckCircle2, XCircle, FileText, ArrowRight } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';
import type { NotificationItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { usePublications } from '../../context/PublicationContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { pdfRequests, publications, refreshPdfRequests } = usePublications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem('rh_read_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-refresh PDF requests when opening dropdown & periodically
  useEffect(() => {
    if (showNotifications) {
      refreshPdfRequests();
    }
  }, [showNotifications]);

  useEffect(() => {
    const timer = setInterval(() => {
      refreshPdfRequests();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Compute live notifications tailored to the logged-in user
  const activeNotifications: NotificationItem[] = useMemo(() => {
    const items: NotificationItem[] = [];

    const userEmail = (user?.email || '').trim().toLowerCase();
    const userName = (user?.name || '').trim().toLowerCase();

    // 1. PDF Access requests where user is the Requester (Accepted / Rejected)
    pdfRequests.forEach((req) => {
      const reqEmail = (req.requesterEmail || '').trim().toLowerCase();
      const reqName = (req.requesterName || '').trim().toLowerCase();
      const isMyRequest =
        (userEmail && reqEmail === userEmail) ||
        (userName && (reqName.includes(userName) || userName.includes(reqName)));

      if (isMyRequest) {
        if (req.status === 'Approved') {
          const id = `req-approved-${req.id}`;
          items.push({
            id,
            text: `✅ ${req.facultyName} approved your PDF request for "${req.publicationTitle}". You can now download the paper!`,
            time: req.respondedAt || 'Recently',
            unread: !readIds.includes(id),
            link: `/publications/${req.publicationId}`,
          });
        } else if (req.status === 'Rejected') {
          const id = `req-rejected-${req.id}`;
          items.push({
            id,
            text: `❌ ${req.facultyName} declined your PDF request for "${req.publicationTitle}".`,
            time: req.respondedAt || 'Recently',
            unread: !readIds.includes(id),
            link: `/publications/${req.publicationId}`,
          });
        }
      }
    });

    // 2. PDF Access requests where user is the Author Faculty (Incoming requests awaiting review)
    pdfRequests.forEach((req) => {
      const authorName = (req.facultyName || '').trim().toLowerCase();
      const isAuthor =
        userName && (authorName.includes(userName) || userName.includes(authorName));

      if (isAuthor && req.status === 'Pending') {
        const id = `req-incoming-${req.id}`;
        items.push({
          id,
          text: `📩 ${req.requesterName} requested full-text PDF access for "${req.publicationTitle}".`,
          time: req.requestedAt || 'Awaiting review',
          unread: !readIds.includes(id),
          link: `/publications/${req.publicationId}`,
        });
      }
    });

    // 3. For Admin: Pending verification publication claims
    if (user?.role === 'Research Admin') {
      const pendingPubs = publications.filter((p) => p.status === 'Pending');
      if (pendingPubs.length > 0) {
        const id = 'admin-pending-verifications';
        items.push({
          id,
          text: `📋 ${pendingPubs.length} research publication${pendingPubs.length > 1 ? 's' : ''} awaiting verification review.`,
          time: 'Action required',
          unread: !readIds.includes(id),
          link: '/verification',
        });
      }
    }

    // 4. Baseline system notifications
    mockNotifications.forEach((mn) => {
      if (mn.id === 'notif-1' && user?.role === 'Research Admin') return;
      items.push({
        ...mn,
        unread: !readIds.includes(mn.id),
      });
    });

    return items;
  }, [user, pdfRequests, publications, readIds]);

  const unreadCount = activeNotifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    const allIds = activeNotifications.map((n) => n.id);
    setReadIds(allIds);
    try {
      sessionStorage.setItem('rh_read_notifications', JSON.stringify(allIds));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleNotificationClick = (id: string) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      try {
        sessionStorage.setItem('rh_read_notifications', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
    }
    setShowNotifications(false);
  };

  // Determine Title and Subtitle based on route
  const getHeaderDetails = () => {
    const path = location.pathname;
    if (path === '/') {
      return {
        title: 'Research Overview',
        subtitle: 'Monitor institutional research output, publication activity, and faculty performance.',
      };
    }
    if (path === '/publications') {
      return {
        title: 'Publications Repository',
        subtitle: 'Manage, search, and audit all institutional research outputs and papers.',
      };
    }
    if (path.startsWith('/publications/add')) {
      return {
        title: 'Add Publication',
        subtitle: 'Register a new publication, book chapter, patent, or conference paper.',
      };
    }
    if (path.startsWith('/publications/')) {
      return {
        title: 'Publication Details',
        subtitle: 'View complete metadata, verification logs, and citations for this record.',
      };
    }
    if (path === '/faculty') {
      return {
        title: 'Faculty Directory',
        subtitle: 'Explore academic achievements, publication indices, and researchers.',
      };
    }
    if (path.startsWith('/faculty/')) {
      return {
        title: 'Faculty Profile',
        subtitle: 'Detailed research record, h-index details, and individual stats.',
      };
    }
    if (path === '/verification') {
      return {
        title: 'Publication Verification',
        subtitle: 'Approve or reject research claims submitted by faculty members.',
      };
    }
    if (path === '/analytics') {
      return {
        title: 'Research Analytics',
        subtitle: 'Analyze publication trends, department counts, and top fields.',
      };
    }
    if (path === '/reports') {
      return {
        title: 'Research Reports',
        subtitle: 'Compile statistics and export PDF/CSV research reports.',
      };
    }
    if (path === '/settings') {
      return {
        title: 'System Settings',
        subtitle: 'Configure platform metadata, departments, and user access levels.',
      };
    }
    return {
      title: 'ResearchHub Portal',
      subtitle: 'Faculty Research Repository & Analytics Platform',
    };
  };

  const { title, subtitle } = getHeaderDetails();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200/80 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Title block */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuToggle}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden transition-colors cursor-pointer"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{title}</h1>
          <p className="text-xs text-gray-500 mt-0.5 max-w-xl truncate md:max-w-none">{subtitle}</p>
        </div>
      </div>

      {/* Actions block */}
      <div className="flex items-center gap-4 self-end md:self-auto">
        {/* Search Input */}
        <div className={`
          relative flex items-center bg-gray-50 border rounded-lg px-3 py-1.5 w-48 sm:w-60 md:w-64 transition-all duration-150
          ${searchFocused ? 'border-blue-500 ring-2 ring-blue-500/15 bg-white' : 'border-gray-200'}
        `}>
          <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search papers, faculty..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent border-none outline-none text-xs text-gray-800 placeholder-gray-400 w-full"
          />
        </div>

        {/* Notifications Icon with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`
              relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200 shadow-2xs transition-colors cursor-pointer
              ${showNotifications ? 'bg-gray-50 text-gray-900' : 'bg-white'}
            `}
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown menu */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-84 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/70">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-[10px]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {activeNotifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400">No notifications</div>
                ) : (
                  activeNotifications.map((notif) => {
                    const isApproved = notif.text.includes('✅');
                    const isRejected = notif.text.includes('❌');
                    const isIncoming = notif.text.includes('📩');

                    const content = (
                      <div 
                        className={`p-3.5 flex gap-3 transition-colors cursor-pointer ${
                          notif.unread ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleNotificationClick(notif.id)}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {isApproved ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          ) : isRejected ? (
                            <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                              <XCircle className="w-3.5 h-3.5" />
                            </div>
                          ) : isIncoming ? (
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className={`w-2 h-2 mt-2 rounded-full ${notif.unread ? 'bg-blue-600' : 'bg-gray-300'}`} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs text-gray-800 leading-snug ${notif.unread ? 'font-semibold' : 'font-normal'}`}>
                            {notif.text}
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[10px] text-gray-400">{notif.time}</span>
                            {notif.link && (
                              <span className="text-[10px] text-blue-600 font-medium inline-flex items-center gap-0.5">
                                View paper <ArrowRight className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );

                    return notif.link ? (
                      <Link key={notif.id} to={notif.link} className="block no-underline">
                        {content}
                      </Link>
                    ) : (
                      <div key={notif.id}>{content}</div>
                    );
                  })
                )}
              </div>
              <div className="p-2.5 border-t border-gray-100 text-center bg-gray-50/50">
                <span className="text-[10px] text-gray-400 font-medium block">
                  Notifications update automatically in real-time
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Info details */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-gray-200">
          <div className="text-right">
            <span className="text-xs font-semibold text-gray-800 block leading-tight">
              {user?.name || 'Dr. Karthika'}
            </span>
            <span className="text-[10px] text-gray-400 block">
              {user?.role || 'Research Admin'}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center border border-blue-700 shadow-xs">
            {user?.initials || 'DK'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
