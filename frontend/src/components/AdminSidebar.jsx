import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Highlight active sidebar item including dynamic sub-routes
  const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

  const handleVerifyUsersClick = () => {
    const token = localStorage.getItem('adminToken');
    fetch('https://veritas-backend-3nfm.onrender.com/api/admin/review-queue', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch review queue');
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          navigate(`/admin/verify-user/${data[0]._id}`);
        } else {
          alert('No pending reviews in the queue.');
          navigate('/admin/dashboard');
        }
      })
      .catch((err) => {
        console.error(err);
        navigate('/admin/dashboard');
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">Veritas Admin</div>
      <div className="sidebar-label">Overview</div>
      <div className={`sidebar-item ${isActive('/admin/dashboard')}`} onClick={() => navigate('/admin/dashboard')}>
        <i className="ti ti-layout-dashboard"></i> Dashboard
      </div>
      
      <div className="sidebar-label">Review</div>
      <div className={`sidebar-item ${isActive('/admin/verify-user')}`} onClick={handleVerifyUsersClick}>
        <i className="ti ti-user-check"></i> Verify Users
      </div>
      <div className={`sidebar-item ${isActive('/admin/fraud')}`} onClick={() => navigate('/admin/fraud')}>
        <i className="ti ti-alert-triangle"></i> Fraud Monitor
      </div>
      
      <div className="sidebar-label">System</div>
      <div className="sidebar-item" onClick={handleSignOut}><i className="ti ti-logout"></i> Sign Out</div>
    </div>
  );
}
