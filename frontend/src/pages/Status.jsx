import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Status() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStatusAndNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const [resStatus, resNotif] = await Promise.all([
        fetch('http://localhost:8000/api/kyc/status', { headers }),
        fetch('http://localhost:8000/api/notifications', { headers })
      ]);

      if (resStatus.status === 401 || resNotif.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
        return;
      }

      if (!resStatus.ok || !resNotif.ok) {
        throw new Error('Failed to retrieve your KYC status data.');
      }

      const dataStatus = await resStatus.json();
      const dataNotif = await resNotif.json();

      setStatus(dataStatus);
      setNotifications(dataNotif);
      setLoading(false);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusAndNotifications();

    // Auto-refresh status every 30 seconds
    const interval = setInterval(fetchStatusAndNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const getFraudRiskColor = (risk) => {
    if (risk === 'Low') return 'var(--green)';
    if (risk === 'Medium') return 'var(--amber)';
    if (risk === 'High') return 'var(--red)';
    return 'var(--text)';
  };

  // Remaining steps calculation
  const stepsList = ['AADHAAR', 'OCR', 'PAN', 'FACE', 'REVIEW', 'COMPLETED'];
  const currentStepIdx = status ? stepsList.indexOf(status.currentStep) : 0;
  const remainingStepsCount = currentStepIdx >= 0 ? Math.max(0, 5 - currentStepIdx) : 0;

  if (loading) {
    return (
      <div className="page active" id="p-status">
        <Navbar type="back" backTo="/dashboard" />
        <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
          
          {/* Skeleton Hero */}
          <div className="status-hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div className="skeleton" style={{ width: '150px', height: '24px', borderRadius: '12px' }}></div>
            <div className="skeleton" style={{ width: '250px', height: '36px' }}></div>
            <div className="skeleton" style={{ width: '180px', height: '14px' }}></div>
          </div>

          {/* Skeleton Timeline */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="skeleton skeleton-title" style={{ marginBottom: '20px' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div className="skeleton" style={{ width: '12px', height: '12px', borderRadius: '50%' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="card card-sm" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
                <div className="skeleton" style={{ width: '40px', height: '20px' }}></div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  const decision = status?.adminReviewStatus || 'Pending';
  const faceMatch = status?.faceMatchScore || 0;
  const ocrScore = status?.ocrScore || 0;
  const rejectedProb = status?.rejectedProbability || 0;

  return (
    <div className="page active" id="p-status">
      <Navbar type="back" backTo="/dashboard" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        
        {/* Error Callout */}
        {error && (
          <div className="lock-warning" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <i className="ti ti-alert-circle" style={{ marginRight: '8px' }}></i>
              Error: {error}
            </div>
            <button className="btn btn-gold btn-outline" style={{ padding: '4px 12px', fontSize: '11px' }} onClick={fetchStatusAndNotifications}>
              Retry
            </button>
          </div>
        )}

        {/* Status Hero Section */}
        <div className="status-hero">
          {decision === 'APPROVED' ? (
            <>
              <div className="status-badge-lg" style={{ background: 'var(--green-dim)', color: 'var(--green)', border: '0.5px solid rgba(76,175,80,0.25)' }}>
                <i className="ti ti-circle-check"></i> Verification Approved
              </div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '36px', fontWeight: 400, marginBottom: '8px' }}>
                Hey {status.fullName},<br/>your identity is verified
              </h1>
              <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '16px' }}>You have successfully completed the eKYC process.</p>
              {status?.adminNotes && (
                <div className="card" style={{ maxWidth: '500px', margin: '16px auto 0', textAlign: 'left', background: 'var(--bg3)', border: '0.5px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green)', textTransform: 'uppercase', marginBottom: '6px' }}>Admin Notes</div>
                  <div style={{ fontSize: '13px', color: 'var(--text)' }}>{status.adminNotes}</div>
                </div>
              )}
            </>
          ) : decision === 'REJECTED' ? (
            <>
              <div className="status-badge-lg" style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '0.5px solid rgba(226,75,74,0.25)' }}>
                <i className="ti ti-circle-x"></i> Verification Rejected
              </div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '36px', fontWeight: 400, marginBottom: '8px' }}>
                Verification failed
              </h1>
              <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '16px' }}>Your submission did not pass our verification criteria.</p>
              {status?.rejectionReason && (
                <div className="card" style={{ maxWidth: '500px', margin: '16px auto 0', textAlign: 'left', background: 'var(--bg3)', border: '0.5px solid var(--red)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--red)', textTransform: 'uppercase', marginBottom: '6px' }}>Reason for Rejection</div>
                  <div style={{ fontSize: '13px', color: 'var(--text)' }}>{status.rejectionReason}</div>
                </div>
              )}
            </>
          ) : decision === 'REUPLOAD_REQUIRED' ? (
            <>
              <div className="status-badge-lg" style={{ background: 'var(--amber-dim)', color: 'var(--amber)', border: '0.5px solid rgba(232,160,48,0.25)' }}>
                <i className="ti ti-alert-circle"></i> Action Required
              </div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '36px', fontWeight: 400, marginBottom: '8px' }}>
                Please Re-upload Documents
              </h1>
              <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '16px' }}>The admin has requested that you re-submit your documents.</p>
              {status?.reuploadReason && (
                <div className="card" style={{ maxWidth: '500px', margin: '16px auto 16px', textAlign: 'left', background: 'var(--bg3)', border: '0.5px solid var(--amber)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--amber)', textTransform: 'uppercase', marginBottom: '6px' }}>Reason for Request</div>
                  <div style={{ fontSize: '13px', color: 'var(--text)' }}>{status.reuploadReason}</div>
                </div>
              )}
              <button 
                className="btn btn-gold btn-lg" 
                onClick={() => navigate('/verify/start')} 
                style={{ marginTop: '8px', marginBottom: '16px' }}
              >
                Re-upload Documents
              </button>
            </>
          ) : (
            <>
              <div className="status-badge-lg" style={{ background: 'var(--amber-dim)', color: 'var(--amber)', border: '0.5px solid rgba(232,160,48,0.25)' }}>
                <i className="ti ti-clock"></i> Verification Status: {status.verificationStatus}
              </div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '36px', fontWeight: 400, marginBottom: '8px' }}>
                Hey {status.fullName},<br/>status check
              </h1>
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>
                Current Step: <strong style={{ color: 'var(--gold)' }}>{status.currentStep}</strong> · {remainingStepsCount} step{remainingStepsCount !== 1 ? 's' : ''} remaining
              </div>
            </>
          )}
        </div>

        {/* Timeline Section */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '20px' }}>Verification Timeline</div>
          <div className="timeline">
            {status.timeline.map((item, idx) => {
              const isCompleted = item.status === 'Completed';
              const isInProgress = item.status === 'In Progress';
              
              let dotClass = 'tl-dot pending';
              if (isCompleted) dotClass = 'tl-dot done';
              else if (isInProgress) dotClass = 'tl-dot active';

              if (item.step === 'Admin Review' && decision === 'REJECTED') {
                dotClass = 'tl-dot active';
              }

              const formattedTime = item.completedAt 
                ? new Date(item.completedAt).toLocaleString() 
                : '';

              return (
                <div className="tl-item" key={idx}>
                  <div className={dotClass} style={{
                    background: (item.step === 'Admin Review' && decision === 'REJECTED') 
                      ? 'var(--red)' 
                      : (item.step === 'Admin Review' && decision === 'REUPLOAD_REQUIRED')
                      ? 'var(--amber)'
                      : undefined
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <div className="tl-title" style={{
                      color: (item.step === 'Admin Review' && decision === 'REJECTED')
                        ? 'var(--red)'
                        : (item.step === 'Admin Review' && decision === 'REUPLOAD_REQUIRED')
                        ? 'var(--amber)'
                        : (isInProgress ? 'var(--gold)' : undefined)
                    }}>
                      {item.step}
                    </div>
                    {formattedTime && <div className="tl-sub" style={{ fontSize: '10px', color: 'var(--text3)' }}>{formattedTime}</div>}
                    {!isCompleted && isInProgress && (
                      <div className="tl-sub" style={{ color: 'var(--amber)' }}>
                        {status.estimatedTime ? `Est. duration: ${status.estimatedTime}` : 'In progress'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
            <div style={{ color: getFraudRiskColor(status.fraudRisk), fontWeight: 600, fontSize: '18px' }}>
              {status.fraudRisk || '—'}
            </div>
          </div>
        </div>

        {/* Recent Notifications Panel */}
        <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 500 }}>Recent Notifications</div>
            <span className="badge badge-gray">{notifications.length} Total</span>
          </div>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '12px', color: 'var(--text3)', fontSize: '13px' }}>
              No notifications.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', paddingBottom: '12px', borderBottom: '0.5px solid var(--border)' }}>
                  <span className={notif.badgeClass} style={{ fontSize: '9px', padding: '2px 6px', marginTop: '2px' }}>
                    {notif.type}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{notif.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>{notif.message}</div>
                    <div style={{ fontSize: '9px', color: 'var(--text4)', marginTop: '4px' }}>
                      {new Date(notif.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button 
            className="btn btn-ghost btn-full" 
            style={{ marginTop: '12px', fontSize: '12px' }}
            onClick={() => navigate('/notifications')}
          >
            View All Notifications →
          </button>
        </div>

        <button className="btn btn-outline btn-full" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    </div>
  );
}

