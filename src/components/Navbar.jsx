import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Syne:wght@400;600;700&display=swap');
  .iv-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(5,8,16,0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(99,102,241,0.15);
    font-family: 'Syne', sans-serif;
  }
  .iv-nav-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 40px;
    display: flex; align-items: center; justify-content: space-between;
    height: 68px;
  }
  .iv-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; flex-shrink: 0;
  }
  .iv-logo-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Orbitron', monospace; font-weight: 700;
    font-size: 16px; color: #fff;
    box-shadow: 0 0 20px rgba(99,102,241,0.4);
  }
  .iv-logo-text {
    font-family: 'Orbitron', monospace; font-weight: 700;
    font-size: 18px; color: #fff; letter-spacing: 0.02em;
  }
  .iv-nav-links {
    display: flex; align-items: center; gap: 6px;
  }
  .iv-nav-link {
    padding: 8px 14px; border-radius: 8px; font-size: 14px;
    font-weight: 600; color: #94a3b8; text-decoration: none;
    transition: all .25s; letter-spacing: 0.01em;
  }
  .iv-nav-link:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); }
  .iv-nav-link.active { color: #a5b4fc; background: rgba(99,102,241,0.12); }
  .iv-nav-signin {
    background: linear-gradient(135deg,#6366f1,#4f46e5);
    color: #fff; padding: 9px 22px; border-radius: 10px;
    font-size: 14px; font-weight: 700; text-decoration: none;
    border: 1px solid rgba(99,102,241,.5);
    box-shadow: 0 0 20px rgba(99,102,241,.25);
    transition: all .3s;
  }
  .iv-nav-signin:hover { box-shadow: 0 0 32px rgba(99,102,241,.5); transform: translateY(-1px); }
  .iv-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg,#6366f1,#06b6d4);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 700; font-size: 14px;
    cursor: pointer; border: 1px solid rgba(99,102,241,.4);
    transition: all .3s;
  }
  .iv-avatar:hover { box-shadow: 0 0 20px rgba(99,102,241,.4); transform: scale(1.05); }
  .iv-dropdown {
    position: absolute; right: 0; top: calc(100% + 10px);
    width: 240px; background: #0d1428;
    border: 1px solid rgba(99,102,241,.2);
    border-radius: 14px; overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,.6);
    z-index: 200;
  }
  .iv-dropdown-head {
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .iv-dropdown-name { font-size: 14px; font-weight: 700; color: #e2e8f0; }
  .iv-dropdown-email { font-size: 12px; color: #475569; margin-top: 3px; }
  .iv-dropdown-item {
    display: block; width: 100%; text-align: left;
    padding: 12px 20px; font-size: 14px; font-weight: 600;
    color: #94a3b8; background: transparent; border: none;
    cursor: pointer; text-decoration: none;
    transition: all .2s;
  }
  .iv-dropdown-item:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); }
  .iv-dropdown-signout { color: #f87171 !important; }
  .iv-dropdown-signout:hover { background: rgba(239,68,68,.08) !important; }
  .iv-hamburger {
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 8px; cursor: pointer;
    color: #94a3b8; transition: all .2s; display: flex; align-items: center;
  }
  .iv-hamburger:hover { border-color: rgba(99,102,241,.4); color: #e2e8f0; }
  .iv-mobile-menu {
    background: #070b14; border-top: 1px solid rgba(99,102,241,.1);
    padding: 16px 24px;
  }
  .iv-mobile-link {
    display: block; padding: 12px 16px; border-radius: 10px;
    font-size: 15px; font-weight: 600; color: #94a3b8;
    text-decoration: none; transition: all .2s; margin-bottom: 4px;
  }
  .iv-mobile-link:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); }
  .iv-mobile-link.active { color: #a5b4fc; background: rgba(99,102,241,.12); }
  @media (max-width: 1024px) { .iv-nav-links { display: none; } }
  @media (min-width: 1025px) { .iv-hamburger { display: none; } }
`;

function Navbar() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) { setProfile(null); return; }
    supabase.from('profiles').select('full_name, role').eq('id', session.user.id).single()
      .then(({ data, error }) => { if (!error && data) setProfile(data); });
  }, [session]);

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    if (dropdownOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false); setMobileMenuOpen(false);
  };

  const getInitials = () => {
    if (profile?.full_name) {
      const names = profile.full_name.trim().split(' ');
      return names.length >= 2 ? (names[0][0] + names[names.length-1][0]).toUpperCase() : profile.full_name[0].toUpperCase();
    }
    return session?.user?.email?.[0]?.toUpperCase() || 'U';
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/internships', label: 'Internships' },
    { to: '/about', label: 'About' },
    { to: '/verify', label: 'Verify' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{styles}</style>
      <nav className="iv-nav">
        <div className="iv-nav-inner">
          {/* Logo */}
          <Link to="/" className="iv-logo">
            <div className="iv-logo-icon">IV</div>
            <span className="iv-logo-text">InternVerse</span>
          </Link>

          {/* Desktop links */}
          <div className="iv-nav-links">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={`iv-nav-link${isActive(to) ? ' active' : ''}`}>{label}</Link>
            ))}
          </div>

          {/* Desktop right */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            {session ? (
              <div style={{ position:'relative' }} ref={dropdownRef}>
                <div className="iv-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>{getInitials()}</div>
                {dropdownOpen && (
                  <div className="iv-dropdown">
                    <div className="iv-dropdown-head">
                      <div className="iv-dropdown-name">{profile?.full_name || 'User'}</div>
                      <div className="iv-dropdown-email">{session?.user?.email}</div>
                    </div>
                    <div style={{ padding:'8px 0' }}>
                      {String(profile?.role||'').trim().toLowerCase() === 'admin' && (
                        <Link to="/admin" className="iv-dropdown-item" onClick={() => setDropdownOpen(false)}>⚡ Admin Portal</Link>
                      )}
                      <Link to="/profile" className="iv-dropdown-item" onClick={() => setDropdownOpen(false)}>👤 Edit Profile</Link>
                      <button onClick={handleLogout} className="iv-dropdown-item iv-dropdown-signout">Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="iv-nav-signin">Sign In</Link>
            )}

            {/* Hamburger */}
            <button className="iv-hamburger" onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setDropdownOpen(false); }}>
              {mobileMenuOpen
                ? <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                : <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="iv-mobile-menu">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={`iv-mobile-link${isActive(to) ? ' active' : ''}`}>{label}</Link>
            ))}
            {!session && <Link to="/login" className="iv-mobile-link" style={{ color:'#a5b4fc' }}>Sign In</Link>}
          </div>
        )}

        {/* Mobile user dropdown */}
        {dropdownOpen && session && (
          <div className="iv-mobile-menu">
            <div style={{ padding:'4px 16px 12px', borderBottom:'1px solid rgba(255,255,255,0.06)', marginBottom:'8px' }}>
              <div style={{ fontSize:'14px', fontWeight:700, color:'#e2e8f0' }}>{profile?.full_name || 'User'}</div>
              <div style={{ fontSize:'12px', color:'#475569', marginTop:'3px' }}>{session?.user?.email}</div>
            </div>
            {String(profile?.role||'').trim().toLowerCase() === 'admin' && (
              <Link to="/admin" className="iv-mobile-link" onClick={() => setDropdownOpen(false)}>⚡ Admin Portal</Link>
            )}
            <Link to="/profile" className="iv-mobile-link" onClick={() => setDropdownOpen(false)}>👤 Edit Profile</Link>
            <button onClick={handleLogout} className="iv-mobile-link" style={{ background:'transparent', border:'none', cursor:'pointer', color:'#f87171', textAlign:'left', width:'100%' }}>Sign Out</button>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
