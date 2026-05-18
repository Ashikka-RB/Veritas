import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="p-forgot">
      <div className="auth-layout">
        <div className="auth-panel">
          <div className="auth-brand" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>← Back to Login</div>
          <div className="auth-heading">Reset password</div>
          <div className="auth-sub">Enter your email and we'll send a reset link.</div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@email.com" />
          </div>
          <button className="btn btn-gold btn-full btn-lg">Send Reset Link <i className="ti ti-send"></i></button>
          <div style={{ background: 'var(--green-dim)', border: '0.5px solid rgba(76,175,116,0.2)', borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
            <i className="ti ti-check"></i> If this email exists, a reset link will be sent within 2 minutes.
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
