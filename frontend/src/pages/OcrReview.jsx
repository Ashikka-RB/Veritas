import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function OcrReview() {
  const navigate = useNavigate();
  const ocrData = JSON.parse(
  localStorage.getItem("ocrData")
);

console.log(ocrData);

  return (
    <div className="page active" id="p-ocr">
      <Navbar type="step" stepText="Step 1b of 4" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        <div className="page-header">
          <div className="eyebrow">OCR Extraction</div>
          <h1>Review auto-filled details</h1>
          <p>AI extracted this from your Aadhaar. Verify and edit if needed.</p>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gold)' }}><i className="ti ti-sparkles"></i> AI-Extracted Data</span>
            <span className="badge badge-green">{ocrData?.ocrConfidence ? `${ocrData.ocrConfidence}% confidence` : 'OCR Completed'}</span>
          </div>
          <div style={{ background: 'var(--bg3)', borderRadius: 'var(--r)', overflow: 'hidden', marginBottom: '16px' }}>
            <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">Name</span><span className="ocr-val">{ocrData?.name || "Not Found"}</span></div>
            <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">Date of Birth</span><span className="ocr-val">{ocrData?.dob || "Not Found"}</span></div>
            <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">Aadhaar No.</span><span className="ocr-val">{ocrData?.aadhaarNumber || "Not Found"}</span></div>
            <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">Gender</span><span className="ocr-val">{ocrData?.gender || "Not Found"}</span></div>
            <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">Address</span><span className="ocr-val" style={{ textAlign: 'right', fontSize: '11px', lineHeight: 1.5 }}>{ocrData?.address || "Not Found"}</span></div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '16px' }}>Edit &amp; Confirm Fields</div>
          <div className="form-group"><label>Full Name</label><input type="text" defaultValue={ocrData?.name} /></div>
          <div className="form-row">
            <div className="form-group"><label>Date of Birth</label><input type="text" defaultValue={ocrData?.dob} /></div>
            <div className="form-group"><label>Gender</label><select defaultValue={ocrData?.gender}><option value="FEMALE">Female</option><option value="MALE">Male</option><option value="OTHER"> Other</option></select></div></div>
          <div className="form-group"><label>Aadhaar Number (Last 4 visible)</label><input type="text" defaultValue={ocrData?.aadhaarNumber} /></div>
          <div className="form-group"><label>Address</label><textarea rows="2" defaultValue={ocrData?.address || ""}></textarea></div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={() => navigate('/verify/aadhaar')}>← Re-upload</button>
          <button className="btn btn-gold" style={{ flex: 1 }} onClick={() => navigate('/verify/pan')}>Confirm &amp; Continue →</button>
        </div>
      </div>
    </div>
  );
}
