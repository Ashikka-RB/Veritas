import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

export default function VerifyUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/admin/review-item/${id}`)
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

  console.log("QUEUE:", queue);
  console.log("USER:", dbUser);

  const approveUserRecord = async () => {
    if (!queue?._id) return;
    try {
      await fetch(`http://localhost:8000/api/admin/approve/${queue._id}`, {
        method: 'PUT',
      });
      navigate('/admin/dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  const rejectUserRecord = async () => {
    if (!queue?._id) return;
    try {
      await fetch(`http://localhost:8000/api/admin/reject/${queue._id}`, {
        method: 'PUT',
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
              <button className="btn btn-outline" style={{ fontSize: '13px' }}>Request Re-upload</button>
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
              <div className="stat-label">Fraud Score</div>
              <div className="stat-value" style={{ color: queue.rejectedProbability > 70 ? 'var(--red)' : queue.rejectedProbability >= 30 ? 'var(--amber)' : 'var(--green)', fontSize: '22px' }}>
                {queue.rejectedProbability ? `${queue.rejectedProbability}%` : '—'}
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
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '16px' }}>Uploaded Documents</div>
              <div
                className="doc-preview"
                style={{ marginBottom: '12px', cursor: dbUser?.aadhaarFile ? 'pointer' : 'default' }}
                onClick={() => dbUser?.aadhaarFile && window.open(`http://localhost:8000/${dbUser.aadhaarFile}`, '_blank')}
              >
                <i className="ti ti-id-badge" style={{ fontSize: '32px', color: 'var(--text4)' }}></i>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                  {dbUser?.aadhaarFile ? dbUser.aadhaarFile.split('/').pop() : 'aadhaar_front.jpg'}
                </div>
              </div>
              <div
                className="doc-preview"
                style={{ cursor: dbUser?.panFile ? 'pointer' : 'default' }}
                onClick={() => dbUser?.panFile && window.open(`http://localhost:8000/${dbUser.panFile}`, '_blank')}
              >
                <i className="ti ti-credit-card" style={{ fontSize: '32px', color: 'var(--text4)' }}></i>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                  {dbUser?.panFile ? dbUser.panFile.split('/').pop() : 'pan_card.jpg'}
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
                    {dbUser?.aadhaarNumber || 'Not Found'}
                  </span>
                </div>
                <div className="ocr-field-row" style={{ padding: '10px 14px' }}>
                  <span className="ocr-key">PAN</span>
                  <span className="ocr-val" style={{ fontSize: '12px' }}>
                    {dbUser?.panNumber || 'Not Found'}
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
                <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>ML Decision Probabilities</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center', marginTop: '10px' }}>
                  <div style={{ background: 'var(--bg2)', padding: '6px 8px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text3)' }}>Approved</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green)', fontFamily: 'var(--mono)' }}>{queue.approvedProbability || 0}%</div>
                  </div>
                  <div style={{ background: 'var(--bg2)', padding: '6px 8px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text3)' }}>Review</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--amber)', fontFamily: 'var(--mono)' }}>{queue.manualReviewProbability || 0}%</div>
                  </div>
                  <div style={{ background: 'var(--bg2)', padding: '6px 8px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text3)' }}>Rejected</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--red)', fontFamily: 'var(--mono)' }}>{queue.rejectedProbability || 0}%</div>
                  </div>
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
              <span style={{ flex: 1 }}>OCR extraction · {queue.ocrConfidence || 94}% confidence</span>
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
                Fraud ML score: {queue.rejectedProbability}% ({queue.rejectedProbability < 30 ? 'LOW' : queue.rejectedProbability <= 70 ? 'MEDIUM' : 'HIGH'})
              </span>
              <span style={{ color: queue.rejectedProbability > 70 ? 'var(--red)' : queue.rejectedProbability >= 30 ? 'var(--amber)' : 'var(--green)' }}>
                OK
              </span>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--bg3)' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Admin Notes</div>
            <textarea rows="3" placeholder="Add review notes here..."></textarea>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="btn btn-success btn-full" onClick={approveUserRecord}>✓ Approve &amp; Notify User</button>
              <button className="btn btn-danger btn-full" onClick={rejectUserRecord}>✕ Reject with Reason</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
