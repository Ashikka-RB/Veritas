import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function FaceVerification() {
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 4
  const [done, setDone] = useState(false);

  const runLiveness = () => {
    if (running || done) return;
    setRunning(true);
    let i = 0;
    const t = setInterval(() => {
      if (i < 4) {
        setProgress(i + 1);
        i++;
      } else {
        clearInterval(t);
        setDone(true);
        setRunning(false);
      }
    }, 800);
  };

  const getWidth = () => (progress / 4) * 94.2;

  return (
    <div className="page active" id="p-face">
      <Navbar type="step" stepText="Step 3 of 4" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        <div className="page-header" style={{ textAlign: 'center' }}>
          <div className="eyebrow">Live Biometrics</div>
          <h1>Face Verification</h1>
          <p>Position your face in the frame. Keep it still and well-lit.</p>
        </div>

        <div className="face-ring-outer" style={{ margin: '32px auto' }}>
          <div className="face-ring-spin" id="face-spin" style={running ? {} : { animationPlayState: 'paused' }}></div>
          <div className="face-inner"><i className="ti ti-face-id"></i></div>
        </div>

        <div className="card" style={{ marginBottom: '16px', background: 'var(--bg3)', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Liveness Checks</div>
          <div className="liveness-row" id="liveness">
            <div className={`liveness-tag ${progress >= 1 ? 'done' : ''}`}>Blink detected</div>
            <div className={`liveness-tag ${progress >= 2 ? 'done' : ''}`}>Turn head left</div>
            <div className={`liveness-tag ${progress >= 3 ? 'done' : ''}`}>Turn head right</div>
            <div className={`liveness-tag ${progress >= 4 ? 'done' : ''}`}>Smile</div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Face Match Confidence</span>
            <span id="face-score-text" style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--gold)' }}>
              {done ? '94.2%' : '—'}
            </span>
          </div>
          <div className="progress-bar-bg"><div className="progress-bar-fill" id="face-bar" style={{ width: `${getWidth()}%` }}></div></div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '8px' }}>Comparing with Aadhaar card photo</div>
        </div>

        <div style={{ background: 'var(--amber-dim)', border: '0.5px solid rgba(232,160,48,0.2)', borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: 'var(--amber)', marginBottom: '24px' }}>
          <i className="ti ti-alert-triangle"></i> 3 failed attempts will lock verification for 24 hours. Attempts remaining: <strong>3</strong>
        </div>

        {!done ? (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-outline" onClick={() => navigate('/verify/pan')}>← Back</button>
            <button className="btn btn-gold" style={{ flex: 1 }} onClick={runLiveness} disabled={running}>
              {running ? 'Checking Liveness...' : 'Start Liveness Check'} <i className="ti ti-arrow-right"></i>
            </button>
          </div>
        ) : (
          <div id="face-done" style={{ marginTop: '16px' }}>
            <button className="btn btn-gold btn-full btn-lg" onClick={() => navigate('/verify/processing')}>Submit for Fraud Analysis →</button>
          </div>
        )}
      </div>
    </div>
  );
}
