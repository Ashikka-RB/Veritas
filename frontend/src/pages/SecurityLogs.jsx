import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function SecurityLogs() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="p-security">
      <Navbar type="user" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        <div className="page-header">
          <div className="eyebrow">Security &amp; Audit</div>
          <h1>Security Logs</h1>
          <p>Your login history, device access, and activity audit trail.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '24px' }}>
          <div className="card card-sm"><div className="stat-label">Total Logins</div><div style={{ fontSize: '20px', fontWeight: 400, fontFamily: 'var(--display)' }}>7</div></div>
          <div className="card card-sm"><div className="stat-label">Failed Attempts</div><div style={{ fontSize: '20px', fontWeight: 400, fontFamily: 'var(--display)', color: 'var(--amber)' }}>1</div></div>
          <div className="card card-sm"><div className="stat-label">Devices</div><div style={{ fontSize: '20px', fontWeight: 400, fontFamily: 'var(--display)' }}>2</div></div>
        </div>
        <div className="card" style={{ marginBottom: '16px', padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--border)', fontSize: '13px', fontWeight: 500 }}>Login Activity</div>
          <div style={{ background: 'var(--bg1)', overflow: 'hidden' }}>
            <div className="audit-row" style={{ color: 'var(--text3)', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px', paddingTop: '12px', paddingBottom: '12px' }}>
              <span style={{ minWidth: '140px' }}>Timestamp</span><span style={{ flex: 1 }}>Event</span><span style={{ minWidth: '80px' }}>Status</span><span>IP Address</span>
            </div>
            <div className="audit-row"><span style={{ minWidth: '140px', color: 'var(--text3)' }}>Today 10:14</span><span style={{ flex: 1, color: 'var(--text)' }}>LOGIN SUCCESS · Chrome · Windows · Chennai</span><span style={{ minWidth: '80px', color: 'var(--green)' }}>SUCCESS</span><span>49.200.x.x</span></div>
            <div className="audit-row"><span style={{ minWidth: '140px', color: 'var(--text3)' }}>Today 09:42</span><span style={{ flex: 1, color: 'var(--text)' }}>LOGIN FAILED · Wrong password</span><span style={{ minWidth: '80px', color: 'var(--red)' }}>FAILED</span><span>49.200.x.x</span></div>
            <div className="audit-row"><span style={{ minWidth: '140px', color: 'var(--text3)' }}>Yesterday 18:30</span><span style={{ flex: 1, color: 'var(--text)' }}>LOGIN SUCCESS · Safari · iPhone · Chennai</span><span style={{ minWidth: '80px', color: 'var(--green)' }}>SUCCESS</span><span>157.32.x.x</span></div>
            <div className="audit-row"><span style={{ minWidth: '140px', color: 'var(--text3)' }}>Yesterday 14:10</span><span style={{ flex: 1, color: 'var(--text)' }}>OTP VERIFIED · Registration</span><span style={{ minWidth: '80px', color: 'var(--green)' }}>SUCCESS</span><span>49.200.x.x</span></div>
            <div className="audit-row" style={{ border: 'none' }}><span style={{ minWidth: '140px', color: 'var(--text3)' }}>2 days ago 11:00</span><span style={{ flex: 1, color: 'var(--text)' }}>ACCOUNT CREATED</span><span style={{ minWidth: '80px', color: 'var(--blue)' }}>CREATED</span><span>49.200.x.x</span></div>
          </div>
        </div>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--border)', fontSize: '13px', fontWeight: 500 }}>Registered Devices</div>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '0.5px solid var(--border)' }}>
            <i className="ti ti-device-laptop" style={{ fontSize: '20px', color: 'var(--gold)' }}></i>
            <div style={{ flex: 1 }}><div style={{ fontSize: '13px' }}>Chrome on Windows</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Last seen: Today 10:14 AM · 49.200.xxx.xxx</div></div>
            <span className="badge badge-green">Active</span>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="ti ti-device-mobile" style={{ fontSize: '20px', color: 'var(--text3)' }}></i>
            <div style={{ flex: 1 }}><div style={{ fontSize: '13px' }}>Safari on iPhone</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Last seen: Yesterday 6:30 PM · 157.32.xxx.xxx</div></div>
            <span className="badge badge-gray">Known</span>
          </div>
        </div>
      </div>
    </div>
  );
}
