import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthInput from '../components/AuthInput';
import Toast from '../components/Toast';
import { validateEmail, sendOtp, verifyOtp, resetPassword } from '../services/authService';

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
  .iv-auth-title { font-family:'Orbitron',monospace; font-size:24px; font-weight:700; color:#fff; text-align:center; margin:0 0 8px; }
  .iv-auth-sub { font-size:14px; color:#475569; text-align:center; margin:0 0 8px; }
  .iv-auth-hint { font-size:12px; color:#334155; text-align:center; margin:0 0 32px; }
  .iv-auth-btn {
    width:100%; padding:15px; border-radius:12px;
    background:linear-gradient(135deg,#6366f1,#4f46e5); color:#fff;
    font-family:'Syne',sans-serif; font-weight:700; font-size:16px;
    border:1px solid rgba(99,102,241,.5); cursor:pointer;
    box-shadow:0 0 28px rgba(99,102,241,.3); transition:all .3s;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .iv-auth-btn:hover:not(:disabled) { box-shadow:0 0 44px rgba(99,102,241,.5); transform:translateY(-1px); }
  .iv-auth-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
  .iv-otp-section {
    margin-top:28px; padding-top:28px;
    border-top:1px solid rgba(255,255,255,0.06);
  }
  .iv-otp-notice { font-size:14px; color:#475569; margin-bottom:20px; padding:14px 16px;
    background:rgba(99,102,241,.06); border:1px solid rgba(99,102,241,.15); border-radius:10px; }
  .iv-auth-divider { border:none; border-top:1px solid rgba(255,255,255,0.06); margin:24px 0; }
  .iv-auth-footer { text-align:center; font-size:14px; color:#475569; }
  .iv-auth-link { color:#a5b4fc; font-weight:700; text-decoration:none; transition:color .2s; }
  .iv-auth-link:hover { color:#818cf8; }
  .iv-spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .iv-space { margin-bottom:20px; }
`;

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [toast, setToast] = useState({ type: '', message: '' });
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const mountedRef = useRef(true);
  const redirectTimeoutRef = useRef(null);

  useEffect(() => {
    return () => { mountedRef.current = false; if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current); };
  }, []);

  useEffect(() => {
    if (!toast.message) return;
    const id = setTimeout(() => setToast({ type: '', message: '' }), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const handleStartOver = () => {
    setStep('email'); setOtp(''); setNewPassword(''); setConfirmPassword('');
    setEmailError(''); setOtpError(''); setPasswordError(''); setConfirmPasswordError('');
    setToast({ type: '', message: '' });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setToast({ type: '', message: '' });
    if (sendingOtp || resettingPassword) return;
    const validationMessage = validateEmail(email);
    if (validationMessage) { setEmailError(validationMessage); return; }
    setSendingOtp(true); setEmailError('');
    const { success, error } = await sendOtp(email);
    if (!mountedRef.current) return;
    setSendingOtp(false);
    if (!success) { setToast({ type: 'error', message: error }); return; }
    setEmail(email.trim().toLowerCase());
    setStep('verify'); setOtp(''); setNewPassword(''); setOtpError(''); setPasswordError(''); setConfirmPassword(''); setConfirmPasswordError('');
    setToast({ type: 'success', message: 'OTP sent to your email' });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setToast({ type: '', message: '' });
    if (step !== 'verify' || resettingPassword || sendingOtp) return;
    setEmailError(''); setOtpError(''); setPasswordError(''); setConfirmPasswordError('');
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || validateEmail(normalizedEmail)) { setEmailError('Valid email required.'); return; }
    const normalizedOtp = otp.trim();
    if (!/^\d{6,8}$/.test(normalizedOtp)) { setOtpError('OTP must be a 6 to 8 digit code.'); return; }
    if (!newPassword) { setPasswordError('New password is required.'); return; }
    if (newPassword.length < 6) { setPasswordError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setConfirmPasswordError('Passwords do not match.'); return; }
    setResettingPassword(true);
    const { success: otpOk, error: otpErrorMessage } = await verifyOtp({ email: normalizedEmail, otp: normalizedOtp });
    if (!mountedRef.current) return;
    if (!otpOk) { setResettingPassword(false); setToast({ type: 'error', message: otpErrorMessage }); return; }
    const { success: resetOk, error: resetErrorMessage } = await resetPassword({ password: newPassword });
    if (!mountedRef.current) return;
    setResettingPassword(false);
    if (!resetOk) { setToast({ type: 'error', message: resetErrorMessage }); return; }
    setToast({ type: 'success', message: 'Password reset successful' });
    redirectTimeoutRef.current = setTimeout(() => navigate('/login'), 1200);
  };

  return (
    <>
      <style>{styles}</style>
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      <div className="iv-auth-page">
        <div className="iv-grid-bg" />
        <div className="iv-auth-box">
          <div className="iv-auth-logo">
            <div className="iv-auth-logo-icon">IV</div>
            <span className="iv-auth-logo-text">InternVerse</span>
          </div>
          <h1 className="iv-auth-title">Forgot Password</h1>
          <p className="iv-auth-sub">Enter your email to receive an OTP</p>
          <p className="iv-auth-hint">Use only the 6-digit OTP sent to your email. Ignore any sign-in link.</p>

          <form onSubmit={handleSendOtp}>
            <div className="iv-space">
              <AuthInput id="email" label="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
                placeholder="your@email.com" error={emailError}
                disabled={step === 'verify' || sendingOtp || resettingPassword} autoComplete="email" />
            </div>
            <button type="submit" disabled={sendingOtp || resettingPassword} className="iv-auth-btn">
              {sendingOtp && <span className="iv-spinner" />}
              {sendingOtp ? 'Sending OTP...' : step === 'verify' ? 'Resend OTP' : 'Send OTP →'}
            </button>

            {step === 'verify' && (
              <div className="iv-otp-section">
                <p className="iv-otp-notice">OTP sent! Enter the code from your email and choose a new password.</p>
                <div className="iv-space">
                  <AuthInput id="otp" label="OTP Code" type="text" value={otp}
                    onChange={(e) => { const v = e.target.value.replace(/\D/g,'').slice(0,6); setOtp(v); if (otpError) setOtpError(''); }}
                    placeholder="Enter 6-digit OTP" error={otpError}
                    disabled={resettingPassword || sendingOtp} autoComplete="one-time-code" />
                </div>
                <div className="iv-space">
                  <AuthInput id="newPassword" label="New Password" type="password" value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); if (passwordError) setPasswordError(''); }}
                    placeholder="New password" error={passwordError}
                    disabled={resettingPassword || sendingOtp} autoComplete="new-password" />
                </div>
                <div className="iv-space">
                  <AuthInput id="confirmPassword" label="Confirm Password" type="password" value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); if (confirmPasswordError) setConfirmPasswordError(''); }}
                    placeholder="Confirm new password" error={confirmPasswordError}
                    disabled={resettingPassword || sendingOtp} autoComplete="new-password" />
                </div>
                <button type="button" onClick={handleResetPassword}
                  disabled={resettingPassword || step !== 'verify' || otp.trim().length < 6 || newPassword.length < 6 || confirmPassword.length < 6}
                  className="iv-auth-btn" style={{ marginBottom:'16px' }}>
                  {resettingPassword && <span className="iv-spinner" />}
                  {resettingPassword ? 'Resetting...' : 'Reset Password →'}
                </button>
                <div style={{ textAlign:'center' }}>
                  <button type="button" onClick={handleStartOver} disabled={sendingOtp || resettingPassword}
                    className="iv-auth-link" style={{ background:'transparent', border:'none', cursor:'pointer', fontSize:'14px', fontFamily:'Syne,sans-serif', fontWeight:700 }}>
                    Use a different email
                  </button>
                </div>
              </div>
            )}
          </form>

          <hr className="iv-auth-divider" />
          <p className="iv-auth-footer">
            Back to{' '}
            <Link to="/login" className="iv-auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
