import { supabase } from '../lib/supabase';
import { mapAuthError } from '../utils/authErrors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{6}$/;
const REQUEST_TIMEOUT_MS = 15000;

function withTimeout(promise, timeoutMessage) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(timeoutMessage)), REQUEST_TIMEOUT_MS);
    })
  ]);
}

export function validateEmail(email) {
  const value = email.trim();

  if (!value) {
    return 'Email is required.';
  }

  if (!EMAIL_REGEX.test(value)) {
    return 'Please enter a valid email address.';
  }

  return '';
}

export function validatePasswordResetPayload({ otp, password, confirmPassword, email }) {
  if (!email || !email.trim()) {
    return 'Reset email is missing. Please start again from Forgot Password.';
  }

  if (!otp || !otp.trim()) {
    return 'OTP is required.';
  }

  if (!OTP_REGEX.test(otp.trim())) {
    return 'OTP must be a 6-digit code.';
  }

  if (!password) {
    return 'New password is required.';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  return '';
}

export async function sendPasswordResetOtp(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const validationError = validateEmail(normalizedEmail);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const { error } = await withTimeout(
      supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: false
        }
      }),
      'Request timed out while sending OTP. Please try again.'
    );

    if (error) {
      const normalizedError = (error.message || '').toLowerCase();
      if (normalizedError.includes('user not found') || normalizedError.includes('signups not allowed for otp')) {
        return {
          success: false,
          error: 'User not registered. Please sign up first'
        };
      }

      return {
        success: false,
        error: mapAuthError(error, 'Unable to send OTP. Please try again.')
      };
    }

    return { success: true, error: '' };
  } catch (requestError) {
    return {
      success: false,
      error: mapAuthError(requestError, 'Unable to send OTP. Please try again.')
    };
  }
}

export async function sendOtp(email) {
  return sendPasswordResetOtp(email);
}

export async function verifyOtp({ email, otp }) {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    const { error } = await withTimeout(
      supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: normalizedOtp,
        type: 'email'
      }),
      'Request timed out while verifying OTP. Please try again.'
    );

    if (error) {
      return {
        success: false,
        error: mapAuthError(error, 'Invalid or expired OTP. Please try again.')
      };
    }

    return { success: true, error: '' };
  } catch (verifyError) {
    return {
      success: false,
      error: mapAuthError(verifyError, 'Unable to verify OTP. Please try again.')
    };
  }
}

export async function resetPassword({ password }) {
  try {
    const { error } = await withTimeout(
      supabase.auth.updateUser({
        password
      }),
      'Request timed out while updating password. Please try again.'
    );

    if (error) {
      return {
        success: false,
        error: mapAuthError(error, 'Unable to update password. Please try again.')
      };
    }

    return { success: true, error: '' };
  } catch (updateError) {
    return {
      success: false,
      error: mapAuthError(updateError, 'Unable to update password. Please try again.')
    };
  }
}
