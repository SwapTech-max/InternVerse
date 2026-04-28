import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function Home() {
  const [faqs, setFaqs] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [loadingNotices, setLoadingNotices] = useState(true);

  useEffect(() => {
    fetchFAQs();
    fetchNotices();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setFaqs([]);
    } finally {
      setLoadingFaqs(false);
    }
  };

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotices([]);
    } finally {
      setLoadingNotices(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Structured Virtual Internship Programs
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Project-based internships designed to build real-world skills.
            </p>
            <Link
              to="/internships"
              className="inline-block bg-white text-blue-600 font-semibold py-4 px-8 rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg"
            >
              Explore Internships
            </Link>
          </div>
        </div>
      </section>

      {/* How InternVerse Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            How InternVerse Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: 1, title: 'Apply for Internship', desc: 'Choose your preferred domain and submit your application.' },
              { step: 2, title: 'Get Project Assignments', desc: 'Receive structured tasks designed to build practical skills.' },
              { step: 3, title: 'Complete & Submit Projects', desc: 'Work on real projects and submit them for evaluation.' },
              { step: 4, title: 'Get Certified', desc: 'Earn a verifiable internship certificate upon successful completion.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">{step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internship Domains We Offer Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Internship Domains We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              { title: 'Web Development', desc: 'Build modern web applications and websites.' },
              { title: 'App Development', desc: 'Create mobile and desktop applications.' },
              { title: 'Java Programming', desc: 'Master Java programming fundamentals and advanced concepts.' },
              { title: 'C++ Programming', desc: 'Learn system programming and algorithms with C++.' },
              { title: 'UI/UX Design', desc: 'Design intuitive and beautiful user interfaces.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Will Gain Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            What You Will Gain
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              'Hands-on project experience',
              'Portfolio-ready work',
              'Industry-relevant skills',
              'Verifiable internship certificate',
              'Mentor guidance and feedback',
            ].map((item) => (
              <div key={item} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Apply Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Who Can Apply
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {['BTech / BE students', 'Diploma students', 'Beginners and freshers', 'Students from any academic year'].map((item) => (
              <p key={item} className="text-lg text-gray-700">{item}</p>
            ))}
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
              <p className="text-lg font-semibold text-blue-800">No prior experience required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why InternVerse Is Different Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Why InternVerse Is Different
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              'Structured project-based programs',
              'Transparent internship workflow',
              'Verifiable certification system',
              'Focus on skill development, not just certificates',
            ].map((item) => (
              <div key={item} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2.5"></div>
                <p className="text-lg text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verifiable Certificates Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Verifiable Certificates
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-700 mb-8">
              Every certificate issued by InternVerse can be verified through our official verification system to ensure authenticity and credibility.
            </p>
            <Link
              to="/verify"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md"
            >
              Verify Certificate
            </Link>
          </div>
        </div>
      </section>

      {/* Notices Section */}
      {notices.length > 0 && (
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
              Important Notices
            </h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {loadingNotices ? (
                <p className="text-center text-gray-600">Loading notices...</p>
              ) : (
                notices.map((notice) => (
                  <div key={notice.id} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{notice.title}</h3>
                    <p className="text-gray-600">{notice.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Frequently Asked Questions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {loadingFaqs ? (
              <p className="text-center text-gray-600">Loading FAQs...</p>
            ) : faqs.length === 0 ? (
              <p className="text-center text-gray-600">No FAQs available at the moment.</p>
            ) : (
              faqs.map((faq) => (
                <div key={faq.id}>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Why Choose Our Internship Programs?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                title: 'Project-based learning',
                desc: 'Work on real-world projects that enhance your portfolio and practical skills.',
              },
              {
                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
                title: 'Mentor-guided programs',
                desc: 'Receive guidance and feedback from experienced mentors throughout your journey.',
              },
              {
                icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
                title: 'Verifiable certificates',
                desc: 'Earn certificates that validate your skills and can be verified online.',
              },
              {
                icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                title: 'Remote internships',
                desc: 'Complete your internship from anywhere, at your own pace and schedule.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;