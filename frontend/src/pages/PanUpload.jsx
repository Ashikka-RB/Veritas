import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PanUpload() {
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState(false);

  const simulatePAN = () => {
    setUploaded(true);
  };

  return (
    <div className="page active" id="p-pan">
      <Navbar type="step" stepText="Step 2 of 4" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        <div className="page-header">
          <div className="eyebrow">Document Upload</div>
          <h1>Upload PAN Card</h1>
          <p>PAN name will be cross-verified against your Aadhaar name.</p>
        </div>
        <div className="card" style={{ marginBottom: '16px', background: 'var(--bg3)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Aadhaar Name (Reference)</div>
          <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--gold)', fontFamily: 'var(--mono)' }}>PRIYA KRISHNAMURTHY</div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>PAN name must match this exactly</div>
        </div>

        <div className="upload-zone" onClick={simulatePAN} style={uploaded ? { borderColor: 'rgba(200,169,110,0.4)', background: 'var(--bg2)' } : {}}>
          <i className="ti ti-credit-card"></i>
          <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '4px' }}>{uploaded ? 'Uploaded successfully' : 'Upload PAN card image'}</div>
          <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{uploaded ? 'pan_card.jpg' : 'JPG, PNG · Max 3 MB'}</div>
        </div>

        {uploaded && (
          <div id="pan-result" style={{ marginTop: '16px' }}>
            <div className="card" style={{ background: 'var(--bg3)' }}>
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px', color: 'var(--gold)' }}><i className="ti ti-sparkles"></i> PAN Extracted</div>
              <div style={{ background: 'var(--bg2)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">PAN Number</span><span className="ocr-val">ABCPK1234D</span></div>
                <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">PAN Name</span><span className="ocr-val">PRIYA KRISHNAMURTHY</span></div>
                <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">Name Match</span><span className="badge badge-green">✓ Names Match</span></div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button className="btn btn-outline" onClick={() => navigate('/verify/ocr')}>← Back</button>
          <button className="btn btn-gold" style={{ flex: 1, opacity: uploaded ? 1 : 0.5 }} disabled={!uploaded} onClick={() => navigate('/verify/face')}>Proceed to Face Verify →</button>
        </div>
      </div>
    </div>
  );
}
