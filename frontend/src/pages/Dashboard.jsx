import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StepTracker from '../components/StepTracker';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashRes, timelineRes] = await Promise.all([
          fetch("http://localhost:8000/api/dashboard", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8000/api/verification-timeline", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!dashRes.ok || !timelineRes.ok) {
          throw new Error("Failed to retrieve dashboard details.");
        }

        const dashData = await dashRes.json();
        const timelineData = await timelineRes.json();

        setData(dashData);
        setTimeline(timelineData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'Pending';
    const date = new Date(dateStr);
    const now = new Date();
    
    const isToday = date.toDateString() === now.toDateString();
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    const timeStr = date.toLocaleTimeString('en-US', options);
    
    if (isToday) {
      return `Today, ${timeStr}`;
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${timeStr}`;
    }
    
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeStr}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getStepsRemainingText = (step) => {
    if (step >= 7) return "All steps completed successfully!";
    const remaining = 7 - step;
    return `Your KYC verification is in progress. ${remaining} step${remaining > 1 ? 's' : ''} remaining.`;
  };

  const handleQuickAction = () => {
    const step = data?.currentStep || 2;
    if (step === 2) navigate('/verify/aadhaar');
    else if (step === 3) navigate('/verify/ocr');
    else if (step === 4) navigate('/verify/pan');
    else if (step === 5) navigate('/verify/face');
    else if (step === 6 || step === 7) navigate('/verify/status');
  };

  const getQuickActionLabel = () => {
    const step = data?.currentStep || 2;
    if (step === 2) return "Upload Aadhaar";
    if (step === 3) return "Review OCR Details";
    if (step === 4) return "Upload PAN Card";
    if (step === 5) return "Start Face Verification";
    if (step === 6 || step === 7) return "Check Status";
    return "Continue Process";
  };

  if (loading) {
    return (
      <div className="page active" id="p-dashboard">
        <Navbar type="user" />
        <div className="container pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
          <div className="skeleton-container" style={{ marginBottom: '32px' }}>
            <div className="skeleton-title" style={{ width: '120px', height: '14px', background: 'var(--bg3)', marginBottom: '8px', borderRadius: '4px' }}></div>
            <div className="skeleton-name" style={{ width: '250px', height: '36px', background: 'var(--bg3)', marginBottom: '8px', borderRadius: '4px' }}></div>
            <div className="skeleton-subtitle" style={{ width: '320px', height: '14px', background: 'var(--bg3)', borderRadius: '4px' }}></div>
          </div>
          
          <div className="skeleton-tracker" style={{ height: '60px', background: 'var(--bg3)', marginBottom: '32px', borderRadius: '8px' }}></div>

          <div className="dash-grid">
            <div className="dash-main">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '20px' }}>
                <div className="card skeleton-card" style={{ height: '70px', background: 'var(--bg2)', border: 'none' }}></div>
                <div className="card skeleton-card" style={{ height: '70px', background: 'var(--bg2)', border: 'none' }}></div>
                <div className="card skeleton-card" style={{ height: '70px', background: 'var(--bg2)', border: 'none' }}></div>
              </div>
              <div className="card skeleton-card" style={{ height: '250px', marginBottom: '20px', background: 'var(--bg2)', border: 'none' }}></div>
              <div className="card skeleton-card" style={{ height: '120px', background: 'var(--bg2)', border: 'none' }}></div>
            </div>
            <div className="dash-side">
              <div className="card skeleton-card" style={{ height: '180px', marginBottom: '16px', background: 'var(--bg2)', border: 'none' }}></div>
              <div className="card skeleton-card" style={{ height: '180px', marginBottom: '16px', background: 'var(--bg2)', border: 'none' }}></div>
              <div className="card skeleton-card" style={{ height: '150px', background: 'var(--bg2)', border: 'none' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page active" id="p-dashboard">
        <Navbar type="user" />
        <div className="container pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div className="card" style={{ textAlign: 'center', maxWidth: '450px', padding: '40px' }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: '48px', color: 'var(--red)', marginBottom: '16px', display: 'block' }}></i>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '24px', fontWeight: 400, marginBottom: '12px' }}>Failed to load Dashboard</h2>
            <p style={{ color: 'var(--text3)', fontSize: '14px', marginBottom: '24px' }}>{error}</p>
            <button className="btn btn-gold" onClick={() => window.location.reload()}>Retry Loading</button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColorClass = (status) => {
    if (status === "Approved") return "var(--green)";
    if (status === "Rejected") return "var(--red)";
    if (status === "Action Required") return "var(--amber)";
    if (status === "Under Review") return "var(--gold)";
    return "var(--text)";
  };

  const getScoreColor = (score) => {
    if (score <= 30) return "var(--green)";
    if (score <= 70) return "var(--amber)";
    return "var(--red)";
  };

  return (
    <div className="page active" id="p-dashboard">
      <Navbar type="user" />
      <div className="container pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
            {getGreeting()}
          </div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: '36px', fontWeight: 400 }}>
            {data.fullName}
          </h1>
          <p style={{ color: 'var(--text2)', marginTop: '4px' }}>
            {getStepsRemainingText(data.currentStep)}
          </p>
        </div>

        <StepTracker currentStep={data.currentStep} />

        <div className="dash-grid">
          <div className="dash-main">
            {/* Status Alert Banners */}
            {(data.kycStatus === 'pending' || data.kycStatus === 'under_review') && (
              <div className="card" style={{ background: 'var(--bg3)', borderLeft: '4px solid var(--gold)', padding: '20px', borderRadius: 'var(--r-lg)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderTop: '0.5px solid var(--border)', borderRight: '0.5px solid var(--border)', borderBottom: '0.5px solid var(--border)' }}>
                <div style={{ background: 'var(--amber-dim)', color: 'var(--gold)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="ti ti-clock" style={{ fontSize: '20px' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 500, fontFamily: 'var(--display)', color: 'var(--gold)', letterSpacing: '0.5px' }}>Verification Under Review</div>
                  <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px', lineHeight: 1.6 }}>Your verification is under review. We are currently checking your uploaded documents.</div>
                </div>
              </div>
            )}

            {data.kycStatus === 'approved' && (
              <div className="card" style={{ background: 'var(--bg3)', borderLeft: '4px solid var(--green)', padding: '20px', borderRadius: 'var(--r-lg)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderTop: '0.5px solid var(--border)', borderRight: '0.5px solid var(--border)', borderBottom: '0.5px solid var(--border)' }}>
                <div style={{ background: 'var(--green-dim)', color: 'var(--green)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="ti ti-circle-check" style={{ fontSize: '20px' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 500, fontFamily: 'var(--display)', color: 'var(--green)', letterSpacing: '0.5px' }}>KYC Approved</div>
                  <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px', lineHeight: 1.6 }}>Your eKYC has been successfully approved! You now have full access to the platform services.</div>
                </div>
              </div>
            )}

            {data.kycStatus === 'rejected' && (
              <div className="card" style={{ background: 'var(--bg3)', borderLeft: '4px solid var(--red)', padding: '20px', borderRadius: 'var(--r-lg)', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '0.5px solid var(--border)', borderRight: '0.5px solid var(--border)', borderBottom: '0.5px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'var(--red-dim)', color: 'var(--red)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="ti ti-circle-x" style={{ fontSize: '20px' }}></i>
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 500, fontFamily: 'var(--display)', color: 'var(--red)', letterSpacing: '0.5px' }}>Verification Failed</div>
                    <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px', lineHeight: 1.6 }}>Unfortunately, your identity verification was rejected by our compliance team.</div>
                  </div>
                </div>
                {data.rejectionReason && (
                  <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', marginLeft: '56px', lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>Rejection Reason:</span>
                    <span style={{ color: 'var(--text3)' }}>{data.rejectionReason}</span>
                  </div>
                )}
                <div style={{ marginLeft: '56px', fontSize: '12px', color: 'var(--text3)' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text2)' }}>Status:</span>
                  <span className="badge badge-red" style={{ marginLeft: '6px' }}>Rejected</span>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '20px' }}>
              <div className="card card-sm">
                <div className="stat-label">Verification Status</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: getStatusColorClass(data.verificationStatus) }}>
                  {data.verificationStatus}
                </div>
              </div>
              <div className="card card-sm">
                <div className="stat-label">Fraud Score</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: data.fraudRiskScore !== null ? getScoreColor(data.fraudRiskScore) : 'var(--text3)' }}>
                  {data.fraudRiskScore !== null ? `${data.fraudRiskScore}% — ${data.riskCategory}` : 'Pending'}
                </div>
              </div>
              <div className="card card-sm">
                <div className="stat-label">Est. Time</div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>
                  {data.estimatedTime}
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '15px', fontWeight: 500 }}>Verification Timeline</div>
                <span className="badge badge-amber" style={{ color: getStatusColorClass(data.verificationStatus), background: 'var(--bg2)' }}>
                  <i className="ti ti-clock"></i> {data.verificationStatus}
                </span>
              </div>
              <div className="timeline">
                {timeline.map((item, idx) => (
                  <div className="tl-item" key={idx}>
                    <div className={`tl-dot ${item.status}`}></div>
                    <div className="tl-title">{item.title}</div>
                    <div className="tl-sub" style={{ color: item.status === 'active' ? 'var(--gold)' : 'var(--text3)' }}>
                      {item.status === 'pending' ? 'Pending' : formatTimestamp(item.timestamp)} {item.subtitle && `(${item.subtitle})`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '16px' }}>Continue Verification</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div 
                  style={{ 
                    background: 'var(--bg3)', 
                    border: '0.5px solid var(--border)', 
                    borderRadius: 'var(--r)', 
                    padding: '16px', 
                    cursor: data.currentStep === 4 ? 'pointer' : 'default', 
                    opacity: data.currentStep === 4 ? 1 : 0.5 
                  }} 
                  onClick={() => data.currentStep === 4 && navigate('/verify/pan')}
                >
                  <i className="ti ti-file-certificate" style={{ fontSize: '20px', color: data.currentStep === 4 ? 'var(--gold)' : 'var(--text4)', marginBottom: '8px', display: 'block' }}></i>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>Upload PAN Card</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
                    {data.currentStep > 4 ? 'Completed' : data.currentStep === 4 ? 'Action required' : 'Locked'}
                  </div>
                </div>
                <div 
                  style={{ 
                    background: 'var(--bg3)', 
                    border: '0.5px solid var(--border)', 
                    borderRadius: 'var(--r)', 
                    padding: '16px', 
                    cursor: data.currentStep === 5 ? 'pointer' : 'default', 
                    opacity: data.currentStep === 5 ? 1 : 0.5 
                  }}
                  onClick={() => data.currentStep === 5 && navigate('/verify/face')}
                >
                  <i className="ti ti-face-id" style={{ fontSize: '20px', color: data.currentStep === 5 ? 'var(--gold)' : 'var(--text4)', marginBottom: '8px', display: 'block' }}></i>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>Face Verification</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
                    {data.currentStep > 5 ? 'Completed' : data.currentStep === 5 ? 'Action required' : 'Locked'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dash-side">
            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '16px' }}>Fraud Risk Score</div>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                {data.fraudRiskScore !== null ? (
                  <svg className="fraud-ring-svg score-circle" viewBox="0 0 120 120" style={{ width: '100px', height: '100px' }}>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg3)" strokeWidth="8"/>
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      fill="none" 
                      stroke={getScoreColor(data.fraudRiskScore)} 
                      strokeWidth="8" 
                      strokeDasharray="314" 
                      strokeDashoffset={314 - (314 * data.fraudRiskScore) / 100} 
                      strokeLinecap="round" 
                      transform="rotate(-90 60 60)"
                    />
                    <text x="60" y="55" textAnchor="middle" fill="var(--text)" fontSize="18" fontFamily="Playfair Display" fontWeight="400">{data.fraudRiskScore}%</text>
                    <text x="60" y="72" textAnchor="middle" fill="var(--text3)" fontSize="9" fontFamily="DM Sans">{data.riskCategory.toUpperCase()} RISK</text>
                  </svg>
                ) : (
                  <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: '13px' }}>
                    Pending ML verification
                  </div>
                )}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', lineHeight: 1.6 }}>Based on face score, OCR confidence, and submission patterns.</div>
            </div>

            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '12px' }}>Recent Notifications</div>
              {data.recentNotifications && data.recentNotifications.length > 0 ? (
                data.recentNotifications.map((notif, idx) => (
                  <div className="notif-item" style={{ cursor: 'pointer' }} key={idx} onClick={() => navigate('/notifications')}>
                    <div 
                      className="notif-icon" 
                      style={{ 
                        background: notif.type === 'success' || notif.type === 'passed' ? 'var(--green-dim)' : 'var(--amber-dim)', 
                        color: notif.type === 'success' || notif.type === 'passed' ? 'var(--green)' : 'var(--amber)' 
                      }}
                    >
                      <i className={notif.type === 'success' || notif.type === 'passed' ? "ti ti-check" : "ti ti-alert-triangle"}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 500 }}>{notif.title}</div>
                      <div className="notif-time">{formatTimestamp(notif.timestamp)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text3)', fontSize: '12px' }}>No recent notifications.</div>
              )}
            </div>

            <div className="card">
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '12px' }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn btn-gold btn-full" onClick={handleQuickAction}>
                  {getQuickActionLabel()} <i className="ti ti-arrow-right"></i>
                </button>
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
