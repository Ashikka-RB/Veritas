import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function FraudMonitor() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="p-fraud">
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          <div className="admin-topbar">
            <div>
              <div style={{ fontSize: '11px', color: 'var(--red)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>⚠ Security Alert</div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 400 }}>Fraud Monitoring</h1>
            </div>
            <div><span className="badge badge-red" style={{ fontSize: '12px', padding: '6px 14px' }}><i className="ti ti-alert-triangle"></i> 2 High Risk Users</span></div>
          </div>

          <div className="stat-grid">
            <div className="stat-card" style={{ borderColor: 'rgba(226,75,74,0.2)' }}><div className="stat-label">High Risk (&gt;70%)</div><div className="stat-value" style={{ color: 'var(--red)' }}>2</div></div>
            <div className="stat-card"><div className="stat-label">Medium Risk</div><div className="stat-value" style={{ color: 'var(--amber)' }}>8</div></div>
            <div className="stat-card"><div className="stat-label">Repeated Failures</div><div className="stat-value" style={{ color: 'var(--amber)' }}>4</div></div>
            <div className="stat-card"><div className="stat-label">Blocked Accounts</div><div className="stat-value">3</div></div>
          </div>

          <div className="card" style={{ marginBottom: '20px', borderColor: 'rgba(226,75,74,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--red)' }}><i className="ti ti-alert-triangle"></i> High Risk Users</div>
              <span className="badge badge-red">Immediate Review</span>
            </div>
            <div className="fraud-row">
              <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 500 }}>Vikram Nair</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Face match: 41.2% · PAN mismatch · 3 failed attempts</div></div>
              <div className="fraud-score-bar"><div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '82%', background: 'var(--red)' }}></div></div><div style={{ fontSize: '10px', color: 'var(--red)', marginTop: '3px', textAlign: 'right' }}>82% FRAUD</div></div>
              <button className="btn btn-danger" style={{ fontSize: '11px', padding: '6px 14px' }}>Block</button>
            </div>
            <div className="fraud-row" style={{ border: 'none' }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 500 }}>Unknown User #048</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Liveness failed · Fake Aadhaar detected · IP flagged</div></div>
              <div className="fraud-score-bar"><div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '91%', background: 'var(--red)' }}></div></div><div style={{ fontSize: '10px', color: 'var(--red)', marginTop: '3px', textAlign: 'right' }}>91% FRAUD</div></div>
              <button className="btn btn-danger" style={{ fontSize: '11px', padding: '6px 14px' }}>Block</button>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '16px', color: 'var(--amber)' }}>Medium Risk — Monitor</div>
            <div className="table-wrap" style={{ border: 'none' }}>
              <table>
                <thead><tr><th>User</th><th>Fraud Score</th><th>Failure Count</th><th>Issue</th><th>Action</th></tr></thead>
                <tbody>
                  <tr><td style={{ color: 'var(--text)' }}>Rahul Sharma</td><td><span className="badge badge-amber">54%</span></td><td>2</td><td style={{ color: 'var(--text2)', fontSize: '12px' }}>Low face score</td><td><button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '11px' }} onClick={() => navigate('/admin/verify-user')}>Review</button></td></tr>
                  <tr><td style={{ color: 'var(--text)' }}>Deepak Verma</td><td><span className="badge badge-amber">61%</span></td><td>1</td><td style={{ color: 'var(--text2)', fontSize: '12px' }}>Name partial match</td><td><button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '11px' }} onClick={() => navigate('/admin/verify-user')}>Review</button></td></tr>
                  <tr><td style={{ color: 'var(--text)' }}>Meena Suresh</td><td><span className="badge badge-amber">48%</span></td><td>3</td><td style={{ color: 'var(--text2)', fontSize: '12px' }}>Multiple retries</td><td><button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '11px' }} onClick={() => navigate('/admin/verify-user')}>Review</button></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '16px' }}>Repeated Failure Accounts</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div className="log-item"><div className="log-dot" style={{ background: 'var(--red)' }}></div><div style={{ flex: 1 }}><div style={{ fontSize: '12px', color: 'var(--text)' }}>IP 122.45.xxx.xxx — 5 failed face attempts</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Auto-locked 48 hours · Mumbai</div></div></div>
              <div className="log-item"><div className="log-dot" style={{ background: 'var(--amber)' }}></div><div style={{ flex: 1 }}><div style={{ fontSize: '12px', color: 'var(--text)' }}>rahul.s@gmail.com — 3 failed logins</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Account locked 30 min · Delhi</div></div></div>
              <div className="log-item" style={{ border: 'none' }}><div className="log-dot" style={{ background: 'var(--amber)' }}></div><div style={{ flex: 1 }}><div style={{ fontSize: '12px', color: 'var(--text)' }}>IP 103.78.xxx.xxx — Multiple OTP retries</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>OTP block triggered · Bangalore</div></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
