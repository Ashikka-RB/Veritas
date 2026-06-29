import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!token) {
      setError('Invalid reset link or token is missing.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active" id="p-reset-password">
      <div className="auth-layout">
        <div className="auth-panel">
          <div className="auth-brand" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>← Back to Login</div>
          <div className="auth-heading">Set new password</div>
          <div className="auth-sub">Choose a secure password to protect your eKYC identity.</div>
          
          {error && (
            <div className="lock-warning" style={{ margin: '0 0 16px 0', fontSize: '13px' }}>
              <i className="ti ti-lock" style={{ marginRight: '6px' }}></i> {error}
            </div>
          )}

          {success ? (
            <div style={{ background: 'var(--green-dim)', border: '0.5px solid rgba(76,175,116,0.2)', borderRadius: '8px', padding: '16px', fontSize: '14px', color: 'var(--green)', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ti ti-check" style={{ fontSize: '18px' }}></i> 
                <span>Password successfully reset!</span>
              </div>
              <button className="btn btn-gold btn-full" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => navigate('/login')}>
                Sign In Now
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset}>
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-gold btn-full btn-lg" 
                disabled={loading}
                style={{ marginTop: '8px' }}
              >
                {loading ? 'Resetting...' : 'Reset Password'} 
                <i className="ti ti-lock-open" style={{ marginLeft: '8px' }}></i>
              </button>
            </form>
          )}
        </div>
        
        <div className="auth-visual">
          <div className="auth-visual-glow"></div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <i className="ti ti-shield-lock" style={{ fontSize: '64px', color: 'var(--gold)', opacity: 0.6, marginBottom: '24px', display: 'block' }}></i>
            <div style={{ fontFamily: 'var(--display)', fontSize: '22px', marginBottom: '12px' }}>Reset Password</div>
            <p style={{ color: 'var(--text3)', fontSize: '13px', lineHeight: 1.8, maxWidth: '260px' }}>
              Your session is secured using standard SHA-256 tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
