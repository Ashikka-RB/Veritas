import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="p-landing">
      <Navbar type="public" />

      <div className="hero-wrap pt-nav container">
        <div className="hero-glow"></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', padding: '60px 0 40px' }}>
          <div className="hero-eyebrow"><i className="ti ti-shield-lock"></i> AI-Powered Identity Verification</div>
          <h1 className="hero-title">Banking-grade<br/><em>eKYC</em> for the<br/>modern era</h1>
          <p className="hero-sub">Automated Aadhaar &amp; PAN verification, live face matching, ML fraud detection — complete digital onboarding in under 5 minutes.</p>
          <div className="hero-actions">
            <button className="btn btn-gold btn-lg" onClick={() => navigate('/register')}>Start Verification <i className="ti ti-arrow-right"></i></button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/admin/login')}>Admin Portal</button>
          </div>
          <div style={{ display: 'flex', gap: '32px', marginTop: '48px' }}>
            <div><div style={{ fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--gold)' }}>99.2%</div><div style={{ fontSize: '12px', color: 'var(--text3)' }}>OCR Accuracy</div></div>
            <div style={{ width: '0.5px', background: 'var(--border)' }}></div>
            <div><div style={{ fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--gold)' }}>&lt;5min</div><div style={{ fontSize: '12px', color: 'var(--text3)' }}>Avg. Verification</div></div>
            <div style={{ width: '0.5px', background: 'var(--border)' }}></div>
            <div><div style={{ fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--gold)' }}>0.1%</div><div style={{ fontSize: '12px', color: 'var(--text3)' }}>False Positive Rate</div></div>
          </div>
        </div>
      </div>

      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="hero-eyebrow" style={{ justifyContent: 'center' }}>Platform Features</div>
          <h2 className="section-title">Everything you need for<br/>compliant onboarding</h2>
        </div>
        <div className="features-grid">
          <div className="feat-card"><i className="ti ti-scan feat-icon"></i><div className="feat-title">Smart OCR Extraction</div><div className="feat-desc">Tesseract-powered OCR auto-fills KYC forms from Aadhaar and PAN cards with 99%+ accuracy.</div></div>
          <div className="feat-card"><i className="ti ti-face-id feat-icon"></i><div className="feat-title">Liveness Detection</div><div className="feat-desc">Real-time face verification with blink and head-movement liveness checks to prevent spoofing.</div></div>
          <div className="feat-card"><i className="ti ti-brain feat-icon"></i><div className="feat-title">ML Fraud Analysis</div><div className="feat-desc">Scikit-learn models generate fraud scores based on face match confidence, OCR certainty, and behavioral signals.</div></div>
          <div className="feat-card"><i className="ti ti-cloud-upload feat-icon"></i><div className="feat-title">Cloud Storage</div><div className="feat-desc">All documents and face captures stored securely on Cloudinary with encrypted access controls.</div></div>
          <div className="feat-card"><i className="ti ti-report-analytics feat-icon"></i><div className="feat-title">Admin Workflow</div><div className="feat-desc">Enterprise-grade admin dashboard for human-in-the-loop review, approval, and audit trail management.</div></div>
          <div className="feat-card"><i className="ti ti-bell feat-icon"></i><div className="feat-title">Real-Time Alerts</div><div className="feat-desc">SendGrid-powered email notifications for OTPs, verification status, fraud alerts, and lock warnings.</div></div>
        </div>
      </div>

      <div className="security-strip">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}><h2 className="section-title">Built on enterprise security</h2></div>
          <div className="security-items">
            <div className="sec-item"><i className="ti ti-lock sec-icon"></i><div className="sec-title">JWT Auth</div><div className="sec-desc">Session-based token security with auto-expiry</div></div>
            <div className="sec-item"><i className="ti ti-key sec-icon"></i><div className="sec-title">Bcrypt Hashing</div><div className="sec-desc">Industry-standard password encryption</div></div>
            <div className="sec-item"><i className="ti ti-shield-check sec-icon"></i><div className="sec-title">Account Locking</div><div className="sec-desc">Auto-lock after 3 failed attempts for 30 min</div></div>
            <div className="sec-item"><i className="ti ti-clipboard-list sec-icon"></i><div className="sec-title">Audit Logs</div><div className="sec-desc">Complete IP, device, and activity logging</div></div>
          </div>
        </div>
      </div>

      <div className="cta-strip container">
        <div className="hero-eyebrow" style={{ justifyContent: 'center' }}>Get Started Today</div>
        <h2 className="section-title" style={{ marginBottom: '20px' }}>Ready to onboard smarter?</h2>
        <p className="section-sub" style={{ maxWidth: '400px', margin: '0 auto 32px' }}>Join thousands of customers verified securely through Veritas eKYC.</p>
        <button className="btn btn-gold btn-lg" onClick={() => navigate('/register')}>Create Your Account <i className="ti ti-arrow-right"></i></button>
      </div>
    </div>
  );
}
