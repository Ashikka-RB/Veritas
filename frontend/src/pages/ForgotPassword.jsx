import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link.');
      }

      setMessage('If this email exists, a reset link has been sent.');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active" id="p-forgot">
      <div className="auth-layout">
        <div className="auth-panel">
          <div className="auth-brand" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>← Back to Login</div>
          <div className="auth-heading">Reset password</div>
          <div className="auth-sub">Enter your email and we'll send a reset link.</div>
          
          {error && (
            <div className="lock-warning" style={{ margin: '0 0 16px 0', fontSize: '13px' }}>
              <i className="ti ti-lock" style={{ marginRight: '6px' }}></i> {error}
            </div>
          )}

          {message && (
            <div style={{ background: 'var(--green-dim)', border: '0.5px solid rgba(76,175,116,0.2)', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <i className="ti ti-check"></i> {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="you@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-gold btn-full btn-lg"
              disabled={loading}
            >
              {loading ? 'Sending Link...' : 'Send Reset Link'} 
              <i className="ti ti-send" style={{ marginLeft: '8px' }}></i>
            </button>
          </form>

          <div style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
            <i className="ti ti-info-circle"></i> If this email exists, a reset link will be sent within 2 minutes.
          </div>
        </div>
        
        <div className="auth-visual">
          <div className="auth-visual-glow"></div>
          <i className="ti ti-mail-fast" style={{ fontSize: '64px', color: 'var(--gold)', opacity: 0.6, position: 'relative', zIndex: 1 }}></i>
        </div>
      </div>
    </div>
  );
}

