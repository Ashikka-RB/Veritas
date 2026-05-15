import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function StartVerification() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="p-start">
      <Navbar type="back" backTo="/dashboard" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        <div className="page-header" style={{ textAlign: 'center' }}>
          <div className="eyebrow">Identity Verification</div>
          <h1>Begin your KYC</h1>
          <p>Complete in 4 simple steps. Estimated time: 5–10 minutes.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gold-dim)', border: '0.5px solid rgba(200,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--display)', fontSize: '18px', color: 'var(--gold)' }}>1</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>Upload Aadhaar Card</div><div style={{ fontSize: '13px', color: 'var(--text2)' }}>Front side of your Aadhaar card. Must be clear and unedited.</div></div>
            <span className="badge badge-gold">Ready</span>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg3)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--display)', fontSize: '18px', color: 'var(--text3)' }}>2</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>Review OCR Details</div><div style={{ fontSize: '13px', color: 'var(--text2)' }}>Verify auto-extracted information and correct if needed.</div></div>
            <span className="badge badge-gray">Step 2</span>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg3)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--display)', fontSize: '18px', color: 'var(--text3)' }}>3</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>Upload PAN Card</div><div style={{ fontSize: '13px', color: 'var(--text2)' }}>PAN number and name will be cross-verified against Aadhaar.</div></div>
            <span className="badge badge-gray">Step 3</span>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg3)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--display)', fontSize: '18px', color: 'var(--text3)' }}>4</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>Live Face Verification</div><div style={{ fontSize: '13px', color: 'var(--text2)' }}>Liveness detection + face match against Aadhaar photo.</div></div>
            <span className="badge badge-gray">Step 4</span>
          </div>
        </div>
        <div className="card" style={{ background: 'var(--bg3)', marginBottom: '32px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}><i className="ti ti-info-circle" style={{ color: 'var(--gold)' }}></i> Documents needed</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: 'var(--text2)' }}>
            <div>• Original Aadhaar card (not laminated)</div><div>• PAN card (clear, unobstructed)</div>
            <div>• Good lighting for face scan</div><div>• Stable internet connection</div>
          </div>
        </div>
        <button className="btn btn-gold btn-full btn-lg" onClick={() => navigate('/verify/aadhaar')}>Begin Verification <i className="ti ti-arrow-right"></i></button>
      </div>
    </div>
  );
}
