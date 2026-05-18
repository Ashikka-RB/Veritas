import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function OcrReview() {
  const navigate = useNavigate();

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
            <span className="badge badge-green">94% confidence</span>
          </div>
          <div style={{ background: 'var(--bg3)', borderRadius: 'var(--r)', overflow: 'hidden', marginBottom: '16px' }}>
            <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">Name</span><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="ocr-val">PRIYA KRISHNAMURTHY</span><span className="confidence-pill badge-green" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>98%</span></div></div>
            <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">Date of Birth</span><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="ocr-val">14/08/1997</span><span className="confidence-pill badge-green" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>96%</span></div></div>
            <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">Aadhaar No.</span><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="ocr-val">XXXX XXXX 4821</span><span className="confidence-pill badge-gold" style={{ background: 'var(--gold-dim)', color: 'var(--gold)' }}>89%</span></div></div>
            <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">Gender</span><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="ocr-val">FEMALE</span><span className="confidence-pill badge-green" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}>99%</span></div></div>
            <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">Address</span><div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '280px' }}><span className="ocr-val" style={{ textAlign: 'right', fontSize: '11px', lineHeight: 1.5 }}>14, Velachery Main Rd, Chennai, TN 600042</span><span className="confidence-pill badge-amber" style={{ background: 'var(--amber-dim)', color: 'var(--amber)' }}>81%</span></div></div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '16px' }}>Edit &amp; Confirm Fields</div>
          <div className="form-group"><label>Full Name</label><input type="text" defaultValue="Priya Krishnamurthy" /></div>
          <div className="form-row">
            <div className="form-group"><label>Date of Birth</label><input type="text" defaultValue="14/08/1997" /></div>
            <div className="form-group"><label>Gender</label><select><option>Female</option><option>Male</option><option>Other</option></select></div>
          </div>
          <div className="form-group"><label>Aadhaar Number (Last 4 visible)</label><input type="text" defaultValue="XXXX XXXX 4821" /></div>
          <div className="form-group"><label>Address</label><textarea rows="2" defaultValue="14, Velachery Main Rd, Chennai, Tamil Nadu 600042"></textarea></div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={() => navigate('/verify/aadhaar')}>← Re-upload</button>
          <button className="btn btn-gold" style={{ flex: 1 }} onClick={() => navigate('/verify/pan')}>Confirm &amp; Continue →</button>
        </div>
      </div>
    </div>
  );
}
