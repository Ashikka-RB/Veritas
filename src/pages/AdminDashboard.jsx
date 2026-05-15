import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="p-admin-dashboard">
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          <div className="admin-topbar">
            <div>
              <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Admin Panel</div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 400 }}>Dashboard</h1>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span className="badge badge-red"><i className="ti ti-alert-triangle"></i> 2 Fraud Alerts</span>
              <button className="btn btn-outline btn-gold" onClick={() => navigate('/admin/verify-user')}>Review Queue (5)</button>
            </div>
          </div>

          <div className="stat-grid">
            <div className="stat-card"><div className="stat-label">Total Users</div><div className="stat-value">1,248</div><div className="stat-delta" style={{ color: 'var(--green)' }}>+12 today</div></div>
            <div className="stat-card"><div className="stat-label">Pending Reviews</div><div className="stat-value" style={{ color: 'var(--amber)' }}>5</div><div className="stat-delta" style={{ color: 'var(--text3)' }}>Avg. 4 min wait</div></div>
            <div className="stat-card"><div className="stat-label">Fraud Alerts</div><div className="stat-value" style={{ color: 'var(--red)' }}>2</div><div className="stat-delta" style={{ color: 'var(--red)' }}>High priority</div></div>
            <div className="stat-card"><div className="stat-label">Locked Accounts</div><div className="stat-value" style={{ color: 'var(--amber)' }}>3</div><div className="stat-delta" style={{ color: 'var(--text3)' }}>Auto-unlock pending</div></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div className="card">
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '12px' }}>Verifications This Week</div>
              <div className="chart-wrap" id="admin-chart">
                <div className="chart-bar" style={{ height: '45%' }}></div>
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '35%' }}></div>
                <div className="chart-bar" style={{ height: '75%' }}></div>
                <div className="chart-bar" style={{ height: '55%' }}></div>
                <div className="chart-bar" style={{ height: '90%' }}></div>
                <div className="chart-bar" style={{ height: '65%' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text3)' }}>
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '12px' }}>Fraud Risk Distribution</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span style={{ color: 'var(--green)' }}>Low Risk (&lt;30%)</span><span style={{ color: 'var(--text2)' }}>82%</span></div><div className="progress-bar-bg"><div className="progress-bar-fill green" style={{ width: '82%' }}></div></div></div>
                <div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span style={{ color: 'var(--amber)' }}>Medium Risk (30–70%)</span><span style={{ color: 'var(--text2)' }}>14%</span></div><div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '14%', background: 'var(--amber)' }}></div></div></div>
                <div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}><span style={{ color: 'var(--red)' }}>High Risk (&gt;70%)</span><span style={{ color: 'var(--text2)' }}>4%</span></div><div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '4%', background: 'var(--red)' }}></div></div></div>
              </div>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>User</th><th>Submitted</th><th>Face Match</th><th>Fraud Score</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                <tr><td style={{ color: 'var(--text)' }}>Priya Krishnamurthy</td><td>2 min ago</td><td style={{ color: 'var(--green)' }}>94.2%</td><td><span className="badge badge-green">18%</span></td><td><span className="badge badge-amber">Pending</span></td><td><button className="btn btn-outline" style={{ padding: '5px 12px', fontSize: '11px' }} onClick={() => navigate('/admin/verify-user')}>Review</button></td></tr>
                <tr><td style={{ color: 'var(--text)' }}>Rahul Sharma</td><td>38 min ago</td><td style={{ color: 'var(--amber)' }}>71.3%</td><td><span className="badge badge-amber">54%</span></td><td><span className="badge badge-amber">Pending</span></td><td><button className="btn btn-outline" style={{ padding: '5px 12px', fontSize: '11px' }} onClick={() => navigate('/admin/verify-user')}>Review</button></td></tr>
                <tr><td style={{ color: 'var(--text)' }}>Ananya Mehta</td><td>1 hr ago</td><td style={{ color: 'var(--green)' }}>97.1%</td><td><span className="badge badge-green">9%</span></td><td><span className="badge badge-green">Approved</span></td><td><button className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: '11px' }}>View</button></td></tr>
                <tr><td style={{ color: 'var(--text)' }}>Vikram Nair</td><td>2 hr ago</td><td style={{ color: 'var(--red)' }}>41.2%</td><td><span className="badge badge-red">82%</span></td><td><span className="badge badge-red">Flagged</span></td><td><button className="btn btn-danger" style={{ padding: '5px 12px', fontSize: '11px' }} onClick={() => navigate('/admin/fraud')}>Investigate</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
