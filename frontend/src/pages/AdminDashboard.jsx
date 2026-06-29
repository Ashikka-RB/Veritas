import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [weeklyVerifications, setWeeklyVerifications] = useState(null);
  const [fraudDistribution, setFraudDistribution] = useState(null);
  const [queue, setQueue] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'Authorization': `Bearer ${token}` };
      const [resMetrics, resWeekly, resFraud, resQueue] = await Promise.all([
        fetch('https://veritas-backend-3nfm.onrender.com/api/admin/analytics/metrics', { headers }),
        fetch('https://veritas-backend-3nfm.onrender.com/api/admin/analytics/weekly-verifications', { headers }),
        fetch('https://veritas-backend-3nfm.onrender.com/api/admin/analytics/fraud-distribution', { headers }),
        fetch('https://veritas-backend-3nfm.onrender.com/api/admin/review-queue', { headers })
      ]);

      if (!resMetrics.ok || !resWeekly.ok || !resFraud.ok || !resQueue.ok) {
        throw new Error('Failed to fetch admin dashboard analytics data.');
      }

      const [dataMetrics, dataWeekly, dataFraud, dataQueue] = await Promise.all([
        resMetrics.json(),
        resWeekly.json(),
        resFraud.json(),
        resQueue.json()
      ]);

      setMetrics(dataMetrics);
      setWeeklyVerifications(dataWeekly);
      setFraudDistribution(dataFraud);
      setQueue(dataQueue);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Poll every 10 seconds for real-time status updates
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this user?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`https://veritas-backend-3nfm.onrender.com/api/admin/approve/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminNotes: 'Approved directly from Admin Dashboard' })
      });
      if (!res.ok) {
        throw new Error('Failed to approve user.');
      }
      alert('User approved successfully.');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Please enter a rejection reason:');
    if (reason === null) return; // Cancelled
    if (!reason.trim()) {
      alert('Rejection reason is required.');
      return;
    }
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`https://veritas-backend-3nfm.onrender.com/api/admin/reject/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminNotes: reason })
      });
      if (!res.ok) {
        throw new Error('Failed to reject user.');
      }
      alert('User rejected successfully.');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFlagFraud = async (id) => {
    const reason = window.prompt('Please enter a reason for flagging fraud:');
    if (reason === null) return; // Cancelled
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`https://veritas-backend-3nfm.onrender.com/api/admin/flag-fraud/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminNotes: reason || 'Flagged as high fraud risk' })
      });
      if (!res.ok) {
        throw new Error('Failed to flag user as fraud.');
      }
      alert('User flagged as fraud and account locked.');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

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

  const getHighestRiskCategory = (u) => {
    const app = u.approvedProbability || 0;
    const rev = u.manualReviewProbability || 0;
    const rej = u.rejectedProbability || 0;

    let max = app;
    let category = "Low Risk";
    let badgeClass = "badge badge-green";

    if (rev > max) {
      max = rev;
      category = "Medium Risk";
      badgeClass = "badge badge-amber";
    }
    if (rej > max) {
      max = rej;
      category = "High Risk";
      badgeClass = "badge badge-red";
    }
    return { category, badgeClass };
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
      alert('No pending reviews in the queue.');
    }
  };

  // Weekly bar chart heights
  const maxWeeklyCount = weeklyVerifications 
    ? Math.max(...Object.values(weeklyVerifications), 1) 
    : 1;

  const getBarHeight = (dayKey) => {
    if (!weeklyVerifications) return '0%';
    const val = weeklyVerifications[dayKey] || 0;
    return `${(val / maxWeeklyCount) * 100}%`;
  };

  return (
    <div className="page active" id="p-admin-dashboard">
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-main">
          
          {/* Header */}
          <div className="admin-topbar">
            <div>
              <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Admin Panel</div>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 400 }}>Dashboard</h1>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button 
                className="btn btn-outline" 
                style={{ padding: '8px 16px', fontSize: '12px' }}
                onClick={() => { setLoading(true); fetchData(); }}
              >
                <i className="ti ti-refresh" style={{ marginRight: '6px' }}></i> Refresh
              </button>

              {/* Fraud Alerts badge - only show red badge when alerts exist */}
              {!loading && metrics && metrics.fraudAlerts > 0 && (
                <span className="badge badge-red" style={{ animation: 'pulse 2s infinite' }}>
                  <i className="ti ti-alert-triangle"></i> {metrics.fraudAlerts} Fraud Alerts
                </span>
              )}

              <button className="btn btn-outline btn-gold" onClick={reviewFirstPending} disabled={loading || queue.length === 0}>
                Review Queue ({loading ? '...' : queue.length})
              </button>
            </div>
          </div>

          {/* Error Callout */}
          {error && (
            <div className="lock-warning" style={{ margin: '0 0 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <i className="ti ti-alert-circle" style={{ marginRight: '8px' }}></i>
                Error: {error}
              </div>
              <button className="btn btn-gold btn-outline" style={{ padding: '4px 12px', fontSize: '11px' }} onClick={() => { setLoading(true); fetchData(); }}>
                Retry
              </button>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="stat-grid">
            {/* Total Users */}
            <div className="stat-card">
              <div className="stat-label">Total Users</div>
              {loading ? (
                <>
                  <div className="skeleton skeleton-title" style={{ margin: '8px 0' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
                </>
              ) : (
                <>
                  <div className="stat-value">{metrics?.totalUsers ?? 0}</div>
                  <div className="stat-delta" style={{ color: 'var(--green)' }}>
                    +{metrics?.newUsersToday ?? 0} today
                  </div>
                </>
              )}
            </div>

            {/* Pending Reviews */}
            <div className="stat-card">
              <div className="stat-label">Pending Reviews</div>
              {loading ? (
                <>
                  <div className="skeleton skeleton-title" style={{ margin: '8px 0' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                </>
              ) : (
                <>
                  <div className="stat-value" style={{ color: 'var(--amber)' }}>
                    {metrics?.pendingReviews ?? 0}
                  </div>
                  <div className="stat-delta" style={{ color: 'var(--text3)' }}>
                    Avg. {metrics?.avgWaitTime ?? 4} min wait
                  </div>
                </>
              )}
            </div>

            {/* Fraud Alerts */}
            <div className="stat-card">
              <div className="stat-label">Fraud Alerts</div>
              {loading ? (
                <>
                  <div className="skeleton skeleton-title" style={{ margin: '8px 0' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                </>
              ) : (
                <>
                  <div className="stat-value" style={{ color: 'var(--red)' }}>
                    {metrics?.fraudAlerts ?? 0}
                  </div>
                  <div className="stat-delta" style={{ color: metrics?.fraudAlerts > 0 ? 'var(--red)' : 'var(--text3)' }}>
                    {metrics?.fraudAlerts > 0 ? 'High priority' : 'No alerts'}
                  </div>
                </>
              )}
            </div>

            {/* Locked Accounts */}
            <div className="stat-card">
              <div className="stat-label">Locked Accounts</div>
              {loading ? (
                <>
                  <div className="skeleton skeleton-title" style={{ margin: '8px 0' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
                </>
              ) : (
                <>
                  <div className="stat-value" style={{ color: 'var(--amber)' }}>
                    {metrics?.lockedAccounts ?? 0}
                  </div>
                  <div className="stat-delta" style={{ color: 'var(--text3)' }}>
                    Suspended status
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            
            {/* Weekly Verifications Chart */}
            <div className="card">
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '12px' }}>Verifications This Week</div>
              {loading ? (
                <div className="chart-wrap" style={{ alignItems: 'stretch' }}>
                  <div className="skeleton-bar skeleton" style={{ height: '100%' }}></div>
                  <div className="skeleton-bar skeleton" style={{ height: '100%' }}></div>
                  <div className="skeleton-bar skeleton" style={{ height: '100%' }}></div>
                  <div className="skeleton-bar skeleton" style={{ height: '100%' }}></div>
                  <div className="skeleton-bar skeleton" style={{ height: '100%' }}></div>
                  <div className="skeleton-bar skeleton" style={{ height: '100%' }}></div>
                  <div className="skeleton-bar skeleton" style={{ height: '100%' }}></div>
                </div>
              ) : (
                <div className="chart-wrap" id="admin-chart">
                  <div className="chart-bar" style={{ height: getBarHeight('mon') }} title={`Mon: ${weeklyVerifications?.mon || 0}`}></div>
                  <div className="chart-bar" style={{ height: getBarHeight('tue') }} title={`Tue: ${weeklyVerifications?.tue || 0}`}></div>
                  <div className="chart-bar" style={{ height: getBarHeight('wed') }} title={`Wed: ${weeklyVerifications?.wed || 0}`}></div>
                  <div className="chart-bar" style={{ height: getBarHeight('thu') }} title={`Thu: ${weeklyVerifications?.thu || 0}`}></div>
                  <div className="chart-bar" style={{ height: getBarHeight('fri') }} title={`Fri: ${weeklyVerifications?.fri || 0}`}></div>
                  <div className="chart-bar" style={{ height: getBarHeight('sat') }} title={`Sat: ${weeklyVerifications?.sat || 0}`}></div>
                  <div className="chart-bar" style={{ height: getBarHeight('sun') }} title={`Sun: ${weeklyVerifications?.sun || 0}`}></div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text3)' }}>
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            {/* Fraud Risk Distribution */}
            <div className="card">
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '12px' }}>Fraud Risk Distribution</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* Low Risk */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--green)' }}>Low Risk (&lt;30%)</span>
                    {loading ? (
                      <span className="skeleton skeleton-text" style={{ width: '40px' }}></span>
                    ) : (
                      <span style={{ color: 'var(--text2)' }}>
                        {fraudDistribution?.low ?? 0}% ({fraudDistribution?.counts?.low ?? 0} users)
                      </span>
                    )}
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill green" style={{ width: loading ? '0%' : `${fraudDistribution?.low ?? 0}%` }}></div>
                  </div>
                </div>

                {/* Medium Risk */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--amber)' }}>Medium Risk (30–70%)</span>
                    {loading ? (
                      <span className="skeleton skeleton-text" style={{ width: '40px' }}></span>
                    ) : (
                      <span style={{ color: 'var(--text2)' }}>
                        {fraudDistribution?.medium ?? 0}% ({fraudDistribution?.counts?.medium ?? 0} users)
                      </span>
                    )}
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: loading ? '0%' : `${fraudDistribution?.medium ?? 0}%`, background: 'var(--amber)' }}></div>
                  </div>
                </div>

                {/* High Risk */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--red)' }}>High Risk (&gt;70%)</span>
                    {loading ? (
                      <span className="skeleton skeleton-text" style={{ width: '40px' }}></span>
                    ) : (
                      <span style={{ color: 'var(--text2)' }}>
                        {fraudDistribution?.high ?? 0}% ({fraudDistribution?.counts?.high ?? 0} users)
                      </span>
                    )}
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: loading ? '0%' : `${fraudDistribution?.high ?? 0}%`, background: 'var(--red)' }}></div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Pending Verification Table */}
          <div className="table-wrap">
            <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Pending Review Queue</span>
              {!loading && <span className="badge badge-amber">{queue.length} Awaiting Review</span>}
            </div>
            <table>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Submission Time</th>
                  <th>Face Match Score</th>
                   <th>Overall Risk</th>
                  <th>Current Status</th>
                  <th>Action Buttons</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx}>
                      <td><span className="skeleton skeleton-text" style={{ width: '120px' }}></span></td>
                      <td><span className="skeleton skeleton-text" style={{ width: '150px' }}></span></td>
                      <td><span className="skeleton skeleton-text" style={{ width: '80px' }}></span></td>
                      <td><span className="skeleton skeleton-text" style={{ width: '50px' }}></span></td>
                      <td><span className="skeleton skeleton-text" style={{ width: '50px' }}></span></td>
                      <td><span className="skeleton skeleton-text" style={{ width: '85px' }}></span></td>
                      <td><span className="skeleton skeleton-text" style={{ width: '220px' }}></span></td>
                    </tr>
                  ))
                ) : queue.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>
                      <div style={{ marginBottom: '8px' }}><i className="ti ti-circle-check" style={{ fontSize: '32px', color: 'var(--green)' }}></i></div>
                      No pending reviews in queue
                    </td>
                  </tr>
                ) : (
                  queue.map((user) => (
                    <tr key={user._id}>
                      <td style={{ color: 'var(--text)', fontWeight: 500 }}>
                        {user.fullName || 'Guest User'}
                      </td>
                      <td style={{ color: 'var(--text2)', fontSize: '12px' }}>
                        {user.email || '—'}
                      </td>
                      <td style={{ fontSize: '12px' }}>{formatTimeAgo(user.submittedAt)}</td>
                      <td style={{ color: getFaceMatchColor(user.faceMatchScore), fontWeight: '600' }}>
                        {user.faceMatchScore ? `${user.faceMatchScore}%` : '—'}
                      </td>
                      <td>
                        <span className={getHighestRiskCategory(user).badgeClass}>
                          {getHighestRiskCategory(user).category}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(user.adminDecision)}>
                          {user.adminDecision || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '5px 10px', fontSize: '11px', minHeight: 'auto' }}
                            onClick={() => navigate(`/admin/verify-user/${user._id}`)}
                          >
                            Details
                          </button>
                          <button
                            className="btn btn-success"
                            style={{ padding: '5px 10px', fontSize: '11px', minHeight: 'auto' }}
                            onClick={() => handleApprove(user._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '5px 10px', fontSize: '11px', minHeight: 'auto' }}
                            onClick={() => handleReject(user._id)}
                          >
                            Reject
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '5px 10px', fontSize: '11px', minHeight: 'auto', background: 'var(--red)', color: 'white' }}
                            onClick={() => handleFlagFraud(user._id)}
                          >
                            Flag Fraud
                          </button>
                        </div>
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

