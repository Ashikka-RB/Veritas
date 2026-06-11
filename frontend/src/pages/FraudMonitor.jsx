import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function FraudMonitor() {
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

  const handleBlock = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/admin/reject/${id}`, {
        method: 'PUT',
      });
      // Refresh local state
      setQueue((prev) => prev.filter((item) => item._id !== id));
      alert('User successfully blocked/rejected.');
    } catch (err) {
      console.error(err);
    }
  };

  const highRiskUsers = queue.filter((u) => u.rejectedProbability > 70);
  const mediumRiskUsers = queue.filter((u) => u.rejectedProbability >= 30 && u.rejectedProbability <= 70);

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
            <div>
              <span className="badge badge-red" style={{ fontSize: '12px', padding: '6px 14px' }}>
                <i className="ti ti-alert-triangle"></i> {highRiskUsers.length} High Risk Users
              </span>
            </div>
          </div>

          <div className="stat-grid">
            <div className="stat-card" style={{ borderColor: 'rgba(226,75,74,0.2)' }}>
              <div className="stat-label">High Risk (&gt;70%)</div>
              <div className="stat-value" style={{ color: 'var(--red)' }}>{highRiskUsers.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Medium Risk</div>
              <div className="stat-value" style={{ color: 'var(--amber)' }}>{mediumRiskUsers.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Low Risk</div>
              <div className="stat-value" style={{ color: 'var(--green)' }}>
                {queue.filter((u) => u.rejectedProbability < 30).length}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total in Queue</div>
              <div className="stat-value">{queue.length}</div>
            </div>
          </div>

          {/* High Risk Section */}
          <div className="card" style={{ marginBottom: '20px', borderColor: 'rgba(226,75,74,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--red)' }}>
                <i className="ti ti-alert-triangle"></i> High Risk Users
              </div>
              <span className="badge badge-red">Immediate Review</span>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text3)' }}>Loading alerts...</div>
            ) : highRiskUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text3)', fontSize: '13px' }}>
                No immediate high risk fraud alerts.
              </div>
            ) : (
              highRiskUsers.map((user) => (
                <div className="fraud-row" key={user._id}>
                  <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/admin/verify-user/${user._id}`)}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                      {user.userId?.fullName || 'Guest User'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                      Face match: {user.faceMatchScore}% · OCR: {user.ocrConfidence}% · Status: {user.finalStatus}
                    </div>
                  </div>
                  <div className="fraud-score-bar">
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${user.rejectedProbability}%`, background: 'var(--red)' }}></div>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--red)', marginTop: '3px', textAlign: 'right' }}>
                      {user.rejectedProbability}% FRAUD
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-outline"
                      style={{ fontSize: '11px', padding: '6px 14px' }}
                      onClick={() => navigate(`/admin/verify-user/${user._id}`)}
                    >
                      Review
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ fontSize: '11px', padding: '6px 14px' }}
                      onClick={() => handleBlock(user._id)}
                    >
                      Block
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Medium Risk Section */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '16px', color: 'var(--amber)' }}>
              Medium Risk — Monitor
            </div>
            <div className="table-wrap" style={{ border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Fraud Score</th>
                    <th>Face Score</th>
                    <th>Issue</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '16px', color: 'var(--text3)' }}>
                        Loading...
                      </td>
                    </tr>
                  ) : mediumRiskUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '16px', color: 'var(--text3)' }}>
                        No medium risk users under monitoring.
                      </td>
                    </tr>
                  ) : (
                    mediumRiskUsers.map((user) => (
                      <tr key={user._id}>
                        <td style={{ color: 'var(--text)' }}>
                          {user.userId?.fullName || 'Guest User'}
                        </td>
                        <td>
                          <span className="badge badge-amber">{user.rejectedProbability}%</span>
                        </td>
                        <td>{user.faceMatchScore}%</td>
                        <td style={{ color: 'var(--text2)', fontSize: '12px' }}>
                          {user.faceMatchScore < 70 ? 'Low face match score' : 'Review required'}
                        </td>
                        <td>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '4px 12px', fontSize: '11px' }}
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
    </div>
  );
}
