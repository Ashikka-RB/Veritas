import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/admin/review-queue')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch review queue');
        }
        return res.json();
      })
      .then((data) => {
        setQueue(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const submitted = new Date(dateString);
    const diffMs = now - submitted;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    return submitted.toLocaleDateString();
  };

  const getFaceMatchColor = (score) => {
    if (score >= 80) return 'var(--green)';
    if (score >= 60) return 'var(--amber)';
    return 'var(--red)';
  };

  const getFraudBadgeClass = (score) => {
    if (score < 30) return 'badge badge-green';
    if (score <= 70) return 'badge badge-amber';
    return 'badge badge-red';
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'APPROVED') return 'badge badge-green';
    if (status === 'REJECTED' || status === 'FLAGGED') return 'badge badge-red';
    return 'badge badge-amber'; // PENDING
  };

  const reviewFirstPending = () => {
    if (queue && queue.length > 0) {
      navigate(`/admin/verify-user/${queue[0]._id}`);
    } else {
      alert("No pending reviews in the queue.");
    }
  };

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
              <span className="badge badge-red"><i className="ti ti-alert-triangle"></i> {queue.filter(q => q.rejectedProbability > 70).length} Fraud Alerts</span>
              <button className="btn btn-outline btn-gold" onClick={reviewFirstPending}>
                Review Queue ({loading ? '...' : queue.length})
              </button>
            </div>
          </div>

          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-label">Total Users</div>
              <div className="stat-value">1,248</div>
              <div className="stat-delta" style={{ color: 'var(--green)' }}>+12 today</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Pending Reviews</div>
              <div className="stat-value" style={{ color: 'var(--amber)' }}>
                {loading ? '...' : queue.length}
              </div>
              <div className="stat-delta" style={{ color: 'var(--text3)' }}>Avg. 4 min wait</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Fraud Alerts</div>
              <div className="stat-value" style={{ color: 'var(--red)' }}>
                {loading ? '...' : queue.filter(q => q.rejectedProbability > 70).length}
              </div>
              <div className="stat-delta" style={{ color: 'var(--red)' }}>High priority</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Locked Accounts</div>
              <div className="stat-value" style={{ color: 'var(--amber)' }}>3</div>
              <div className="stat-delta" style={{ color: 'var(--text3)' }}>Auto-unlock pending</div>
            </div>
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
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--green)' }}>Low Risk (&lt;30%)</span>
                    <span style={{ color: 'var(--text2)' }}>
                      {loading ? '...' : `${queue.length ? Math.round((queue.filter(q => q.rejectedProbability < 30).length / queue.length) * 100) : 0}%`}
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill green" style={{ width: queue.length ? `${(queue.filter(q => q.rejectedProbability < 30).length / queue.length) * 100}%` : '0%' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--amber)' }}>Medium Risk (30–70%)</span>
                    <span style={{ color: 'var(--text2)' }}>
                      {loading ? '...' : `${queue.length ? Math.round((queue.filter(q => q.rejectedProbability >= 30 && q.rejectedProbability <= 70).length / queue.length) * 100) : 0}%`}
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: queue.length ? `${(queue.filter(q => q.rejectedProbability >= 30 && q.rejectedProbability <= 70).length / queue.length) * 100}%` : '0%', background: 'var(--amber)' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--red)' }}>High Risk (&gt;70%)</span>
                    <span style={{ color: 'var(--text2)' }}>
                      {loading ? '...' : `${queue.length ? Math.round((queue.filter(q => q.rejectedProbability > 70).length / queue.length) * 100) : 0}%`}
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: queue.length ? `${(queue.filter(q => q.rejectedProbability > 70).length / queue.length) * 100}%` : '0%', background: 'var(--red)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Submitted</th>
                  <th>Face Match</th>
                  <th>Fraud Score</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)' }}>
                      Loading review queue...
                    </td>
                  </tr>
                ) : queue.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)' }}>
                      No pending reviews in queue
                    </td>
                  </tr>
                ) : (
                  queue.map((user) => (
                    <tr key={user._id}>
                      <td style={{ color: 'var(--text)' }}>
                        {user.fullName || 'Guest User'}
                      </td>
                      <td>{formatTimeAgo(user.submittedAt)}</td>
                      <td style={{ color: getFaceMatchColor(user.faceMatchScore) }}>
                        {user.faceMatchScore ? `${user.faceMatchScore}%` : '—'}
                      </td>
                      <td>
                        <span className={getFraudBadgeClass(user.rejectedProbability)}>
                          {user.rejectedProbability}%
                        </span>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(user.adminDecision)}>
                          {user.adminDecision || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '5px 12px', fontSize: '11px' }}
                          onClick={() => navigate(`/admin/verify-user/${user._id}`)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
