import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Processing() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="p-processing">
      <Navbar type="processing" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px', textAlign: 'center' }}>
        <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="eyebrow">AI Analysis</div>
          <h1>Analysing your identity</h1>
          <p>Our ML models are running fraud detection and verification checks.</p>
        </div>

        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gold-dim)', border: '1.5px solid rgba(200,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', animation: 'spin 3s linear infinite' }}>
          <i className="ti ti-brain" style={{ fontSize: '28px', color: 'var(--gold)' }}></i>
        </div>

        <div className="processing-grid" style={{ textAlign: 'left', marginBottom: '32px' }}>
          <div className="ai-step">
            <div className="ai-step-icon" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}><i className="ti ti-check"></i></div>
            <div><div style={{ fontSize: '13px', fontWeight: 500 }}>OCR Data Verified</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>94% confidence · Complete</div></div>
          </div>
          <div className="ai-step">
            <div className="ai-step-icon" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}><i className="ti ti-check"></i></div>
            <div><div style={{ fontSize: '13px', fontWeight: 500 }}>PAN-Aadhaar Match</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Names verified · Complete</div></div>
          </div>
          <div className="ai-step">
            <div className="ai-step-icon" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}><i className="ti ti-check"></i></div>
            <div><div style={{ fontSize: '13px', fontWeight: 500 }}>Face Match Score</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>94.2% confidence · Complete</div></div>
          </div>
          <div className="ai-step">
            <div className="ai-step-icon" style={{ background: 'var(--gold-dim)', color: 'var(--gold)' }}><i className="ti ti-loader spin"></i></div>
            <div><div style={{ fontSize: '13px', fontWeight: 500 }}>Fraud ML Analysis</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Running scikit-learn model...</div></div>
          </div>
          <div className="ai-step" style={{ opacity: 0.4 }}>
            <div className="ai-step-icon" style={{ background: 'var(--bg4)', color: 'var(--text4)' }}><i className="ti ti-clock"></i></div>
            <div><div style={{ fontSize: '13px', fontWeight: 500 }}>Risk Scoring</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Pending...</div></div>
          </div>
          <div className="ai-step" style={{ opacity: 0.4 }}>
            <div className="ai-step-icon" style={{ background: 'var(--bg4)', color: 'var(--text4)' }}><i className="ti ti-clock"></i></div>
            <div><div style={{ fontSize: '13px', fontWeight: 500 }}>Submit to Admin Queue</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Pending...</div></div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px', textAlign: 'left' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Overall Progress</div>
          <div className="progress-bar-bg" style={{ height: '6px' }}><div className="progress-bar-fill" style={{ width: '60%' }}></div></div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '8px' }}>Running fraud analysis...</div>
        </div>

        <button className="btn btn-gold btn-lg" onClick={() => navigate('/verify/status')} style={{ marginTop: '8px' }}>View Verification Status →</button>
      </div>
    </div>
  );
}
