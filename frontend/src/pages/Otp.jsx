import { useNavigate } from 'react-router-dom';

export default function Otp() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="p-otp">
      <div className="auth-layout">
        <div className="auth-panel">
          <div className="auth-brand" onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>← Back</div>
          <div className="auth-heading">Verify your email</div>
          <div className="auth-sub" style={{ marginBottom: '32px' }}>We sent a 6-digit OTP to your email address. Check your inbox.</div>
          <label style={{ textAlign: 'center', display: 'block', marginBottom: '4px' }}>Enter OTP</label>
          <div className="otp-row">
            <input className="otp-box" maxLength="1" type="text" />
            <input className="otp-box" maxLength="1" type="text" />
            <input className="otp-box" maxLength="1" type="text" />
            <input className="otp-box" maxLength="1" type="text" />
            <input className="otp-box" maxLength="1" type="text" />
            <input className="otp-box" maxLength="1" type="text" />
          </div>
          <div style={{ textAlign: 'center', margin: '12px 0 24px', fontSize: '12px', color: 'var(--text3)' }}>Resend OTP in <span style={{ color: 'var(--gold)' }}>00:42</span></div>
          <button className="btn btn-gold btn-full btn-lg" onClick={() => navigate('/login')}>Verify &amp; Continue <i className="ti ti-arrow-right"></i></button>
        </div>
        <div className="auth-visual">
          <div className="auth-visual-glow"></div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <i className="ti ti-mail-opened" style={{ fontSize: '64px', color: 'var(--gold)', opacity: 0.7, marginBottom: '24px', display: 'block' }}></i>
            <div style={{ fontFamily: 'var(--display)', fontSize: '22px', marginBottom: '8px' }}>Check your inbox</div>
            <p style={{ color: 'var(--text3)', fontSize: '13px' }}>OTP expires in 10 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
