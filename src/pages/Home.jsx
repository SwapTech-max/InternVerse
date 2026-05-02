import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Syne:wght@400;600;700&display=swap');

  .iv-home {
    background: #050810;
    color: #e2e8f0;
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .iv-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: #050810;
    overflow: hidden;
  }

  .iv-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 80% 80%, rgba(6,182,212,0.10) 0%, transparent 60%);
    pointer-events: none;
  }

  .iv-grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .iv-hero-content {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 40px;
  }

  .iv-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.35);
    color: #a5b4fc;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 8px 18px;
    border-radius: 100px;
    margin-bottom: 32px;
  }

  .iv-badge-dot {
    width: 6px;
    height: 6px;
    background: #6366f1;
    border-radius: 50%;
    animation: pulse-dot 2s infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }

  .iv-hero h1 {
    font-family: 'Orbitron', monospace;
    font-size: clamp(36px, 6vw, 72px);
    font-weight: 900;
    line-height: 1.1;
    margin: 0 0 24px;
    background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    max-width: 800px;
  }

  .iv-hero p {
    font-size: 20px;
    color: #94a3b8;
    margin: 0 0 48px;
    max-width: 560px;
    line-height: 1.7;
  }

  .iv-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 16px;
    padding: 16px 36px;
    border-radius: 12px;
    text-decoration: none;
    border: 1px solid rgba(99,102,241,0.5);
    transition: all 0.3s ease;
    box-shadow: 0 0 30px rgba(99,102,241,0.3);
    letter-spacing: 0.02em;
  }

  .iv-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(99,102,241,0.5);
    background: linear-gradient(135deg, #818cf8, #6366f1);
  }

  .iv-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    color: #a5b4fc;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 16px;
    padding: 16px 36px;
    border-radius: 12px;
    text-decoration: none;
    border: 1px solid rgba(99,102,241,0.35);
    transition: all 0.3s ease;
    margin-left: 16px;
  }

  .iv-btn-secondary:hover {
    background: rgba(99,102,241,0.1);
    border-color: rgba(99,102,241,0.6);
  }

  .iv-stats {
    display: flex;
    gap: 48px;
    margin-top: 64px;
    padding-top: 48px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .iv-stat-num {
    font-family: 'Orbitron', monospace;
    font-size: 32px;
    font-weight: 700;
    color: #fff;
  }

  .iv-stat-label {
    font-size: 13px;
    color: #64748b;
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* Section styles */
  .iv-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 40px;
  }

  .iv-section-dark {
    background: #070b14;
  }

  .iv-section-darker {
    background: #050810;
  }

  .iv-section-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #6366f1;
    margin-bottom: 16px;
  }

  .iv-section h2 {
    font-family: 'Orbitron', monospace;
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 700;
    color: #fff;
    margin: 0 0 16px;
    line-height: 1.2;
  }

  .iv-section-subtitle {
    color: #64748b;
    font-size: 17px;
    margin-bottom: 64px;
    max-width: 500px;
    line-height: 1.6;
  }

  /* Steps */
  .iv-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2px;
    background: rgba(99,102,241,0.1);
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(99,102,241,0.15);
  }

  .iv-step {
    background: #0a0f1e;
    padding: 40px 32px;
    position: relative;
    transition: background 0.3s;
  }

  .iv-step:hover {
    background: #0d1428;
  }

  .iv-step-num {
    font-family: 'Orbitron', monospace;
    font-size: 48px;
    font-weight: 900;
    color: rgba(99,102,241,0.15);
    line-height: 1;
    margin-bottom: 20px;
  }

  .iv-step h3 {
    font-size: 17px;
    font-weight: 700;
    color: #e2e8f0;
    margin: 0 0 10px;
  }

  .iv-step p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
    line-height: 1.6;
  }

  .iv-step-line {
    position: absolute;
    top: 40px;
    right: 0;
    width: 1px;
    height: 60px;
    background: linear-gradient(to bottom, rgba(99,102,241,0.4), transparent);
  }

  /* Domain cards */
  .iv-domains {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .iv-domain-card {
    background: #0a0f1e;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 28px 24px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .iv-domain-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #6366f1, #06b6d4);
    transform: scaleX(0);
    transition: transform 0.3s ease;
    transform-origin: left;
  }

  .iv-domain-card:hover {
    border-color: rgba(99,102,241,0.3);
    transform: translateY(-4px);
    background: #0d1428;
  }

  .iv-domain-card:hover::before {
    transform: scaleX(1);
  }

  .iv-domain-icon {
    width: 44px;
    height: 44px;
    background: rgba(99,102,241,0.12);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    font-size: 20px;
  }

  .iv-domain-card h3 {
    font-size: 15px;
    font-weight: 700;
    color: #e2e8f0;
    margin: 0 0 8px;
  }

  .iv-domain-card p {
    font-size: 13px;
    color: #64748b;
    margin: 0;
    line-height: 1.5;
  }

  /* Gains */
  .iv-gains {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
  }

  .iv-gain-item {
    display: flex;
    align-items: center;
    gap: 16px;
    background: #0a0f1e;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 20px 24px;
    transition: all 0.3s;
  }

  .iv-gain-item:hover {
    border-color: rgba(99,102,241,0.3);
    background: #0d1428;
  }

  .iv-gain-check {
    width: 32px;
    height: 32px;
    background: rgba(99,102,241,0.15);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .iv-gain-item span {
    font-size: 15px;
    font-weight: 600;
    color: #cbd5e1;
  }

  /* Who can apply */
  .iv-apply-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .iv-apply-pill {
    background: #0a0f1e;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 20px 24px;
    font-size: 15px;
    font-weight: 600;
    color: #cbd5e1;
    text-align: center;
    transition: all 0.3s;
  }

  .iv-apply-pill:hover {
    border-color: rgba(6,182,212,0.4);
    color: #67e8f9;
    background: rgba(6,182,212,0.05);
  }

  .iv-no-exp-banner {
    background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.1));
    border: 1px solid rgba(99,102,241,0.25);
    border-radius: 16px;
    padding: 24px 32px;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    color: #a5b4fc;
    letter-spacing: 0.02em;
  }

  /* Why different */
  .iv-diff-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .iv-diff-item {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    padding: 24px;
    background: #0a0f1e;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    transition: all 0.3s;
  }

  .iv-diff-item:hover {
    border-color: rgba(99,102,241,0.3);
    transform: translateX(4px);
  }

  .iv-diff-arrow {
    color: #6366f1;
    font-size: 18px;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .iv-diff-item p {
    font-size: 16px;
    color: #cbd5e1;
    font-weight: 600;
    margin: 0;
  }

  /* Cert section */
  .iv-cert-section {
    background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05));
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 24px;
    padding: 80px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .iv-cert-section::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at center, rgba(99,102,241,0.05) 0%, transparent 60%);
    pointer-events: none;
  }

  .iv-cert-section h2 {
    margin-bottom: 16px;
  }

  .iv-cert-section p {
    color: #64748b;
    font-size: 17px;
    max-width: 520px;
    margin: 0 auto 40px;
    line-height: 1.6;
  }

  /* Notices */
  .iv-notice-card {
    background: #0a0f1e;
    border: 1px solid rgba(234,179,8,0.2);
    border-left: 3px solid #eab308;
    border-radius: 14px;
    padding: 24px 28px;
    margin-bottom: 16px;
  }

  .iv-notice-card h3 {
    font-size: 16px;
    font-weight: 700;
    color: #fde68a;
    margin: 0 0 8px;
  }

  .iv-notice-card p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
    line-height: 1.6;
  }

  /* FAQ */
  .iv-faq-item {
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 28px 0;
  }

  .iv-faq-item:first-child {
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .iv-faq-item h3 {
    font-size: 17px;
    font-weight: 700;
    color: #e2e8f0;
    margin: 0 0 12px;
  }

  .iv-faq-item p {
    font-size: 15px;
    color: #64748b;
    margin: 0;
    line-height: 1.7;
  }

  /* Trust cards */
  .iv-trust-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
  }

  .iv-trust-card {
    background: #0a0f1e;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    padding: 32px 28px;
    transition: all 0.3s;
  }

  .iv-trust-card:hover {
    border-color: rgba(99,102,241,0.3);
    background: #0d1428;
    transform: translateY(-4px);
  }

  .iv-trust-icon {
    width: 52px;
    height: 52px;
    background: rgba(99,102,241,0.12);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .iv-trust-card h3 {
    font-size: 17px;
    font-weight: 700;
    color: #e2e8f0;
    margin: 0 0 10px;
  }

  .iv-trust-card p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
    line-height: 1.6;
  }

  @media (max-width: 640px) {
    .iv-hero-content { padding: 60px 24px; }
    .iv-stats { gap: 24px; flex-wrap: wrap; }
    .iv-section { padding: 60px 24px; }
    .iv-btn-secondary { margin-left: 0; margin-top: 12px; }
  }
