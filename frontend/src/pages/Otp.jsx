import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Otp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem('userEmail') || '';

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      alert("Please enter all 6 digits of the OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp: otpCode })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Email verified successfully!");
        navigate('/dashboard');
      } else {
        alert(data.message || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (res.ok) {
        alert("Verification code has been resent to your email.");
        setTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs[0].current.focus();
      } else {
        alert(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page active" id="p-otp">
      <div className="auth-layout">
        <div className="auth-panel">
          <div className="auth-brand" onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>← Back</div>
          <div className="auth-heading">Verify your email</div>
          <div className="auth-sub" style={{ marginBottom: '32px' }}>
            We sent a 6-digit OTP to <span style={{ color: 'var(--gold)' }}>{email}</span>. Check your inbox.
          </div>
          <label style={{ textAlign: 'center', display: 'block', marginBottom: '4px' }}>Enter OTP</label>
          <div className="otp-row">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                className="otp-box"
                maxLength="1"
                type="text"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
              />
            ))}
          </div>
          
          <div style={{ textAlign: 'center', margin: '12px 0 24px', fontSize: '12px', color: 'var(--text3)' }}>
            {canResend ? (
              <span 
                onClick={handleResend} 
                style={{ color: 'var(--gold)', cursor: 'pointer', fontWeight: 500 }}
              >
                Resend OTP
              </span>
            ) : (
              <>Resend OTP in <span style={{ color: 'var(--gold)' }}>{formatTimer()}</span></>
            )}
          </div>
          
          <button 
            className="btn btn-gold btn-full btn-lg" 
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Continue"} <i className="ti ti-arrow-right"></i>
          </button>
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
