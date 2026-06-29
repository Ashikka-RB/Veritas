import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {

  try {

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      {
        fullName,
        email,
        phone,
        password
      }
    );

    alert(response.data.message);

    localStorage.setItem("userEmail", email);

    navigate('/otp');

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message || "Registration failed"
    );

  } finally {

    setLoading(false);

  }

};

  return (
    <div className="page active" id="p-register">
      <div className="auth-layout">
        <div className="auth-panel">
          <div className="auth-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>← Veritas</div>
          <div className="auth-heading">Create account</div>
          <div className="auth-sub">Start your KYC verification journey.</div>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="As on Aadhaar card"
              id="reg-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="form-row">
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
              <label>Phone</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              id="reg-pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '18px', lineHeight: 1.6 }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <span id="chk-len" style={{ color: 'var(--text4)' }}>● Min 8 chars</span>
              <span id="chk-num" style={{ color: 'var(--text4)' }}>● Contains number</span>
              <span id="chk-sym" style={{ color: 'var(--text4)' }}>● Special character</span>
            </div>
          </div>
          <button
            className="btn btn-gold btn-full btn-lg"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Continue to OTP"}
            <i className="ti ti-arrow-right"></i>
          </button>
          <div className="auth-switch">Already have an account? <a onClick={() => navigate('/login')}>Sign in</a></div>
        </div>
        <div className="auth-visual">
          <div className="auth-visual-glow"></div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <i className="ti ti-shield-check" style={{ fontSize: '64px', color: 'var(--gold)', opacity: 0.7, marginBottom: '24px', display: 'block' }}></i>
            <div style={{ fontFamily: 'var(--display)', fontSize: '22px', marginBottom: '12px' }}>Secure by design</div>
            <p style={{ color: 'var(--text3)', fontSize: '13px', lineHeight: 1.8, maxWidth: '280px' }}>Your data is encrypted end-to-end. We never store raw Aadhaar numbers in plaintext.</p>
            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}><i className="ti ti-check" style={{ color: 'var(--green)', fontSize: '14px' }}></i><span style={{ fontSize: '12px', color: 'var(--text2)' }}>RBI-compliant KYC flow</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}><i className="ti ti-check" style={{ color: 'var(--green)', fontSize: '14px' }}></i><span style={{ fontSize: '12px', color: 'var(--text2)' }}>ISO 27001 certified infrastructure</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}><i className="ti ti-check" style={{ color: 'var(--green)', fontSize: '14px' }}></i><span style={{ fontSize: '12px', color: 'var(--text2)' }}>DPDP Act compliant data handling</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
