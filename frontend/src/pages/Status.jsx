import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Status() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/api/verification/status/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch status');
        }
        return res.json();
      })
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getFraudRiskLabel = (score) => {
    if (score === undefined || score === null) return '—';
    if (score < 30) return 'Low';
    if (score <= 70) return 'Medium';
    return 'High';
  };

  const getFraudRiskColor = (score) => {
    if (score === undefined || score === null) return 'var(--text)';
    if (score < 30) return 'var(--green)';
    if (score <= 70) return 'var(--amber)';
    return 'var(--red)';
  };

  if (loading) {
    return (
      <div className="page active" id="p-status">
        <Navbar type="back" backTo="/dashboard" />
        <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <i className="ti ti-loader spin" style={{ fontSize: '32px', color: 'var(--gold)', display: 'block', margin: '0 auto 16px' }}></i>
            <div style={{ fontSize: '14px', color: 'var(--text3)' }}>Loading verification status...</div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback if no submission exists yet
  const decision = status?.adminDecision || 'PENDING';
  const faceMatch = status?.faceMatchScore || 0;
  const ocrScore = status?.ocrConfidence || 0;
  const rejectedProb = status?.rejectedProbability || 0;

  return (
    <div className="page active" id="p-status">
      <Navbar type="back" backTo="/dashboard" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        
        {/* Status Hero Section */}
        <div className="status-hero">
          {decision === 'APPROVED' ? (
            <>
              <div className="status-badge-lg" style={{ background: 'var(--green-dim)', color: 'var(--green)', border: '0.5px solid rgba(76,175,80,0.25)' }}>
                <i className="ti ti-circle-check"></i> Verification Approved
              </div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '36px', fontWeight: 400, marginBottom: '8px' }}>Your identity has<br/>been verified</h1>
              <p style={{ color: 'var(--text2)', fontSize: '14px' }}>You have successfully completed the eKYC process.</p>
            </>
          ) : decision === 'REJECTED' ? (
            <>
              <div className="status-badge-lg" style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '0.5px solid rgba(226,75,74,0.25)' }}>
                <i className="ti ti-circle-x"></i> Verification Rejected
              </div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '36px', fontWeight: 400, marginBottom: '8px' }}>Verification failed</h1>
              <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Your submission did not pass our verification criteria.</p>
            </>
          ) : (
            <>
              <div className="status-badge-lg" style={{ background: 'var(--amber-dim)', color: 'var(--amber)', border: '0.5px solid rgba(232,160,48,0.25)' }}>
                <i className="ti ti-clock"></i> Admin Review Pending
              </div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '36px', fontWeight: 400, marginBottom: '8px' }}>Your submission is<br/>under review</h1>
              <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Estimated: 5–10 business minutes</p>
            </>
          )}
        </div>

        {/* Timeline Section */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '20px' }}>Verification Timeline</div>
          <div className="timeline">
            <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ Registration &amp; OTP Verified</div></div>
            <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ Aadhaar Uploaded &amp; Validated</div></div>
            <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ OCR Extraction — {ocrScore}% confidence</div></div>
            <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ PAN Validated — Names Match</div></div>
            <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ Face Verification Passed — {faceMatch}%</div></div>
            <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ Fraud Analysis — {rejectedProb}% Risk ({getFraudRiskLabel(rejectedProb)} Risk)</div></div>
            
            {decision === 'APPROVED' ? (
              <>
                <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ Admin Review Completed</div></div>
                <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ Verification Approved</div></div>
              </>
            ) : decision === 'REJECTED' ? (
              <>
                <div className="tl-item"><div className="tl-dot done"></div><div className="tl-title">✔ Admin Review Completed</div></div>
                <div className="tl-item"><div className="tl-dot active" style={{ background: 'var(--red)' }}></div><div className="tl-title" style={{ color: 'var(--red)' }}>✖ Verification Rejected</div></div>
              </>
            ) : (
              <>
                <div className="tl-item"><div className="tl-dot active"></div><div className="tl-title" style={{ color: 'var(--gold)' }}>⏳ Admin Review in Progress</div><div className="tl-sub" style={{ color: 'var(--amber)' }}>Est. 5–10 minutes</div></div>
                <div className="tl-item"><div className="tl-dot pending"></div><div className="tl-title" style={{ color: 'var(--text3)' }}>Final Approval / Rejection</div><div className="tl-sub">Pending</div></div>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Metrics Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div className="card card-sm" style={{ textAlign: 'center' }}>
            <div className="stat-label">Face Match</div>
            <div style={{ color: 'var(--green)', fontWeight: 600, fontSize: '18px' }}>
              {faceMatch ? `${faceMatch}%` : '—'}
            </div>
          </div>
          <div className="card card-sm" style={{ textAlign: 'center' }}>
            <div className="stat-label">OCR Score</div>
            <div style={{ color: 'var(--green)', fontWeight: 600, fontSize: '18px' }}>
              {ocrScore ? `${ocrScore}%` : '—'}
            </div>
          </div>
          <div className="card card-sm" style={{ textAlign: 'center' }}>
            <div className="stat-label">Fraud Risk</div>
            <div style={{ color: getFraudRiskColor(rejectedProb), fontWeight: 600, fontSize: '18px' }}>
              {getFraudRiskLabel(rejectedProb)}
            </div>
          </div>
        </div>
        
        <button className="btn btn-outline btn-full" onClick={() => navigate('/notifications')}>View All Notifications</button>
      </div>
    </div>
  );
}
