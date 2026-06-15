import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error("Failed to load notifications.");
        }

        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [navigate]);

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    
    const isToday = date.toDateString() === now.toDateString();
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    const timeStr = date.toLocaleTimeString('en-US', options);
    
    if (isToday) {
      return `Today, ${timeStr}`;
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${timeStr}`;
    }
    
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeStr}`;
  };

  const getIconClass = (type) => {
    switch (type) {
      case 'success':
        return 'ti ti-check';
      case 'passed':
        return 'ti ti-circle-check';
      case 'pending':
        return 'ti ti-clock';
      case 'alert':
        return 'ti ti-alert-triangle';
      default:
        return 'ti ti-bell';
    }
  };

  const getIconStyle = (type) => {
    switch (type) {
      case 'success':
      case 'passed':
        return { background: 'var(--green-dim)', color: 'var(--green)', fontSize: '16px' };
      case 'pending':
        return { background: 'var(--amber-dim)', color: 'var(--amber)', fontSize: '16px' };
      case 'alert':
        return { background: 'var(--red-dim)', color: 'var(--red)', fontSize: '16px' };
      default:
        return { background: 'var(--blue-dim)', color: 'var(--blue)', fontSize: '16px' };
    }
  };

  const getBadgeLabel = (type) => {
    switch (type) {
      case 'success':
        return 'Success';
      case 'passed':
        return 'Passed';
      case 'pending':
        return 'Pending';
      case 'alert':
        return 'Alert';
      default:
        return 'Update';
    }
  };

  if (loading) {
    return (
      <div className="page active" id="p-notifications">
        <Navbar type="user" />
        <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
          <div className="page-header">
            <div className="eyebrow">Alerts &amp; Updates</div>
            <h1>Notifications</h1>
          </div>
          <div className="card skeleton-card" style={{ height: '300px', background: 'var(--bg3)', border: 'none' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page active" id="p-notifications">
        <Navbar type="user" />
        <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div className="card" style={{ textAlign: 'center', maxWidth: '450px', padding: '40px' }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: '48px', color: 'var(--red)', marginBottom: '16px', display: 'block' }}></i>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '24px', fontWeight: 400, marginBottom: '12px' }}>Failed to load notifications</h2>
            <p style={{ color: 'var(--text3)', fontSize: '14px', marginBottom: '24px' }}>{error}</p>
            <button className="btn btn-gold" onClick={() => window.location.reload()}>Retry Loading</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page active" id="p-notifications">
      <Navbar type="user" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        <div className="page-header">
          <div className="eyebrow">Alerts &amp; Updates</div>
          <h1>Notifications</h1>
        </div>
        <div className="card">
          {notifications && notifications.length > 0 ? (
            notifications.map((notif, idx) => (
              <div 
                className="notif-item" 
                key={idx} 
                style={{ borderBottom: idx === notifications.length - 1 ? 'none' : '0.5px solid var(--border)' }}
              >
                <div className="notif-icon" style={getIconStyle(notif.type)}>
                  <i className={getIconClass(notif.type)}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{notif.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>
                    {notif.message}
                  </div>
                  <div className="notif-time">{formatTimestamp(notif.timestamp)}</div>
                </div>
                <span className={notif.badgeClass || 'badge badge-gray'}>
                  {getBadgeLabel(notif.type)}
                </span>
              </div>
            ))
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text3)' }}>
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
