import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { maskAadhaar, maskPan } from '../utils/masking';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `http://localhost:8000/${path}`;
};

export default function VerifyUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch(`http://localhost:8000/api/admin/review-item/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch verification details');
        }
        return res.json();
      })
      .then((resData) => {
        console.log("API RESPONSE RETURNED TO VERIFYUSER.JSX:", resData);
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const queue = data?.queue;
  const dbUser = data?.user;

  const [notes, setNotes] = useState('');

  console.log("QUEUE:", queue);
  console.log("USER:", dbUser);

  const approveUserRecord = async () => {
    if (!queue?._id) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:8000/api/admin/approve/${queue._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminNotes: notes })
      });
      navigate('/admin/dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  const rejectUserRecord = async () => {
    if (!queue?._id) return;
    if (!notes.trim()) {
      alert('Please enter a rejection reason in the Admin Notes field.');
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:8000/api/admin/reject/${queue._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminNotes: notes })
      });
      navigate('/admin/dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  const reuploadUserRecord = async () => {
    if (!queue?._id) return;
    if (!notes.trim()) {
      alert('Please enter a reason for requesting re-upload in the Admin Notes field.');
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:8000/api/admin/reupload/${queue._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminNotes: notes })
      });
      navigate('/admin/dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  if (loading || !data || !queue) {
    return (
      <div className="page active" id="p-verify-user">
        <div className="admin-layout">
          <AdminSidebar />
          <div className="admin-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text3)' }}>
            <div style={{ textAlign: 'center' }}>
              <i className="ti ti-loader spin" style={{ fontSize: '32px', color: 'var(--gold)', display: 'block', margin: '0 auto 16px' }}></i>
              <div style={{ fontSize: '14px' }}>Loading user verification details...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if name matches between PAN and Aadhaar
  const namesMatch = dbUser?.panName && dbUser?.aadhaarName && 
    dbUser.panName.trim().toUpperCase() === dbUser.aadhaarName.trim().toUpperCase();

  const appProb = queue.approvedProbability || 0;
  const revProb = queue.manualReviewProbability || 0;
  const rejProb = queue.rejectedProbability || 0;

  let maxProb = appProb;
  let predictedOutcome = "APPROVED";
  if (revProb > maxProb) {
    maxProb = revProb;
    predictedOutcome = "MANUAL REVIEW";
  }
  if (rejProb > maxProb) {
    maxProb = rejProb;
    predictedOutcome = "REJECTED";
  }

  return (
    <div className="page active" id="p-verify-user">
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          <div className="admin-topbar">
            <div>
              <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>User Review</div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 400 }}>
                {dbUser?.fullName || queue.fullName || 'Guest User'}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-danger" style={{ fontSize: '13px' }} onClick={rejectUserRecord}>Reject</button>
              <button className="btn btn-outline" style={{ fontSize: '13px' }} onClick={reuploadUserRecord}>Request Re-upload</button>
              <button className="btn btn-success" style={{ fontSize: '13px', padding: '10px 24px' }} onClick={approveUserRecord}>✓ Approve</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div className="stat-card">
              <div className="stat-label">Face Match</div>
              <div className="stat-value" style={{ color: 'var(--green)', fontSize: '22px' }}>
                {queue.faceMatchScore ? `${queue.faceMatchScore}%` : '—'}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">OCR Confidence</div>
              <div className="stat-value" style={{ color: 'var(--green)', fontSize: '22px' }}>
                {queue.ocrConfidence ? `${queue.ocrConfidence}%` : '—'}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Overall Risk</div>
              <div 
                className="stat-value" 
                style={{ 
                  color: (queue.rejectedProbability || 0) > (queue.manualReviewProbability || 0) && (queue.rejectedProbability || 0) > (queue.approvedProbability || 0)
                    ? 'var(--red)' 
                    : (queue.manualReviewProbability || 0) > (queue.approvedProbability || 0)
                    ? 'var(--amber)' 
                    : 'var(--green)', 
                  fontSize: '18px',
                  fontWeight: 600,
                  marginTop: '4px'
                }}
              >
                {(queue.rejectedProbability || 0) > (queue.manualReviewProbability || 0) && (queue.rejectedProbability || 0) > (queue.approvedProbability || 0)
                  ? 'HIGH RISK' 
                  : (queue.manualReviewProbability || 0) > (queue.approvedProbability || 0)
                  ? 'MEDIUM RISK' 
                  : 'LOW RISK'}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Liveness</div>
              <div className="stat-value" style={{ color: queue.finalStatus === 'FAILED' ? 'var(--red)' : 'var(--green)', fontSize: '22px' }}>
                {queue.finalStatus === 'FAILED' ? 'Fail' : 'Pass'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="card">
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '16px' }}>Uploaded Documents & Verification Image</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '6px' }}>Aadhaar Card</div>
                  {dbUser?.aadhaarFile ? (
                    <img 
                      src={getImageUrl(dbUser.aadhaarFile)} 
                      alt="Aadhaar" 
                      style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '0.5px solid var(--border)', cursor: 'pointer' }}
                      onClick={() => setPreviewImage(getImageUrl(dbUser.aadhaarFile))}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)', borderRadius: '8px', color: 'var(--text3)', fontSize: '11px' }}>Not Uploaded</div>
                  )}
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '6px' }}>PAN Card</div>
                  {dbUser?.panFile ? (
                    <img 
                      src={getImageUrl(dbUser.panFile)} 
                      alt="PAN" 
                      style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '0.5px solid var(--border)', cursor: 'pointer' }}
                      onClick={() => setPreviewImage(getImageUrl(dbUser.panFile))}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)', borderRadius: '8px', color: 'var(--text3)', fontSize: '11px' }}>Not Uploaded</div>
                  )}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '6px' }}>Captured Face</div>
                  {dbUser?.faceImage ? (
                    <img 
                      src={getImageUrl(dbUser.faceImage)} 
                      alt="Webcam Face" 
                      style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '0.5px solid var(--border)', cursor: 'pointer' }}
                      onClick={() => setPreviewImage(getImageUrl(dbUser.faceImage))}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)', borderRadius: '8px', color: 'var(--text3)', fontSize: '11px' }}>Not Uploaded</div>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '16px' }}>OCR Extracted Details</div>
              <div style={{ background: 'var(--bg3)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                <div className="ocr-field-row" style={{ padding: '10px 14px' }}>
                  <span className="ocr-key">Name</span>
                  <span className="ocr-val" style={{ fontSize: '12px' }}>
                    {dbUser?.aadhaarName || dbUser?.fullName || queue.fullName || 'Not Found'}
                  </span>
                </div>
                <div className="ocr-field-row" style={{ padding: '10px 14px' }}>
                  <span className="ocr-key">DOB</span>
                  <span className="ocr-val" style={{ fontSize: '12px' }}>
                    {dbUser?.aadhaarDOB || 'Not Found'}
                  </span>
                </div>
                <div className="ocr-field-row" style={{ padding: '10px 14px' }}>
                  <span className="ocr-key">Aadhaar</span>
                  <span className="ocr-val" style={{ fontSize: '12px' }}>
                    {maskAadhaar(dbUser?.aadhaarNumber)}
                  </span>
                </div>
                <div className="ocr-field-row" style={{ padding: '10px 14px' }}>
                  <span className="ocr-key">PAN</span>
                  <span className="ocr-val" style={{ fontSize: '12px' }}>
                    {maskPan(dbUser?.panNumber)}
                  </span>
                </div>
                <div className="ocr-field-row" style={{ padding: '10px 14px' }}>
                  <span className="ocr-key">Email</span>
                  <span className="ocr-val" style={{ fontSize: '12px' }}>
                    {dbUser?.email || queue.email || 'Not Found'}
                  </span>
                </div>
                <div className="ocr-field-row" style={{ padding: '10px 14px' }}>
                  <span className="ocr-key">Phone</span>
                  <span className="ocr-val" style={{ fontSize: '12px' }}>
                    {dbUser?.phone || queue.phone || 'Not Found'}
                  </span>
                </div>
                <div className="ocr-field-row" style={{ padding: '10px 14px', border: 'none' }}>
                  <span className="ocr-key">PAN Match</span>
                  {namesMatch ? (
                    <span className="badge badge-green">✓ Names Match</span>
                  ) : (
                    <span className="badge badge-amber">⚠ Name Mismatch</span>
                  )}
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Face Match Score</div>
                <div className="progress-bar-bg" style={{ height: '6px' }}>
                  <div className="progress-bar-fill green" style={{ width: queue.faceMatchScore ? `${queue.faceMatchScore}%` : '0%' }}></div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--green)', marginTop: '4px', textAlign: 'right' }}>
                  {queue.faceMatchScore ? `${queue.faceMatchScore}%` : '0%'} Match
                </div>
              </div>

              <div style={{ marginTop: '16px', borderTop: '0.5px solid var(--border)', paddingTop: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>ML Risk Assessment</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center', marginTop: '10px', marginBottom: '12px' }}>
                  <div style={{ background: 'var(--bg2)', padding: '8px', borderRadius: '6px', border: '0.5px solid var(--border)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Approval Prob.</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--mono)' }}>{appProb}%</div>
                  </div>
                  <div style={{ background: 'var(--bg2)', padding: '8px', borderRadius: '6px', border: '0.5px solid var(--border)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Review Prob.</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--mono)' }}>{revProb}%</div>
                  </div>
                  <div style={{ background: 'var(--bg2)', padding: '8px', borderRadius: '6px', border: '0.5px solid var(--border)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Rejection Prob.</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--red)', fontFamily: 'var(--mono)' }}>{rejProb}%</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg2)', padding: '10px 14px', borderRadius: '6px', border: '0.5px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Predicted Outcome:</span>
                  <span className={`badge ${predictedOutcome === 'APPROVED' ? 'badge-green' : predictedOutcome === 'MANUAL REVIEW' ? 'badge-amber' : 'badge-red'}`} style={{ fontWeight: 600 }}>
                    {predictedOutcome}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 0, marginBottom: '20px' }}>
            <div style={{ padding: '14px 20px', borderBottom: '0.5px solid var(--border)', fontSize: '13px', fontWeight: 500 }}>Audit Log</div>
            <div className="audit-row">
              <span style={{ minWidth: '140px', color: 'var(--text3)' }}>Timeline 1</span>
              <span style={{ flex: 1 }}>Account registered &amp; OTP verified</span>
              <span style={{ color: 'var(--green)' }}>OK</span>
            </div>
            <div className="audit-row">
              <span style={{ minWidth: '140px', color: 'var(--text3)' }}>Timeline 2</span>
              <span style={{ flex: 1 }}>Aadhaar uploaded &amp; verified</span>
              <span style={{ color: 'var(--green)' }}>OK</span>
            </div>
            <div className="audit-row">
              <span style={{ minWidth: '140px', color: 'var(--text3)' }}>Timeline 3</span>
              <span style={{ flex: 1 }}>OCR extraction · {queue.ocrConfidence || dbUser?.ocrConfidence || 0}% confidence</span>
              <span style={{ color: 'var(--green)' }}>OK</span>
            </div>
            <div className="audit-row">
              <span style={{ minWidth: '140px', color: 'var(--text3)' }}>Timeline 4</span>
              <span style={{ flex: 1 }}>
                PAN uploaded · {namesMatch ? 'name match confirmed' : 'name mismatch warning'}
              </span>
              <span style={{ color: namesMatch ? 'var(--green)' : 'var(--amber)' }}>
                {namesMatch ? 'OK' : 'WARNING'}
              </span>
            </div>
            <div className="audit-row">
              <span style={{ minWidth: '140px', color: 'var(--text3)' }}>Timeline 5</span>
              <span style={{ flex: 1 }}>Face verification · {queue.faceMatchScore}% · liveness checks completed</span>
              <span style={{ color: 'var(--green)' }}>OK</span>
            </div>
            <div className="audit-row" style={{ border: 'none' }}>
              <span style={{ minWidth: '140px', color: 'var(--text3)' }}>Timeline 6</span>
              <span style={{ flex: 1 }}>
                Fraud ML outcome: {predictedOutcome} (Approve: {appProb}%, Review: {revProb}%, Reject: {rejProb}%)
              </span>
              <span 
                style={{ 
                  color: predictedOutcome === 'REJECTED' 
                    ? 'var(--red)' 
                    : predictedOutcome === 'MANUAL REVIEW' 
                    ? 'var(--amber)' 
                    : 'var(--green)',
                  fontWeight: 600
                }}
              >
                {predictedOutcome === 'REJECTED' ? 'HIGH RISK' : predictedOutcome === 'MANUAL REVIEW' ? 'MEDIUM RISK' : 'LOW RISK'}
              </span>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--bg3)' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Admin Notes</div>
            <textarea
              rows="3"
              placeholder="Add review notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="btn btn-success btn-full" onClick={approveUserRecord}>✓ Approve &amp; Notify User</button>
              <button className="btn btn-outline btn-full" onClick={reuploadUserRecord}>Request Re-upload</button>
              <button className="btn btn-danger btn-full" onClick={rejectUserRecord}>✕ Reject with Reason</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Premium Image Preview Modal */}
      {previewImage && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8,8,8,0.92)',
            backdropFilter: 'blur(20px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setPreviewImage(null)}
        >
          <img 
            src={previewImage} 
            alt="Preview" 
            style={{ 
              maxWidth: '90%', 
              maxHeight: '90%', 
              borderRadius: 'var(--r-lg)',
              border: '0.5px solid var(--border3)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
              objectFit: 'contain'
            }} 
          />
          <button 
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid var(--border2)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'var(--text)',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setPreviewImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
