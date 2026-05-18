import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <div className="sidebar-logo">Veritas Admin</div>
      <div className="sidebar-label">Overview</div>
      <div className={`sidebar-item ${isActive('/admin/dashboard')}`} onClick={() => navigate('/admin/dashboard')}><i className="ti ti-layout-dashboard"></i> Dashboard</div>
      
      <div className="sidebar-label">Review</div>
      <div className={`sidebar-item ${isActive('/admin/verify-user')}`} onClick={() => navigate('/admin/verify-user')}><i className="ti ti-user-check"></i> Verify Users</div>
      <div className={`sidebar-item ${isActive('/admin/fraud')}`} onClick={() => navigate('/admin/fraud')}><i className="ti ti-alert-triangle"></i> Fraud Monitor</div>
      
      <div className="sidebar-label">System</div>
      <div className="sidebar-item" onClick={() => navigate('/')}><i className="ti ti-logout"></i> Sign Out</div>
    </div>
  );
}
