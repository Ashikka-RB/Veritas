import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [locked, setLocked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

  try {

    setLoading(true);

    const response = await fetch(
      "https://veritas-backend-3nfm.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await response.json();

    if (response.ok) {

      localStorage.setItem("token", data.token);

      alert("Login Successful");

      navigate('/dashboard');

    } else {

      alert(data.message);

    }

  } catch (error) {

    console.log(error);

    alert("Server Error");

  } finally {

    setLoading(false);

  }

};

  return (
    <div className="page active" id="p-login">
      <div className="auth-layout">
        <div className="auth-panel">
          <div className="auth-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>← Veritas</div>
          <div className="auth-heading">Welcome back</div>
          <div className="auth-sub">Sign in to continue your verification.</div>
          
          {locked && (
            <div className="lock-warning" id="lock-warn">
              <i className="ti ti-lock"></i> Account locked after 3 failed attempts. Try again in 28 minutes.
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div style={{ textAlign: 'right', marginTop: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--gold)', cursor: 'pointer' }} onClick={() => navigate('/forgot')}>Forgot password?</span>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '18px', background: 'var(--bg3)', padding: '10px 12px', borderRadius: '8px' }}>
            <i className="ti ti-info-circle" style={{ fontSize: '12px' }}></i> Account locks for 30 minutes after 3 failed attempts.
          </div>
          <button
            className="btn btn-gold btn-full btn-lg"
            onClick={handleLogin}
          >
            {loading ? "Signing In..." : "Sign In"}
            <i className="ti ti-arrow-right"></i>
          </button>
          <div className="auth-switch">New to Veritas? <a onClick={() => navigate('/register')}>Create account</a></div>
        </div>
        <div className="auth-visual">
          <div className="auth-visual-glow"></div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <i className="ti ti-fingerprint" style={{ fontSize: '64px', color: 'var(--gold)', opacity: 0.7, marginBottom: '24px', display: 'block' }}></i>
            <div style={{ fontFamily: 'var(--display)', fontSize: '22px', marginBottom: '12px' }}>Your identity, secured</div>
            <p style={{ color: 'var(--text3)', fontSize: '13px', lineHeight: 1.8, maxWidth: '260px' }}>Every session is monitored and logged for your protection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
