import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthInput from '../components/AuthInput';
import Toast from '../components/Toast';
import { validateEmail, sendOtp, verifyOtp, resetPassword } from '../services/authService';

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
    return () => {
      mountedRef.current = false;
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!toast.message) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setToast({ type: '', message: '' });
    }, 3500);

    return () => clearTimeout(timeoutId);
  }, [toast]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleStartOver = () => {
    setStep('email');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setEmailError('');
    setOtpError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setToast({ type: '', message: '' });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setToast({ type: '', message: '' });

    if (sendingOtp || resettingPassword) {
      return;
    }

    const validationMessage = validateEmail(email);
    if (validationMessage) {
      setEmailError(validationMessage);
      return;
    }

    setSendingOtp(true);
    setEmailError('');

    const { success, error } = await sendOtp(email);
    if (!mountedRef.current) {
      return;
    }

    setSendingOtp(false);

    if (!success) {
      setToast({ type: 'error', message: error });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    setEmail(normalizedEmail);
    setStep('verify');
    setOtp('');
    setNewPassword('');
    setOtpError('');
    setPasswordError('');
    setConfirmPassword('');
    setConfirmPasswordError('');
    setToast({ type: 'success', message: 'OTP sent to your email' });
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (otpError) {
      setOtpError('');
    }
    if (toast.message) {
      setToast({ type: '', message: '' });
    }
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (passwordError) {
      setPasswordError('');
    }
    if (toast.message) {
      setToast({ type: '', message: '' });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (confirmPasswordError) {
      setConfirmPasswordError('');
    }
    if (toast.message) {
      setToast({ type: '', message: '' });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setToast({ type: '', message: '' });

    if (step !== 'verify' || resettingPassword || sendingOtp) {
      return;
    }

    setEmailError('');
    setOtpError('');
    setPasswordError('');
    setConfirmPasswordError('');

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setEmailError('Email is required.');
      return;
    }

    const validationMessage = validateEmail(normalizedEmail);
    if (validationMessage) {
      setEmailError(validationMessage);
      return;
    }

    const normalizedOtp = otp.trim();
    const OTP_REGEX = /^\d{6,8}$/;
    if (!OTP_REGEX.test(normalizedOtp)) {
      setOtpError('OTP must be a 6 to 8 digit code.');
      return;
    }

    if (!newPassword) {
      setPasswordError('New password is required.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return;
    }

    setResettingPassword(true);
    const { success: otpOk, error: otpErrorMessage } = await verifyOtp({
      email: normalizedEmail,
      otp: normalizedOtp
    });

    if (!mountedRef.current) {
      return;
    }

    if (!otpOk) {
      setResettingPassword(false);
      setToast({ type: 'error', message: otpErrorMessage });
      return;
    }

    const { success: resetOk, error: resetErrorMessage } = await resetPassword({
      password: newPassword
    });

    if (!mountedRef.current) {
      return;
    }

    setResettingPassword(false);

    if (!resetOk) {
      setToast({ type: 'error', message: resetErrorMessage });
      return;
    }

    setToast({ type: 'success', message: 'Password reset successful' });
    redirectTimeoutRef.current = setTimeout(() => {
      navigate('/login');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-8">
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: '', message: '' })}
      />
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password</h1>
            <p className="text-gray-600">Enter your email to receive an OTP</p>
            <p className="text-xs text-gray-500 mt-2">
              Use only the 6-digit OTP sent to your email. Ignore any sign-in link.
            </p>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-6">
            <AuthInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              error={emailError}
              disabled={step === 'verify' || sendingOtp || resettingPassword}
              autoComplete="email"
            />

            <button
              type="submit"
              disabled={sendingOtp || resettingPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sendingOtp && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {sendingOtp ? 'Sending OTP...' : step === 'verify' ? 'Resend OTP' : 'Send OTP'}
            </button>

            {step === 'verify' && (
              <div className="pt-2 space-y-6 border-t border-gray-100 mt-2">
                <p className="text-sm text-gray-600">
                  OTP sent. Enter the code from your email and choose a new password.
                </p>
                <AuthInput
                  id="otp"
                  label="OTP"
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter OTP code"
                  error={otpError}
                  disabled={resettingPassword || sendingOtp}
                  autoComplete="one-time-code"
                />

                <AuthInput
                  id="newPassword"
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  error={passwordError}
                  disabled={resettingPassword || sendingOtp}
                  autoComplete="new-password"
                />

                <AuthInput
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm your new password"
                  error={confirmPasswordError}
                  disabled={resettingPassword || sendingOtp}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  disabled={
                    resettingPassword ||
                    step !== 'verify' ||
                    otp.trim().length < 6 ||
                    newPassword.length < 6 ||
                    confirmPassword.length < 6
                  }
                  onClick={handleResetPassword}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {resettingPassword && (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {resettingPassword ? 'Resetting Password...' : 'Verify OTP & Reset Password'}
                </button>

                <div className="text-center text-sm text-gray-600">
                  <button
                    type="button"
                    onClick={handleStartOver}
                    disabled={sendingOtp || resettingPassword}
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Use a different email
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Back to{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
