import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PublicationProvider } from './context/PublicationContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Publications from './pages/Publications';
import PublicationDetails from './pages/PublicationDetails';
import AddPublication from './pages/AddPublication';
import Faculty from './pages/Faculty';
import FacultyProfile from './pages/FacultyProfile';
import Verification from './pages/Verification';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import MyPublications from './pages/MyPublications';

// Root redirect handler: routes based on login state
const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

// Layout wrapper for pages requiring the sidebar & header shell (enforces authentication)
const PortalLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

// Guard for routes accessible only by Research Admin
const AdminRouteGuard: React.FC = () => {
  const { user } = useAuth();
  if (user?.role !== 'Research Admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <PublicationProvider>
        <Router>
          <Routes>
            {/* Standalone Route */}
            <Route path="/login" element={<Login />} />

            {/* Portal Shell Wrapped Routes */}
            <Route element={<PortalLayout />}>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/publications" element={<Publications />} />
              <Route path="/publications/add" element={<AddPublication />} />
              <Route path="/publications/:id" element={<PublicationDetails />} />
              <Route path="/my-publications" element={<MyPublications />} />
              <Route path="/faculty" element={<Faculty />} />
              <Route path="/faculty/:id" element={<FacultyProfile />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />

              {/* Admin Only Routes */}
              <Route element={<AdminRouteGuard />}>
                <Route path="/verification" element={<Verification />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </PublicationProvider>
    </AuthProvider>
  );
};

export default App;
