import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Notifications() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="p-notifications">
      <Navbar type="user" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        <div className="page-header">
          <div className="eyebrow">Alerts &amp; Updates</div>
          <h1>Notifications</h1>
        </div>
        <div className="card">
          <div className="notif-item">
            <div className="notif-icon" style={{ background: 'var(--green-dim)', color: 'var(--green)', fontSize: '16px' }}><i className="ti ti-check"></i></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 500 }}>OCR Extraction Completed</div><div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>Your Aadhaar details were successfully extracted with 94% confidence.</div><div className="notif-time">Today, 10:18 AM</div></div>
            <span className="badge badge-green">Success</span>
          </div>
          <div className="notif-item">
            <div className="notif-icon" style={{ background: 'var(--green-dim)', color: 'var(--green)', fontSize: '16px' }}><i className="ti ti-face-id"></i></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 500 }}>Face Verification Passed</div><div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>94.2% match score. Liveness check: all 4 prompts passed.</div><div className="notif-time">Today, 10:25 AM</div></div>
            <span className="badge badge-green">Passed</span>
          </div>
          <div className="notif-item">
            <div className="notif-icon" style={{ background: 'var(--amber-dim)', color: 'var(--amber)', fontSize: '16px' }}><i className="ti ti-clock"></i></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 500 }}>Submitted for Admin Review</div><div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>Your KYC is in the admin review queue. Estimated 5–10 minutes.</div><div className="notif-time">Today, 10:26 AM</div></div>
            <span className="badge badge-amber">Pending</span>
          </div>
          <div className="notif-item">
            <div className="notif-icon" style={{ background: 'var(--red-dim)', color: 'var(--red)', fontSize: '16px' }}><i className="ti ti-alert-triangle"></i></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 500 }}>Login from new device</div><div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>IP: 49.200.xxx.xxx · Chrome on Windows · Chennai, India</div><div className="notif-time">Today, 10:14 AM</div></div>
            <span className="badge badge-amber">Alert</span>
          </div>
          <div className="notif-item" style={{ border: 'none' }}>
            <div className="notif-icon" style={{ background: 'var(--blue-dim)', color: 'var(--blue)', fontSize: '16px' }}><i className="ti ti-shield-check"></i></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 500 }}>Fraud Score: 18% (Low Risk)</div><div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>ML fraud analysis complete. Your submission looks legitimate.</div><div className="notif-time">Today, 10:25 AM</div></div>
            <span className="badge badge-green">Low Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
