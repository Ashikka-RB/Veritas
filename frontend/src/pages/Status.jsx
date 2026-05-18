import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Status() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="p-status">
      <Navbar type="back" backTo="/dashboard" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        <div className="status-hero">
          <div className="status-badge-lg" style={{ background: 'var(--amber-dim)', color: 'var(--amber)', border: '0.5px solid rgba(232,160,48,0.25)' }}>
            <i className="ti ti-clock"></i> Admin Review Pending
          </div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: '36px', fontWeight: 400, marginBottom: '8px' }}>Your submission is<br/>under review</h1>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Estimated: 5–10 business minutes</p>
        </div>

        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '20px' }}>Verification Timeline</div>
          <div className="timeline">
            <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ Registration &amp; OTP Verified</div><div className="tl-sub">Today, 10:15 AM</div></div>
            <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ Aadhaar Uploaded &amp; Validated</div><div className="tl-sub">Today, 10:18 AM</div></div>
            <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ OCR Extraction — 94% confidence</div><div className="tl-sub">Today, 10:18 AM</div></div>
            <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ PAN Validated — Names Match</div><div className="tl-sub">Today, 10:22 AM</div></div>
            <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ Face Verification Passed — 94.2%</div><div className="tl-sub">Today, 10:25 AM</div></div>
            <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ Fraud Analysis — 18% (Low Risk)</div><div className="tl-sub">Today, 10:25 AM</div></div>
            <div className="tl-item"><div className="tl-dot active"></div><div className="tl-title" style={{ color: 'var(--gold)' }}>⏳ Admin Review in Progress</div><div className="tl-sub" style={{ color: 'var(--amber)' }}>Est. 5–10 minutes</div></div>
            <div className="tl-item"><div className="tl-dot pending"></div><div className="tl-title" style={{ color: 'var(--text3)' }}>Final Approval / Rejection</div><div className="tl-sub">Pending</div></div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div className="card card-sm" style={{ textAlign: 'center' }}><div className="stat-label">Face Match</div><div style={{ color: 'var(--green)', fontWeight: 600, fontSize: '18px' }}>94.2%</div></div>
          <div className="card card-sm" style={{ textAlign: 'center' }}><div className="stat-label">OCR Score</div><div style={{ color: 'var(--green)', fontWeight: 600, fontSize: '18px' }}>94%</div></div>
          <div className="card card-sm" style={{ textAlign: 'center' }}><div className="stat-label">Fraud Risk</div><div style={{ color: 'var(--green)', fontWeight: 600, fontSize: '18px' }}>Low</div></div>
        </div>
        <button className="btn btn-outline btn-full" onClick={() => navigate('/notifications')}>View All Notifications</button>
      </div>
    </div>
  );
}