`;

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
      const { data, error } = await supabase.from('faqs').select('*').order('created_at', { ascending: false });
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
      const { data, error } = await supabase.from('notices').select('*').eq('is_active', true).order('created_at', { ascending: false });
      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotices([]);
    } finally {
      setLoadingNotices(false);
    }
  };

  const domains = [
    { icon: '🌐', title: 'Web Development', desc: 'Build modern web applications and websites.' },
    { icon: '📱', title: 'App Development', desc: 'Create mobile and desktop applications.' },
    { icon: '☕', title: 'Java Programming', desc: 'Master Java fundamentals and advanced concepts.' },
    { icon: '⚡', title: 'C++ Programming', desc: 'Learn system programming and algorithms.' },
    { icon: '🎨', title: 'UI/UX Design', desc: 'Design intuitive and beautiful user interfaces.' },
  ];

  const trustItems = [
    {
      path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Project-based learning',
      desc: 'Work on real-world projects that enhance your portfolio and practical skills.',
    },
    {
      path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      title: 'Mentor-guided programs',
      desc: 'Receive guidance and feedback from experienced mentors throughout your journey.',
    },
    {
      path: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z',
      title: 'Verifiable certificates',
      desc: 'Earn certificates that validate your skills and can be verified online.',
    },
    {
      path: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      title: 'Remote internships',
      desc: 'Complete your internship from anywhere, at your own pace and schedule.',
    },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="iv-home">

        {/* Hero */}
        <section className="iv-hero">
          <div className="iv-grid-bg" />
          <div className="iv-hero-content">
            <div className="iv-badge">
              <span className="iv-badge-dot" />
              Now Accepting Applications
            </div>
            <h1>Structured Virtual Internship Programs</h1>
            <p>Project-based internships designed to build real-world skills for the next generation of developers and designers.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0', alignItems: 'center' }}>
              <Link to="/internships" className="iv-btn-primary">
                Explore Internships
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link to="/verify" className="iv-btn-secondary">Verify Certificate</Link>
            </div>
            <div className="iv-stats">
              {[
                { num: '5+', label: 'Domains' },
                { num: '100%', label: 'Remote' },
                { num: '∞', label: 'Opportunities' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div className="iv-stat-num">{num}</div>
                  <div className="iv-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <div className="iv-section-dark">
          <div className="iv-section">
            <div className="iv-section-label">Process</div>
            <h2>How InternVerse Works</h2>
            <p className="iv-section-subtitle">Four simple steps to launch your career with real-world experience.</p>
            <div className="iv-steps">
              {[
                { step: '01', title: 'Apply for Internship', desc: 'Choose your preferred domain and submit your application.' },
                { step: '02', title: 'Get Project Assignments', desc: 'Receive structured tasks designed to build practical skills.' },
                { step: '03', title: 'Complete & Submit', desc: 'Work on real projects and submit them for evaluation.' },
                { step: '04', title: 'Get Certified', desc: 'Earn a verifiable certificate upon successful completion.' },
              ].map(({ step, title, desc }, i, arr) => (
                <div key={step} className="iv-step">
                  <div className="iv-step-num">{step}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  {i < arr.length - 1 && <div className="iv-step-line" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Domains */}
        <div className="iv-section-darker">
          <div className="iv-section">
            <div className="iv-section-label">Domains</div>
            <h2>Internship Domains We Offer</h2>
            <p className="iv-section-subtitle">Pick your path. Build your future.</p>
            <div className="iv-domains">
              {domains.map(({ icon, title, desc }) => (
                <div key={title} className="iv-domain-card">
                  <div className="iv-domain-icon">{icon}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What You Gain */}
        <div className="iv-section-dark">
          <div className="iv-section">
            <div className="iv-section-label">Benefits</div>
            <h2>What You Will Gain</h2>
            <p className="iv-section-subtitle">Everything you need to stand out in the job market.</p>
            <div className="iv-gains">
              {[
                'Hands-on project experience',
                'Portfolio-ready work',
                'Industry-relevant skills',
                'Verifiable internship certificate',
                'Mentor guidance and feedback',
              ].map((item) => (
                <div key={item} className="iv-gain-item">
                  <div className="iv-gain-check">
                    <svg width="16" height="16" fill="none" stroke="#6366f1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Who Can Apply */}
        <div className="iv-section-darker">
          <div className="iv-section">
            <div className="iv-section-label">Eligibility</div>
            <h2>Who Can Apply</h2>
            <p className="iv-section-subtitle">Open to all students, regardless of background or experience.</p>
            <div className="iv-apply-grid">
              {['BTech / BE Students', 'Diploma Students', 'Beginners & Freshers', 'Any Academic Year'].map((item) => (
                <div key={item} className="iv-apply-pill">{item}</div>
              ))}
            </div>
            <div className="iv-no-exp-banner">⚡ No prior experience required.</div>
          </div>
        </div>

        {/* Why Different */}
        <div className="iv-section-dark">
          <div className="iv-section">
            <div className="iv-section-label">Our Edge</div>
            <h2>Why InternVerse Is Different</h2>
            <p className="iv-section-subtitle">We're not just handing out certificates — we're building skills.</p>
            <div className="iv-diff-list">
              {[
                'Structured project-based programs',
                'Transparent internship workflow',
                'Verifiable certification system',
                'Focus on skill development, not just certificates',
              ].map((item) => (
                <div key={item} className="iv-diff-item">
                  <div className="iv-diff-arrow">→</div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificate CTA */}
        <div className="iv-section-darker">
          <div className="iv-section">
            <div className="iv-cert-section">
              <div className="iv-section-label" style={{ marginBottom: '20px' }}>Credentials</div>
              <h2>Verifiable Certificates</h2>
              <p>Every certificate issued by InternVerse can be verified through our official system to ensure authenticity and credibility.</p>
              <Link to="/verify" className="iv-btn-primary">
                Verify a Certificate
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Notices */}
        {notices.length > 0 && (
          <div className="iv-section-dark">
            <div className="iv-section">
              <div className="iv-section-label">Alerts</div>
              <h2>Important Notices</h2>
              <p className="iv-section-subtitle">Stay updated with the latest announcements.</p>
              {loadingNotices ? (
                <p style={{ color: '#64748b' }}>Loading notices...</p>
              ) : (
                notices.map((notice) => (
                  <div key={notice.id} className="iv-notice-card">
                    <h3>{notice.title}</h3>
                    <p>{notice.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="iv-section-darker">
          <div className="iv-section">
            <div className="iv-section-label">FAQ</div>
            <h2>Frequently Asked Questions</h2>
            <p className="iv-section-subtitle">Got questions? We've got answers.</p>
            <div style={{ maxWidth: '720px' }}>
              {loadingFaqs ? (
                <p style={{ color: '#64748b' }}>Loading FAQs...</p>
              ) : faqs.length === 0 ? (
                <p style={{ color: '#64748b' }}>No FAQs available at the moment.</p>
              ) : (
                faqs.map((faq) => (
                  <div key={faq.id} className="iv-faq-item">
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="iv-section-dark">
          <div className="iv-section">
            <div className="iv-section-label">Why Us</div>
            <h2>Why Choose InternVerse?</h2>
            <p className="iv-section-subtitle">Everything you need to kickstart your career.</p>
            <div className="iv-trust-grid">
              {trustItems.map(({ path, title, desc }) => (
                <div key={title} className="iv-trust-card">
                  <div className="iv-trust-icon">
                    <svg width="24" height="24" fill="none" stroke="#6366f1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path} />
                    </svg>
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Home;
