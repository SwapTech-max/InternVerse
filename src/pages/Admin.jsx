import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [accessError, setAccessError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAccessError('');
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          navigate('/login');
          return;
        }

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profileData) {
          // Most commonly: profile row doesn't exist yet (no signup trigger in this app)
          setAccessError(
            'Your profile record was not found. Please create a row in the `profiles` table for your user id and set `role` to "admin", then refresh.'
          );
          return;
        }

        // Check if user is admin
        const normalizedRole = String(profileData.role || '').trim().toLowerCase();
        if (normalizedRole !== 'admin') {
          navigate('/');
          return;
        }

        setProfile(profileData);
      } catch {
        setAccessError('Unable to verify admin permissions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Checking permissions...</p>
      </div>
    );
  }

  if (accessError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow p-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin access not available</h1>
          <p className="text-gray-600 mb-4">{accessError}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white min-h-screen">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-sm text-gray-400 mt-1">{profile?.full_name || 'Admin'}</p>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveSection('internships')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'internships'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Manage Internships
          </button>
          <button
            onClick={() => setActiveSection('notices')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'notices'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Manage Notices
          </button>
          <button
            onClick={() => setActiveSection('faqs')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              activeSection === 'faqs'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Manage FAQs
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeSection === 'dashboard' && <DashboardSection />}
        {activeSection === 'internships' && <InternshipsSection />}
        {activeSection === 'notices' && <NoticesSection />}
        {activeSection === 'faqs' && <FAQsSection />}
      </div>
    </div>
  );
}

// Dashboard Section
function DashboardSection() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Welcome to the Admin Portal. Use the sidebar to manage content.</p>
      </div>
    </div>
  );
}

// Internships Section
function InternshipsSection() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    form_link: '',
    is_active: true
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('internships')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setInternships(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch internships');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const { error: insertError } = await supabase
        .from('internships')
        .insert([formData]);

      if (insertError) throw insertError;
      
      setFormData({ title: '', description: '', duration: '', form_link: '', is_active: true });
      setShowForm(false);
      fetchInternships();
    } catch (err) {
      setError(err.message || 'Failed to add internship');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      setError('');
      const { error: updateError } = await supabase
        .from('internships')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (updateError) throw updateError;
      fetchInternships();
    } catch (err) {
      setError(err.message || 'Failed to update internship');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this internship?')) return;
    
    try {
      setError('');
      const { error: deleteError } = await supabase
        .from('internships')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      fetchInternships();
    } catch (err) {
      setError(err.message || 'Failed to delete internship');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Internships</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Internship'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Internship</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., 4 weeks"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Google Form Link</label>
              <input
                type="url"
                value={formData.form_link}
                onChange={(e) => setFormData({ ...formData, form_link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="https://forms.gle/..."
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Add Internship
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading internships...</p>
      ) : (
        <div className="space-y-4">
          {internships.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
              No internships found. Add your first internship above.
            </div>
          ) : (
            internships.map((internship) => (
              <div key={internship.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{internship.title}</h3>
                    <p className="text-gray-600 mb-2">{internship.description}</p>
                    <p className="text-sm text-gray-500">Duration: {internship.duration}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      internship.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {internship.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(internship.id, internship.is_active)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        internship.is_active
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      {internship.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(internship.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Notices Section
function NoticesSection() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_active: true
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setNotices(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const { error: insertError } = await supabase
        .from('notices')
        .insert([formData]);

      if (insertError) throw insertError;
      
      setFormData({ title: '', content: '', is_active: true });
      setShowForm(false);
      fetchNotices();
    } catch (err) {
      setError(err.message || 'Failed to add notice');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      setError('');
      const { error: updateError } = await supabase
        .from('notices')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (updateError) throw updateError;
      fetchNotices();
    } catch (err) {
      setError(err.message || 'Failed to update notice');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    
    try {
      setError('');
      const { error: deleteError } = await supabase
        .from('notices')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      fetchNotices();
    } catch (err) {
      setError(err.message || 'Failed to delete notice');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Notices</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Notice'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Notice</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows="6"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Add Notice
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading notices...</p>
      ) : (
        <div className="space-y-4">
          {notices.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
              No notices found. Add your first notice above.
            </div>
          ) : (
            notices.map((notice) => (
              <div key={notice.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{notice.title}</h3>
                    <p className="text-gray-600 mb-2">{notice.content}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      notice.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {notice.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(notice.id, notice.is_active)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        notice.is_active
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      {notice.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// FAQs Section
function FAQsSection() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setFaqs(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const { error: insertError } = await supabase
        .from('faqs')
        .insert([formData]);

      if (insertError) throw insertError;
      
      setFormData({ question: '', answer: '' });
      setShowForm(false);
      fetchFAQs();
    } catch (err) {
      setError(err.message || 'Failed to add FAQ');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      setError('');
      const { error: deleteError } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      fetchFAQs();
    } catch (err) {
      setError(err.message || 'Failed to delete FAQ');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage FAQs</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : 'Add FAQ'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New FAQ</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Question</label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Answer</label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Add FAQ
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading FAQs...</p>
      ) : (
        <div className="space-y-4">
          {faqs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
              No FAQs found. Add your first FAQ above.
            </div>
          ) : (
            faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors ml-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;
