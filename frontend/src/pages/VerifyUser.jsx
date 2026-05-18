import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function VerifyUser() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="p-verify-user">
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          <div className="admin-topbar">
            <div>
              <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>User Review</div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 400 }}>Priya Krishnamurthy</h1>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-danger" style={{ fontSize: '13px' }}>Reject</button>
              <button className="btn btn-outline" style={{ fontSize: '13px' }}>Request Re-upload</button>
              <button className="btn btn-success" style={{ fontSize: '13px', padding: '10px 24px' }} onClick={() => navigate('/admin/dashboard')}>✓ Approve</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div className="stat-card"><div className="stat-label">Face Match</div><div className="stat-value" style={{ color: 'var(--green)', fontSize: '22px' }}>94.2%</div></div>
            <div className="stat-card"><div className="stat-label">OCR Confidence</div><div className="stat-value" style={{ color: 'var(--green)', fontSize: '22px' }}>94%</div></div>
            <div className="stat-card"><div className="stat-label">Fraud Score</div><div className="stat-value" style={{ color: 'var(--green)', fontSize: '22px' }}>18%</div></div>
            <div className="stat-card"><div className="stat-label">Liveness</div><div className="stat-value" style={{ color: 'var(--green)', fontSize: '22px' }}>Pass</div></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="card">
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '16px' }}>Uploaded Documents</div>
              <div className="doc-preview" style={{ marginBottom: '12px' }}><i className="ti ti-id-badge" style={{ fontSize: '32px', color: 'var(--text4)' }}></i><div style={{ fontSize: '11px', color: 'var(--text3)' }}>aadhaar_front.jpg</div></div>
              <div className="doc-preview"><i className="ti ti-credit-card" style={{ fontSize: '32px', color: 'var(--text4)' }}></i><div style={{ fontSize: '11px', color: 'var(--text3)' }}>pan_card.jpg</div></div>
            </div>
            <div className="card">
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '16px' }}>OCR Extracted Details</div>
              <div style={{ background: 'var(--bg3)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                <div className="ocr-field-row" style={{ padding: '10px 14px' }}><span className="ocr-key">Name</span><span className="ocr-val" style={{ fontSize: '12px' }}>PRIYA KRISHNAMURTHY</span></div>
                <div className="ocr-field-row" style={{ padding: '10px 14px' }}><span className="ocr-key">DOB</span><span className="ocr-val" style={{ fontSize: '12px' }}>14/08/1997</span></div>
                <div className="ocr-field-row" style={{ padding: '10px 14px' }}><span className="ocr-key">Aadhaar</span><span className="ocr-val" style={{ fontSize: '12px' }}>XXXX XXXX 4821</span></div>
                <div className="ocr-field-row" style={{ padding: '10px 14px' }}><span className="ocr-key">PAN</span><span className="ocr-val" style={{ fontSize: '12px' }}>ABCPK1234D</span></div>
                <div className="ocr-field-row" style={{ padding: '10px 14px', border: 'none' }}><span className="ocr-key">PAN Match</span><span className="badge badge-green">✓ Names Match</span></div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Face Match Score</div>
                <div className="progress-bar-bg" style={{ height: '6px' }}><div className="progress-bar-fill green" style={{ width: '94.2%' }}></div></div>
                <div style={{ fontSize: '12px', color: 'var(--green)', marginTop: '4px', textAlign: 'right' }}>94.2% — Strong Match</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 0, marginBottom: '20px' }}>
            <div style={{ padding: '14px 20px', borderBottom: '0.5px solid var(--border)', fontSize: '13px', fontWeight: 500 }}>Audit Log</div>
            <div className="audit-row"><span style={{ minWidth: '140px', color: 'var(--text3)' }}>Today 10:15</span><span style={{ flex: 1 }}>Account registered &amp; OTP verified</span><span style={{ color: 'var(--green)' }}>OK</span></div>
            <div className="audit-row"><span style={{ minWidth: '140px', color: 'var(--text3)' }}>Today 10:18</span><span style={{ flex: 1 }}>Aadhaar uploaded · quality pass</span><span style={{ color: 'var(--green)' }}>OK</span></div>
            <div className="audit-row"><span style={{ minWidth: '140px', color: 'var(--text3)' }}>Today 10:18</span><span style={{ flex: 1 }}>OCR extraction · 94% confidence</span><span style={{ color: 'var(--green)' }}>OK</span></div>
            <div className="audit-row"><span style={{ minWidth: '140px', color: 'var(--text3)' }}>Today 10:22</span><span style={{ flex: 1 }}>PAN uploaded · name match confirmed</span><span style={{ color: 'var(--green)' }}>OK</span></div>
            <div className="audit-row"><span style={{ minWidth: '140px', color: 'var(--text3)' }}>Today 10:25</span><span style={{ flex: 1 }}>Face verification · 94.2% · 4/4 liveness</span><span style={{ color: 'var(--green)' }}>OK</span></div>
            <div className="audit-row" style={{ border: 'none' }}><span style={{ minWidth: '140px', color: 'var(--text3)' }}>Today 10:25</span><span style={{ flex: 1 }}>Fraud ML score: 18% (LOW)</span><span style={{ color: 'var(--green)' }}>OK</span></div>
          </div>

          <div className="card" style={{ background: 'var(--bg3)' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Admin Notes</div>
            <textarea rows="3" placeholder="Add review notes here..."></textarea>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="btn btn-success btn-full" onClick={() => navigate('/admin/dashboard')}>✓ Approve &amp; Notify User</button>
              <button className="btn btn-danger btn-full">✕ Reject with Reason</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
