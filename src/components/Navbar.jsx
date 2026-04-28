import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function Navbar() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', session.user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      } else {
        setProfile(null);
      }
    };

    fetchProfile();
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
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

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/internships', label: 'Internships' },
    { to: '/about', label: 'About' },
    { to: '/verify', label: 'Verify Certificate' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white shadow-md relative z-40">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">I</span>
            </div>
            <span className="text-xl font-bold text-gray-800">InternVerse</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                  aria-label="User profile"
                >
                  {getInitials()}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">
                        {profile?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {session?.user?.email || ''}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      {String(profile?.role || '').trim().toLowerCase() === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Admin Portal
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Edit Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile: right side (avatar or sign in + hamburger) */}
          <div className="flex lg:hidden items-center space-x-3">
            {session ? (
              <button
                onClick={() => { setDropdownOpen(!dropdownOpen); setMobileMenuOpen(false); }}
                className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-blue-700 transition-colors"
                aria-label="User profile"
              >
                {getInitials()}
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg text-sm transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setDropdownOpen(false); }}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-8 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2.5 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile user dropdown */}
      {dropdownOpen && session && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-8 py-2">
            <div className="px-3 py-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-800">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-gray-600 mt-1">{session?.user?.email || ''}</p>
            </div>
            <div className="pt-2 space-y-1">
              {String(profile?.role || '').trim().toLowerCase() === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setDropdownOpen(false)}
                  className="block py-2.5 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Admin Portal
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="block py-2.5 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2.5 px-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;