import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password || !accessCode) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('https://veritas-backend-3nfm.onrender.com/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, accessCode })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed. Please try again.');
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));

      alert('Admin Sign In Successful');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active" id="p-admin-login">
      <div className="auth-layout">
        <div className="auth-panel">
          <div className="auth-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>← Veritas</div>
          <div style={{ marginBottom: '20px' }}>
            <span className="badge badge-red"><i className="ti ti-shield"></i> Admin Portal</span>
          </div>
          <div className="auth-heading">Admin Sign In</div>
          <div className="auth-sub">Restricted access. Authorised personnel only.</div>
          
          {error && (
            <div className="lock-warning" style={{ margin: '0 0 16px 0', fontSize: '13px' }}>
              <i className="ti ti-lock" style={{ marginRight: '6px' }}></i> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Admin Email</label>
              <input 
                type="email" 
                placeholder="admin@veritas.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Admin Password</label>
              <input 
                type="password" 
                placeholder="••••••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Admin Access Code</label>
              <input 
                type="text" 
                placeholder="6-digit code" 
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-gold btn-full btn-lg" 
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? 'Authorising...' : 'Access Admin Panel'} 
              <i className="ti ti-arrow-right" style={{ marginLeft: '8px' }}></i>
            </button>
          </form>

          <div style={{ marginTop: '12px' }}>
            <button className="btn btn-ghost btn-full" onClick={() => navigate('/')} disabled={loading}>
              ← Return to Public Site
            </button>
          </div>
        </div>
        
        <div className="auth-visual">
          <div className="auth-visual-glow"></div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <i className="ti ti-shield-lock" style={{ fontSize: '64px', color: 'var(--red)', opacity: 0.7, marginBottom: '24px', display: 'block' }}></i>
            <div style={{ fontFamily: 'var(--display)', fontSize: '22px', marginBottom: '12px' }}>Restricted Area</div>
            <p style={{ color: 'var(--text3)', fontSize: '13px', lineHeight: 1.8, maxWidth: '260px' }}>
              All admin activity is logged and monitored in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

