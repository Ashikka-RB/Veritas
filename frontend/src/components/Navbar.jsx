import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar({ type = "public", stepText, backTo }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <span className="nav-logo" onClick={() => navigate('/')}>Veritas</span>
      
      {type === "public" && (
        <>
          {/* <div className="nav-links">
            <span className="nav-link">Features</span>
            <span className="nav-link">Security</span>
            <span className="nav-link">Docs</span>
          </div> */}
          <div className="nav-actions">
            <button className="btn btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
            <button className="btn btn-gold" onClick={() => navigate('/register')}>Get Started</button>
          </div>
        </>
      )}

      {type === "user" && (
        <>
          <div className="nav-links">
            <span className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>Dashboard</span>
            <span className={`nav-link ${location.pathname === '/notifications' ? 'active' : ''}`} onClick={() => navigate('/notifications')}>Notifications</span>
            <span className={`nav-link ${location.pathname === '/security' ? 'active' : ''}`} onClick={() => navigate('/security')}>Security</span>
          </div>
          <div className="nav-actions">
            <span className="badge badge-amber"><i className="ti ti-bell"></i> 2 alerts</span>
            <button className="btn btn-outline" onClick={() => navigate('/')}>Sign Out</button>
          </div>
        </>
      )}

      {type === "back" && (
        <div className="nav-actions">
          <button className="btn btn-outline" onClick={() => navigate(backTo || '/dashboard')}>← Dashboard</button>
        </div>
      )}

      {type === "step" && (
        <div className="nav-actions">
          <span style={{ fontSize: '12px', color: 'var(--text3)' }}>{stepText}</span>
        </div>
      )}

      {type === "processing" && (
        <div className="nav-actions">
          <span className="badge badge-gold"><i className="ti ti-loader spin"></i> Processing</span>
        </div>
      )}
    </nav>
  );
}
