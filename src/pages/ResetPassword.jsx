import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();

  useEffect(() => {
    // Legacy route: keep it safe, but the production OTP-only flow is on /forgot-password.
    const timeoutId = setTimeout(() => {
      navigate('/forgot-password', { replace: true });
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Password Reset</h1>
            <p className="text-gray-600">Redirecting you to the OTP reset page…</p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              If you aren’t redirected, go to{' '}
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Forgot Password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
