import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchInternships = async () => {
      try {
        setError('');
        const { data, error: fetchError } = await supabase
          .from('internships')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        if (isMounted) setInternships(data || []);
      } catch (err) {
        if (isMounted) {
          setInternships([]);
          setError(err?.message || 'Failed to load internships.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInternships();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Available Internships</h1>
          <p className="text-lg text-gray-600">
            Choose from our structured internship programs designed to enhance your skills.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading internships...</p>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : internships.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No internships available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {internships.map((internship) => (
              <div
                key={internship.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{internship.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {internship.duration}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Virtual
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed flex-1">{internship.description}</p>

                  <button
                    type="button"
                    disabled={!internship.form_link}
                    onClick={() => {
                      if (!internship.form_link) return;
                      window.open(internship.form_link, '_blank', 'noopener,noreferrer');
                    }}
                    className={`w-full font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200 ${
                      internship.form_link
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Internships;

