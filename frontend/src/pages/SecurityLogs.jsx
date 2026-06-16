import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function SecurityLogs() {
  const navigate = useNavigate();
  const [logData, setLogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSecurityLogs = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/security/logs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to retrieve security logs.');
      }

      const data = await response.json();
      setLogData(data);
      setLoading(false);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityLogs();
  }, []);

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    
    // Compare with today/yesterday for user-friendly format
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    if (isToday) {
      return `Today ${timeStr}`;
    }
    if (isYesterday) {
      return `Yesterday ${timeStr}`;
    }
    
    return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} ${timeStr}`;
  };

  const getStatusColor = (status) => {
    if (status === 'SUCCESS') return 'var(--green)';
    if (status === 'FAILED') return 'var(--red)';
    return 'var(--blue)';
  };

  if (loading) {
    return (
      <div className="page active" id="p-security">
        <Navbar type="user" />
        <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
          <div className="page-header" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            <div className="skeleton" style={{ width: '120px', height: '18px', borderRadius: '9px' }}></div>
            <div className="skeleton" style={{ width: '250px', height: '36px' }}></div>
            <div className="skeleton" style={{ width: '350px', height: '14px' }}></div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '24px' }}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="card card-sm" style={{ padding: '20px' }}>
                <div className="skeleton" style={{ width: '80px', height: '12px', marginBottom: '8px' }}></div>
                <div className="skeleton" style={{ width: '50px', height: '28px' }}></div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginBottom: '16px', padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--border)' }}>
              <div className="skeleton" style={{ width: '100px', height: '16px' }}></div>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '20px' }}>
                  <div className="skeleton" style={{ width: '100px', height: '14px' }}></div>
                  <div className="skeleton" style={{ flex: 1, height: '14px' }}></div>
                  <div className="skeleton" style={{ width: '60px', height: '14px' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page active" id="p-security">
        <Navbar type="user" />
        <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px', textAlign: 'center' }}>
          <div className="card" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: '48px', color: 'var(--red)' }}></i>
            <h2>Failed to load security logs</h2>
            <p style={{ color: 'var(--text2)' }}>{error}</p>
            <button className="btn btn-gold" onClick={() => { setLoading(true); fetchSecurityLogs(); }}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const { metrics, logs, devices } = logData;

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
          <div className="card card-sm">
            <div className="stat-label">Total Logins</div>
            <div style={{ fontSize: '20px', fontWeight: 400, fontFamily: 'var(--display)' }}>
              {metrics.totalLogins}
            </div>
          </div>
          <div className="card card-sm">
            <div className="stat-label">Failed Attempts</div>
            <div style={{ fontSize: '20px', fontWeight: 400, fontFamily: 'var(--display)', color: 'var(--amber)' }}>
              {metrics.failedAttempts}
            </div>
          </div>
          <div className="card card-sm">
            <div className="stat-label">Devices</div>
            <div style={{ fontSize: '20px', fontWeight: 400, fontFamily: 'var(--display)' }}>
              {metrics.totalDevices}
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '16px', padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--border)', fontSize: '13px', fontWeight: 500 }}>
            Login &amp; Security Activity
          </div>
          <div style={{ background: 'var(--bg1)', overflow: 'hidden' }}>
            <div className="audit-row" style={{ color: 'var(--text3)', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px', paddingTop: '12px', paddingBottom: '12px' }}>
              <span style={{ minWidth: '140px' }}>Timestamp</span>
              <span style={{ flex: 1 }}>Event</span>
              <span style={{ minWidth: '80px' }}>Status</span>
              <span>IP Address</span>
            </div>

            {logs.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text3)' }}>
                No security activities logged yet.
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={log._id || idx} className="audit-row" style={idx === logs.length - 1 ? { border: 'none' } : {}}>
                  <span style={{ minWidth: '140px', color: 'var(--text3)' }}>
                    {formatTimestamp(log.timestamp)}
                  </span>
                  <span style={{ flex: 1, color: 'var(--text)' }}>
                    {log.eventText}
                  </span>
                  <span style={{ minWidth: '80px', color: getStatusColor(log.status) }}>
                    {log.status}
                  </span>
                  <span>{log.ipAddress}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--border)', fontSize: '13px', fontWeight: 500 }}>
            Registered Devices
          </div>
          
          {devices.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text3)' }}>
              No registered devices found.
            </div>
          ) : (
            devices.map((dev, idx) => (
              <div 
                key={dev._id || idx} 
                style={{ 
                  padding: '16px 20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  borderBottom: idx === devices.length - 1 ? 'none' : '0.5px solid var(--border)' 
                }}
              >
                <i 
                  className={dev.deviceType === 'Mobile' || dev.deviceType === 'Tablet' ? 'ti ti-device-mobile' : 'ti ti-device-laptop'} 
                  style={{ fontSize: '20px', color: dev.isActive ? 'var(--gold)' : 'var(--text3)' }}
                ></i>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px' }}>
                    {dev.browser} on {dev.os}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                    Last seen: {formatTimestamp(dev.lastSeenAt)} · {dev.ipAddress}
                  </div>
                </div>
                <span className={`badge ${dev.isActive ? 'badge-green' : 'badge-gray'}`}>
                  {dev.isActive ? 'Active' : 'Known'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
