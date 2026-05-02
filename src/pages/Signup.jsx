import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
  .iv-grid-bg { position:absolute; inset:0; pointer-events:none;
    background-image:linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px);
    background-size:60px 60px; }
  .iv-auth-box {
    position:relative; z-index:2; width:100%; max-width:440px;
    background:#0a0f1e; border:1px solid rgba(99,102,241,.2);
    border-radius:24px; padding:44px 40px; overflow:hidden;
  }
  .iv-auth-box::before { content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#6366f1,#06b6d4); }
  .iv-auth-logo { display:flex; align-items:center; gap:10px; margin-bottom:36px; justify-content:center; }
  .iv-auth-logo-icon { width:40px; height:40px; border-radius:10px;
    background:linear-gradient(135deg,#6366f1,#4f46e5);
    display:flex; align-items:center; justify-content:center;
    font-family:'Orbitron',monospace; font-weight:700; font-size:16px; color:#fff;
    box-shadow:0 0 20px rgba(99,102,241,.4); }
  .iv-auth-logo-text { font-family:'Orbitron',monospace; font-weight:700; font-size:18px; color:#fff; }
  .iv-auth-title { font-family:'Orbitron',monospace; font-size:26px; font-weight:700; color:#fff; text-align:center; margin:0 0 8px; }
  .iv-auth-sub { font-size:15px; color:#475569; text-align:center; margin:0 0 36px; }
  .iv-field { margin-bottom:20px; }
  .iv-field-label { display:block; font-size:12px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#64748b; margin-bottom:8px; }
  .iv-input { width:100%; background:#070b14; border:1px solid rgba(255,255,255,0.08);
    border-radius:10px; padding:14px 16px; color:#e2e8f0;
    font-family:'Syne',sans-serif; font-size:15px; outline:none; transition:all .3s; }
  .iv-input::placeholder { color:#1e293b; }
  .iv-input:focus { border-color:rgba(99,102,241,.6); box-shadow:0 0 0 3px rgba(99,102,241,.1); }
  .iv-input-err { border-color:rgba(239,68,68,.4) !important; }
  .iv-err { font-size:12px; color:#f87171; margin-top:5px; }
  .iv-auth-btn {
    width:100%; margin-top:8px; padding:15px; border-radius:12px;
    background:linear-gradient(135deg,#6366f1,#4f46e5); color:#fff;
    font-family:'Syne',sans-serif; font-weight:700; font-size:16px;
    border:1px solid rgba(99,102,241,.5); cursor:pointer;
    box-shadow:0 0 28px rgba(99,102,241,.3); transition:all .3s;
  }
  .iv-auth-btn:hover:not(:disabled) { box-shadow:0 0 44px rgba(99,102,241,.5); transform:translateY(-1px); }
  .iv-auth-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
  .iv-auth-divider { border:none; border-top:1px solid rgba(255,255,255,0.06); margin:28px 0; }
  .iv-auth-footer { text-align:center; font-size:14px; color:#475569; margin-bottom:10px; }
  .iv-auth-link { color:#a5b4fc; font-weight:700; text-decoration:none; transition:color .2s; }
  .iv-auth-link:hover { color:#818cf8; }
  .iv-global-err { background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.2); border-radius:10px; padding:12px 16px; font-size:14px; color:#f87171; text-align:center; margin-top:16px; }
`;

function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fullName') setFullName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const newErrors = { fullName: '', email: '', password: '' };
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (newErrors.fullName || newErrors.email || newErrors.password) { setLoading(false); return; }
    try {
      const { error: supabaseError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
      if (supabaseError) setError(supabaseError.message || 'Failed to sign up. Please try again.');
      else { alert('Signup successful! Please sign in.'); navigate('/login'); }
    } catch { setError('An unexpected error occurred. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="iv-auth-page">
        <div className="iv-grid-bg" />
        <div className="iv-auth-box">
          <div className="iv-auth-logo">
            <div className="iv-auth-logo-icon">IV</div>
            <span className="iv-auth-logo-text">InternVerse</span>
          </div>
          <h1 className="iv-auth-title">Join InternVerse</h1>
          <p className="iv-auth-sub">Create your account and start your journey</p>

          <form onSubmit={handleSignup}>
            <div className="iv-field">
              <label className="iv-field-label">Full Name</label>
              <input type="text" name="fullName" value={fullName} onChange={handleChange}
                className={`iv-input${errors.fullName ? ' iv-input-err' : ''}`} placeholder="Your full name" />
              {errors.fullName && <p className="iv-err">{errors.fullName}</p>}
            </div>
            <div className="iv-field">
              <label className="iv-field-label">Email</label>
              <input type="email" name="email" value={email} onChange={handleChange}
                className={`iv-input${errors.email ? ' iv-input-err' : ''}`} placeholder="your@email.com" />
              {errors.email && <p className="iv-err">{errors.email}</p>}
            </div>
            <div className="iv-field">
              <label className="iv-field-label">Password</label>
              <input type="password" name="password" value={password} onChange={handleChange}
                className={`iv-input${errors.password ? ' iv-input-err' : ''}`} placeholder="••••••••" />
              {errors.password && <p className="iv-err">{errors.password}</p>}
            </div>
            <button type="submit" disabled={loading} className="iv-auth-btn">
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
            {error && <div className="iv-global-err">{error}</div>}
          </form>

          <hr className="iv-auth-divider" />
          <p className="iv-auth-footer">
            Forgot your password?{' '}
            <Link to="/forgot-password" className="iv-auth-link">Reset it here</Link>
          </p>
          <p className="iv-auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="iv-auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
