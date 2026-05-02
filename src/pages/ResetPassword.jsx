import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Syne:wght@400;600;700&display=swap');
  .iv-auth-page {
    background:#050810; min-height:100vh; font-family:'Syne',sans-serif;
    display:flex; align-items:center; justify-content:center;
    padding:40px 24px; position:relative; overflow:hidden;
  }
  .iv-auth-page::before { content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(99,102,241,0.12) 0%,transparent 70%);
    pointer-events:none; }
  .iv-auth-box {
    position:relative; z-index:2; width:100%; max-width:440px;
    background:#0a0f1e; border:1px solid rgba(99,102,241,.2);
    border-radius:24px; padding:44px 40px; overflow:hidden; text-align:center;
  }
  .iv-auth-box::before { content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#6366f1,#06b6d4); }
  .iv-auth-logo { display:flex; align-items:center; gap:10px; margin-bottom:36px; justify-content:center; }
  .iv-auth-logo-icon { width:40px; height:40px; border-radius:10px;
    background:linear-gradient(135deg,#6366f1,#4f46e5);
    display:flex; align-items:center; justify-content:center;
    font-family:'Orbitron',monospace; font-weight:700; font-size:16px; color:#fff; }
  .iv-auth-logo-text { font-family:'Orbitron',monospace; font-weight:700; font-size:18px; color:#fff; }
  .iv-auth-title { font-family:'Orbitron',monospace; font-size:24px; font-weight:700; color:#fff; margin:0 0 12px; }
  .iv-auth-sub { font-size:15px; color:#475569; margin:0 0 24px; }
  .iv-spinner-wrap { display:flex; justify-content:center; margin-bottom:24px; }
  .iv-spinner { width:32px; height:32px; border:2px solid rgba(99,102,241,.2); border-top-color:#6366f1; border-radius:50%; animation:spin .8s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .iv-auth-link { color:#a5b4fc; font-weight:700; text-decoration:none; font-size:15px; }
  .iv-auth-link:hover { color:#818cf8; }
`;

function ResetPassword() {
  const navigate = useNavigate();
  useEffect(() => {
    const id = setTimeout(() => navigate('/forgot-password', { replace: true }), 0);
    return () => clearTimeout(id);
  }, [navigate]);

  return (
    <>
      <style>{styles}</style>
      <div className="iv-auth-page">
        <div className="iv-auth-box">
          <div className="iv-auth-logo">
            <div className="iv-auth-logo-icon">IV</div>
            <span className="iv-auth-logo-text">InternVerse</span>
          </div>
          <h1 className="iv-auth-title">Password Reset</h1>
          <p className="iv-auth-sub">Redirecting you to the OTP reset page…</p>
          <div className="iv-spinner-wrap"><div className="iv-spinner" /></div>
          <p style={{ fontSize:'14px', color:'#475569' }}>
            If you aren't redirected,{' '}
            <Link to="/forgot-password" className="iv-auth-link">click here</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
