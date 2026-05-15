import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="p-admin-login">
      <div className="auth-layout">
        <div className="auth-panel">
          <div className="auth-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>← Veritas</div>
          <div style={{ marginBottom: '20px' }}><span className="badge badge-red"><i className="ti ti-shield"></i> Admin Portal</span></div>
          <div className="auth-heading">Admin Sign In</div>
          <div className="auth-sub">Restricted access. Authorised personnel only.</div>
          <div className="form-group"><label>Admin Email</label><input type="email" placeholder="admin@veritas.in" /></div>
          <div className="form-group"><label>Admin Password</label><input type="password" placeholder="••••••••••••" /></div>
          <div className="form-group"><label>Admin Access Code</label><input type="text" placeholder="6-digit code" /></div>
          <button className="btn btn-gold btn-full btn-lg" onClick={() => navigate('/admin/dashboard')}>Access Admin Panel <i className="ti ti-arrow-right"></i></button>
          <div style={{ marginTop: '12px' }}><button className="btn btn-ghost btn-full" onClick={() => navigate('/')}>← Return to Public Site</button></div>
        </div>
        <div className="auth-visual">
          <div className="auth-visual-glow"></div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <i className="ti ti-shield-lock" style={{ fontSize: '64px', color: 'var(--red)', opacity: 0.7, marginBottom: '24px', display: 'block' }}></i>
            <div style={{ fontFamily: 'var(--display)', fontSize: '22px', marginBottom: '12px' }}>Restricted Area</div>
            <p style={{ color: 'var(--text3)', fontSize: '13px', lineHeight: 1.8, maxWidth: '260px' }}>All admin activity is logged and monitored in real-time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
