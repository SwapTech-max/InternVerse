import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Syne:wght@400;600;700&display=swap');
  .iv-internships { background:#050810; min-height:100vh; font-family:'Syne',sans-serif; color:#e2e8f0; }
  .iv-int-hero {
    position:relative; overflow:hidden;
    background:#050810; padding:80px 40px 64px;
  }
  .iv-int-hero::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(99,102,241,0.14) 0%, transparent 70%);
  }
  .iv-grid-bg {
    position:absolute; inset:0; pointer-events:none;
    background-image:linear-gradient(rgba(99,102,241,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.05) 1px,transparent 1px);
    background-size:60px 60px;
  }
  .iv-int-hero-content { position:relative; z-index:2; max-width:1200px; margin:0 auto; }
  .iv-label { font-size:11px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:#6366f1; margin-bottom:12px; }
  .iv-int-hero h1 { font-family:'Orbitron',monospace; font-size:clamp(32px,5vw,52px); font-weight:900; color:#fff; margin:0 0 16px; }
  .iv-int-hero p { font-size:18px; color:#64748b; margin:0; max-width:520px; line-height:1.6; }
  .iv-int-body { max-width:1200px; margin:0 auto; padding:60px 40px; }
  .iv-int-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:24px; }
  .iv-int-card {
    background:#0a0f1e; border:1px solid rgba(255,255,255,0.06);
    border-radius:20px; overflow:hidden; display:flex; flex-direction:column;
    transition:all .3s; position:relative;
  }
  .iv-int-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#6366f1,#06b6d4);
    transform:scaleX(0); transition:transform .3s; transform-origin:left;
  }
  .iv-int-card:hover { border-color:rgba(99,102,241,.3); transform:translateY(-4px); background:#0d1428; }
  .iv-int-card:hover::before { transform:scaleX(1); }
  .iv-int-card-body { padding:28px; flex:1; display:flex; flex-direction:column; }
  .iv-int-tags { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
  .iv-int-tag {
    font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;
    padding:4px 12px; border-radius:100px;
    background:rgba(99,102,241,.12); color:#a5b4fc;
    border:1px solid rgba(99,102,241,.2);
  }
  .iv-int-tag-cyan { background:rgba(6,182,212,.1); color:#67e8f9; border-color:rgba(6,182,212,.2); }
  .iv-int-card h3 { font-size:20px; font-weight:700; color:#fff; margin:0 0 12px; }
  .iv-int-card p { font-size:14px; color:#64748b; line-height:1.7; flex:1; margin:0 0 24px; }
  .iv-int-meta { display:flex; gap:16px; margin-bottom:20px; }
  .iv-int-meta-item { display:flex; align-items:center; gap:6px; font-size:13px; color:#475569; font-weight:600; }
  .iv-int-apply {
    display:block; width:100%; text-align:center;
    padding:13px; border-radius:10px; font-family:'Syne',sans-serif;
    font-weight:700; font-size:15px; cursor:pointer; transition:all .3s;
    background:linear-gradient(135deg,#6366f1,#4f46e5);
    color:#fff; border:1px solid rgba(99,102,241,.5);
    box-shadow:0 0 20px rgba(99,102,241,.2);
  }
  .iv-int-apply:hover { box-shadow:0 0 32px rgba(99,102,241,.5); transform:translateY(-1px); }
  .iv-int-apply:disabled { background:#1e293b; color:#334155; border-color:transparent; box-shadow:none; cursor:not-allowed; transform:none; }
  .iv-empty { text-align:center; padding:80px 0; color:#334155; }
  .iv-empty-icon { font-size:48px; margin-bottom:16px; }
  .iv-loading { display:flex; justify-content:center; align-items:center; padding:80px 0; gap:12px; color:#475569; }
  .iv-spinner { width:24px; height:24px; border:2px solid rgba(99,102,241,.2); border-top-color:#6366f1; border-radius:50%; animation:spin .8s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
  @media (max-width:640px) { .iv-int-hero { padding:60px 24px 48px; } .iv-int-body { padding:40px 24px; } }
`;

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
          .from('internships').select('*').eq('is_active', true).order('created_at', { ascending: false });
        if (fetchError) throw fetchError;
        if (isMounted) setInternships(data || []);
      } catch (err) {
        if (isMounted) { setInternships([]); setError(err?.message || 'Failed to load internships.'); }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchInternships();
    return () => { isMounted = false; };
  }, []);

  const domainColors = { 'Web': 'cyan', 'App': 'cyan', 'UI': 'cyan' };
  const getTagClass = (title) => {
    for (const key of Object.keys(domainColors)) {
      if (title?.includes(key)) return 'iv-int-tag iv-int-tag-cyan';
    }
    return 'iv-int-tag';
  };

  return (
    <>
      <style>{styles}</style>
      <div className="iv-internships">
        <div className="iv-int-hero">
          <div className="iv-grid-bg" />
          <div className="iv-int-hero-content">
            <div className="iv-label">Opportunities</div>
            <h1>Available Internships</h1>
            <p>Choose from our structured programs designed to build real-world skills and launch your career.</p>
          </div>
        </div>

        <div className="iv-int-body">
          {loading ? (
            <div className="iv-loading">
              <div className="iv-spinner" />
              <span>Loading internships...</span>
            </div>
          ) : error ? (
            <div style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.2)', borderRadius:'14px', padding:'20px 24px', color:'#f87171', maxWidth:'500px', margin:'0 auto' }}>
              {error}
            </div>
          ) : internships.length === 0 ? (
            <div className="iv-empty">
              <div className="iv-empty-icon">🚀</div>
              <p style={{ fontSize:'18px', fontWeight:600, color:'#475569' }}>No internships available yet.</p>
              <p style={{ fontSize:'14px', color:'#334155', marginTop:'8px' }}>Check back soon — new programs are added regularly.</p>
            </div>
          ) : (
            <div className="iv-int-grid">
              {internships.map((internship) => (
                <div key={internship.id} className="iv-int-card">
                  <div className="iv-int-card-body">
                    <div className="iv-int-tags">
                      <span className={getTagClass(internship.title)}>
                        {internship.title?.split(' ')[0]}
                      </span>
                      <span className="iv-int-tag">Virtual</span>
                    </div>
                    <h3>{internship.title}</h3>
                    <div className="iv-int-meta">
                      <div className="iv-int-meta-item">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {internship.duration}
                      </div>
                      <div className="iv-int-meta-item">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
                        </svg>
                        Remote
                      </div>
                    </div>
                    <p>{internship.description}</p>
                    <button
                      className="iv-int-apply"
                      disabled={!internship.form_link}
                      onClick={() => { if (internship.form_link) window.open(internship.form_link, '_blank', 'noopener,noreferrer'); }}
                    >
                      {internship.form_link ? 'Apply Now →' : 'Coming Soon'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Internships;
