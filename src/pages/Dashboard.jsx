import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StepTracker from '../components/StepTracker';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="p-dashboard">
      <Navbar type="user" />
      <div className="container pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Good morning</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: '36px', fontWeight: 400 }}>Priya Krishnamurthy</h1>
          <p style={{ color: 'var(--text2)', marginTop: '4px' }}>Your KYC verification is in progress. 2 steps remaining.</p>
        </div>

        <StepTracker currentStep={4} />

        <div className="dash-grid">
          <div className="dash-main">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '20px' }}>
              <div className="card card-sm"><div className="stat-label">Verification Status</div><div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--amber)' }}>In Progress</div></div>
              <div className="card card-sm"><div className="stat-label">Fraud Score</div><div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--green)' }}>18% — Low</div></div>
              <div className="card card-sm"><div className="stat-label">Est. Time</div><div style={{ fontSize: '14px', fontWeight: 500 }}>5–10 min</div></div>
            </div>

            <div className="card" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '15px', fontWeight: 500 }}>Verification Timeline</div>
                <span className="badge badge-amber"><i className="ti ti-clock"></i> In Progress</span>
              </div>
              <div className="timeline">
                <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">Account Created &amp; OTP Verified</div><div className="tl-sub">Today, 10:15 AM</div></div>
                <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">Aadhaar Uploaded Successfully</div><div className="tl-sub">Today, 10:18 AM</div></div>
                <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">OCR Extraction Completed — 94% confidence</div><div className="tl-sub">Today, 10:18 AM</div></div>
                <div className="tl-item"><div className="tl-dot active"></div><div className="tl-title">PAN Card Upload</div><div className="tl-sub" style={{ color: 'var(--gold)' }}>Action required</div></div>
                <div className="tl-item"><div className="tl-dot pending"></div><div className="tl-title">Live Face Verification</div><div className="tl-sub">Pending</div></div>
                <div className="tl-item"><div className="tl-dot pending"></div><div className="tl-title">Admin Review</div><div className="tl-sub">Pending</div></div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '16px' }}>Continue Verification</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 'var(--r)', padding: '16px', cursor: 'pointer' }} onClick={() => navigate('/verify/pan')}>
                  <i className="ti ti-file-certificate" style={{ fontSize: '20px', color: 'var(--gold)', marginBottom: '8px', display: 'block' }}></i>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>Upload PAN Card</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>Action required</div>
                </div>
                <div style={{ background: 'var(--bg3)', border: '0.5px solid var(--border)', borderRadius: 'var(--r)', padding: '16px', cursor: 'pointer', opacity: 0.5 }}>
                  <i className="ti ti-face-id" style={{ fontSize: '20px', color: 'var(--text4)', marginBottom: '8px', display: 'block' }}></i>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>Face Verification</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>Locked</div>
                </div>
              </div>
            </div>
          </div>

          <div className="dash-side">
            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '16px' }}>Fraud Risk Score</div>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <svg className="fraud-ring-svg score-circle" viewBox="0 0 120 120" style={{ width: '100px', height: '100px' }}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg3)" strokeWidth="8"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--green)" strokeWidth="8" strokeDasharray="314" strokeDashoffset="257" strokeLinecap="round" transform="rotate(-90 60 60)"/>
                  <text x="60" y="55" textAnchor="middle" fill="var(--text)" fontSize="18" fontFamily="Playfair Display" fontWeight="400">18%</text>
                  <text x="60" y="72" textAnchor="middle" fill="var(--text3)" fontSize="9" fontFamily="DM Sans">LOW RISK</text>
                </svg>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', lineHeight: 1.6 }}>Based on face score, OCR confidence, and submission patterns.</div>
            </div>

            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '12px' }}>Recent Notifications</div>
              <div className="notif-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/notifications')}>
                <div className="notif-icon" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}><i className="ti ti-check"></i></div>
                <div><div style={{ fontSize: '12px', fontWeight: 500 }}>OCR extraction complete</div><div className="notif-time">2 min ago</div></div>
              </div>
              <div className="notif-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/notifications')}>
                <div className="notif-icon" style={{ background: 'var(--amber-dim)', color: 'var(--amber)' }}><i className="ti ti-alert-triangle"></i></div>
                <div><div style={{ fontSize: '12px', fontWeight: 500 }}>PAN upload required</div><div className="notif-time">2 min ago</div></div>
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '12px' }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn btn-gold btn-full" onClick={() => navigate('/verify/pan')}>Upload PAN <i className="ti ti-arrow-right"></i></button>
                <button className="btn btn-outline btn-full" onClick={() => navigate('/verify/start')}>View Process</button>
                <button className="btn btn-outline btn-full" onClick={() => navigate('/verify/status')}>Check Status</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
