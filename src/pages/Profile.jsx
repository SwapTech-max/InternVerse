import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function Profile() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAvatar = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      // Try to get the avatar image
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`${session.user.id}.png`);

      // Check if image exists by trying to load it
      const img = new Image();
      img.onload = () => {
        setAvatarUrl(data.publicUrl);
      };
      img.onerror = () => {
        // Try jpg extension
        const { data: jpgData } = supabase.storage
          .from('avatars')
          .getPublicUrl(`${session.user.id}.jpg`);
        const jpgImg = new Image();
        jpgImg.onload = () => {
          setAvatarUrl(jpgData.publicUrl);
        };
        jpgImg.onerror = () => {
          setAvatarUrl(null);
        };
        jpgImg.src = jpgData.publicUrl;
      };
      img.src = data.publicUrl;
    } catch {
      setAvatarUrl(null);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    // Fetch profile data when session exists
    const fetchProfile = async () => {
      if (session?.user) {
        // Fetch profile from database
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();

        if (!error && data) {
          setProfile(data);
          setFullName(data.full_name || '');
        }

        // Fetch avatar from storage
        await fetchAvatar();
      }
    };

    fetchProfile();
  }, [fetchAvatar, session]);

  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      setMessage({ type: '', text: '' });

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file.' });
        setUploading(false);
        return;
      }

      if (!session?.user?.id) {
        setMessage({ type: 'error', text: 'You must be logged in to upload an image.' });
        setUploading(false);
        return;
      }

      // Determine file extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update avatar preview immediately
      setAvatarUrl(data.publicUrl + '?t=' + Date.now());

      setMessage({ type: 'success', text: 'Profile picture uploaded successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to upload image. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      setMessage({ type: 'error', text: 'You must be logged in to save your profile.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', session.user.id);

      if (error) {
        throw error;
      }

      setProfile({ ...profile, full_name: fullName.trim() });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      const names = profile.full_name.trim().split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return profile.full_name[0].toUpperCase();
    }
    if (session?.user?.email) {
      return session.user.email[0].toUpperCase();
    }
    return 'U';
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please sign in to view your profile</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Edit Profile</h1>
          <p className="text-gray-600">Manage your profile information</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <div className="mb-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-blue-100">
                  {getInitials()}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center space-y-2">
              <label
                htmlFor="avatar-upload"
                className={`inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 cursor-pointer ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 5MB</p>
            </div>
          </div>

          {/* Messages */}
          {message.text && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={session?.user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Phone Number Field (Frontend-only) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value="Not provided"
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">Phone number feature coming soon</p>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
