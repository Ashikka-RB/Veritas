import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const stepDescriptions = {
  1: "Front side of your Aadhaar card. Must be clear and unedited.",
  2: "Verify auto-extracted information and correct if needed.",
  3: "PAN number and name will be cross-verified against Aadhaar.",
  4: "Liveness detection + face match against Aadhaar photo.",
  5: "Verification request reviewed manually by an administrator."
};

export default function StartVerification() {
  const navigate = useNavigate();
  const [processData, setProcessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchKycProcess = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/kyc/process`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to retrieve verification process status.');
      }

      const data = await response.json();
      setProcessData(data);
      setLoading(false);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycProcess();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStepStyles = (step, isActive) => {
    const isAccessible = step.status !== 'Not Started';
    
    let border = '0.5px solid var(--border)';
    let cursor = 'default';
    let opacity = 1;
    let iconBg = 'var(--bg3)';
    let iconColor = 'var(--text3)';
    let badgeClass = 'badge-gray';
    let badgeText = step.status;

    if (isActive) {
      border = '1px solid var(--gold)';
    }

    if (isAccessible) {
      cursor = 'pointer';
    } else {
      opacity = 0.5;
    }

    if (step.status === 'Completed') {
      iconBg = 'var(--green-dim)';
      iconColor = 'var(--green)';
      border = '0.5px solid rgba(76,175,116,0.3)';
      badgeClass = 'badge-green';
    } else if (step.status === 'Ready' || step.status === 'In Progress') {
      iconBg = 'var(--gold-dim)';
      iconColor = 'var(--gold)';
      badgeClass = 'badge-gold';
    } else if (step.status === 'Requires Action' || step.status === 'Rejected') {
      iconBg = 'var(--red-dim)';
      iconColor = 'var(--red)';
      border = '0.5px solid rgba(226,75,74,0.3)';
      badgeClass = 'badge-red';
      badgeText = step.status === 'Requires Action' ? 'Action Required' : 'Rejected';
    }

    return { border, cursor, opacity, iconBg, iconColor, badgeClass, badgeText };
  };

  const handleStepClick = (step) => {
    if (processData?.status === 'Rejected' || processData?.status === 'Approved') return;
    if (step.status === 'Not Started') return;
    
    if (step.id === 1) navigate('/verify/aadhaar');
    else if (step.id === 2) navigate('/verify/ocr');
    else if (step.id === 3) navigate('/verify/pan');
    else if (step.id === 4) navigate('/verify/face');
    else if (step.id === 5) navigate('/verify/status');
  };

  function getPrimaryButtonConfig() {
    if (!processData) return { text: "Begin Verification", onClick: () => navigate('/verify/aadhaar') };

    const step = processData.currentStep;
    const status = processData.status;

    if (step === 1) {
      const isReupload = status === 'Action Required';
      return {
        text: isReupload ? "Re-upload Aadhaar Card" : "Begin Aadhaar Upload",
        onClick: () => navigate('/verify/aadhaar')
      };
    }
    if (step === 2) {
      return {
        text: "Review OCR Details",
        onClick: () => navigate('/verify/ocr')
      };
    }
    if (step === 3) {
      return {
        text: "Upload PAN Card",
        onClick: () => navigate('/verify/pan')
      };
    }
    if (step === 4) {
      return {
        text: "Proceed to Face Scan",
        onClick: () => navigate('/verify/face')
      };
    }
    if (step === 5) {
      if (status === 'Approved') {
        return {
          text: "Go to Dashboard",
          onClick: () => navigate('/dashboard')
        };
      }
      if (status === 'Rejected') {
        return {
          text: "Go to Dashboard",
          onClick: () => navigate('/dashboard')
        };
      }
      if (status === 'Action Required') {
        return {
          text: "Correct Details",
          onClick: () => navigate('/verify/aadhaar')
        };
      }
      return {
        text: "Check Full Status",
        onClick: () => navigate('/verify/status')
      };
    }
    return {
      text: "Begin Verification",
      onClick: () => navigate('/verify/aadhaar')
    };
  }

  if (loading) {
    return (
      <div className="page active" id="p-start">
        <Navbar type="back" backTo="/dashboard" />
        <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
          <div className="page-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div className="skeleton" style={{ width: '120px', height: '18px', borderRadius: '9px' }}></div>
            <div className="skeleton" style={{ width: '220px', height: '36px' }}></div>
            <div className="skeleton" style={{ width: '280px', height: '14px' }}></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
                <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }}></div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="skeleton" style={{ width: '40%', height: '16px' }}></div>
                  <div className="skeleton" style={{ width: '80%', height: '12px' }}></div>
                </div>
                <div className="skeleton" style={{ width: '70px', height: '24px', borderRadius: '12px' }}></div>
              </div>
            ))}
          </div>
          <div className="skeleton" style={{ width: '100%', height: '54px', borderRadius: '12px' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page active" id="p-start">
        <Navbar type="back" backTo="/dashboard" />
        <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px', textAlign: 'center' }}>
          <div className="card" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: '48px', color: 'var(--red)' }}></i>
            <h2>Failed to load verification process</h2>
            <p style={{ color: 'var(--text2)' }}>{error}</p>
            <button className="btn btn-gold" onClick={() => { setLoading(true); fetchKycProcess(); }}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const btnConfig = getPrimaryButtonConfig();

  // Dynamic Header contents
  let headerTitle = "Begin your KYC";
  let headerSubtitle = "Complete in 5 simple steps. Estimated time: 5–10 minutes.";
  if (processData.status === 'Approved') {
    headerTitle = "Verification Approved";
    headerSubtitle = "Your identity verification is successfully completed.";
  } else if (processData.status === 'Rejected') {
    headerTitle = "Verification Rejected";
    headerSubtitle = "Your verification request was rejected by compliance.";
  } else if (processData.status === 'Under Review') {
    headerTitle = "Admin Review In Progress";
    headerSubtitle = "Your documents are currently under review. Estimated wait: 5–10 min.";
  } else if (processData.status === 'Action Required') {
    headerTitle = "Action Required";
    headerSubtitle = "An administrator requested changes to your documents.";
  } else if (processData.status === 'In Progress') {
    headerTitle = "Verification In Progress";
  }

  return (
    <div className="page active" id="p-start">
      <Navbar type="back" backTo="/dashboard" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        <div className="page-header" style={{ textAlign: 'center' }}>
          <div className="eyebrow">Identity Verification</div>
          <h1>{headerTitle}</h1>
          <p>{headerSubtitle}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
          {processData.steps.map((step) => {
            const isActive = processData.currentStep === step.id;
            const styles = getStepStyles(step, isActive);

            return (
              <div 
                key={step.id} 
                className="card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px',
                  border: styles.border,
                  cursor: styles.cursor,
                  opacity: styles.opacity
                }}
                onClick={() => handleStepClick(step)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    background: styles.iconBg, 
                    border: '0.5px solid rgba(255,255,255,0.06)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0, 
                    fontFamily: 'var(--display)', 
                    fontSize: '18px', 
                    color: styles.iconColor 
                  }}>
                    {step.status === 'Completed' ? (
                      <i className="ti ti-circle-check" style={{ fontSize: '24px' }}></i>
                    ) : (
                      step.id
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>
                      {step.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                      {stepDescriptions[step.id]}
                    </div>
                    {step.status === 'Completed' && step.completedAt && (
                      <div style={{ fontSize: '11px', color: 'var(--green)', marginTop: '4px' }}>
                        Completed: {formatDate(step.completedAt)}
                      </div>
                    )}
                  </div>

                  <span className={`badge ${styles.badgeClass}`}>
                    {styles.badgeText}
                  </span>
                </div>

                {/* Display rejection reason or action details if applicable */}
                {step.id === 5 && (step.status === 'Requires Action' || step.status === 'Rejected') && (
                  <div style={{ 
                    marginTop: '4px', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    background: 'rgba(226,75,74,0.06)', 
                    border: '0.5px solid rgba(226,75,74,0.15)',
                    fontSize: '12px',
                    color: 'var(--text)'
                  }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ fontWeight: 600, color: 'var(--red)', marginBottom: '4px' }}>
                      {step.status === 'Requires Action' ? 'Admin Action Note:' : 'Compliance Feedback:'}
                    </div>
                    <div>
                      {processData.reuploadReason || processData.rejectionReason || processData.adminNotes || 'Please contact support.'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="card" style={{ background: 'var(--bg3)', marginBottom: '32px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}><i className="ti ti-info-circle" style={{ color: 'var(--gold)' }}></i> Documents needed</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: 'var(--text2)' }}>
            <div>• Original Aadhaar card (not laminated)</div><div>• PAN card (clear, unobstructed)</div>
            <div>• Good lighting for face scan</div><div>• Stable internet connection</div>
          </div>
        </div>
        
        <button 
          className="btn btn-gold btn-full btn-lg" 
          onClick={btnConfig.onClick}
        >
          {btnConfig.text} <i className="ti ti-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
