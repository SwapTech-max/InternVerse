export function mapAuthError(error, fallbackMessage) {
  const defaultMessage = fallbackMessage || 'Something went wrong. Please try again.';

  if (!error) {
    return defaultMessage;
  }

  const message = typeof error === 'string' ? error : error.message;
  const normalizedMessage = (message || '').toLowerCase();

  if (normalizedMessage.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }

  if (
    normalizedMessage.includes('failed to fetch') ||
    normalizedMessage.includes('networkerror') ||
    normalizedMessage.includes('network error')
  ) {
    return 'Network issue detected. Check your internet connection and try again.';
  }

  if (
    normalizedMessage.includes('not configured') ||
    normalizedMessage.includes('supabase') ||
    normalizedMessage.includes('url')
  ) {
    return 'Authentication service is not configured correctly. Please contact support.';
  }

  if (
    normalizedMessage.includes('user not found') ||
    normalizedMessage.includes('not registered') ||
    normalizedMessage.includes('no users found') ||
    normalizedMessage.includes('signups not allowed for otp')
  ) {
    return 'User not registered. Please sign up first.';
  }

  if (
    normalizedMessage.includes('otp') ||
    normalizedMessage.includes('token') ||
    normalizedMessage.includes('expired') ||
    normalizedMessage.includes('invalid grant')
  ) {
    return 'Invalid or expired OTP. Please request a new one.';
  }

  return message || defaultMessage;
}
