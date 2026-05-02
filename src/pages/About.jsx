const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Syne:wght@400;600;700&display=swap');
  .iv-about { background:#050810; min-height:100vh; font-family:'Syne',sans-serif; color:#e2e8f0; }
  .iv-about-hero { position:relative; overflow:hidden; padding:80px 40px 64px; }
  .iv-about-hero::before { content:''; position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(ellipse 70% 60% at 50% 0%,rgba(99,102,241,0.14) 0%,transparent 70%); }
  .iv-grid-bg { position:absolute; inset:0; pointer-events:none;
    background-image:linear-gradient(rgba(99,102,241,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.05) 1px,transparent 1px);
    background-size:60px 60px; }
  .iv-about-hero-content { position:relative; z-index:2; max-width:1200px; margin:0 auto; }
  .iv-label { font-size:11px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:#6366f1; margin-bottom:12px; }
  .iv-about-hero h1 { font-family:'Orbitron',monospace; font-size:clamp(32px,5vw,52px); font-weight:900; color:#fff; margin:0 0 16px; }
  .iv-about-hero p { font-size:18px; color:#64748b; margin:0; max-width:560px; line-height:1.6; }
  .iv-about-body { max-width:1000px; margin:0 auto; padding:60px 40px 80px; }
  .iv-about-section { margin-bottom:64px; }
  .iv-about-section h2 { font-family:'Orbitron',monospace; font-size:clamp(22px,3vw,30px); font-weight:700; color:#fff; margin:0 0 24px; }
  .iv-about-card { background:#0a0f1e; border:1px solid rgba(255,255,255,0.06); border-radius:20px; padding:36px; }
  .iv-about-card p { font-size:16px; color:#94a3b8; line-height:1.8; margin:0 0 16px; }
  .iv-about-card p:last-child { margin:0; }
  .iv-about-mv { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .iv-about-mv-card { background:#0a0f1e; border:1px solid rgba(255,255,255,0.06); border-radius:20px; padding:32px; position:relative; overflow:hidden; }
  .iv-about-mv-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#6366f1,#06b6d4); }
  .iv-about-mv-icon { font-size:28px; margin-bottom:16px; }
  .iv-about-mv-card h3 { font-family:'Orbitron',monospace; font-size:16px; font-weight:700; color:#a5b4fc; margin:0 0 12px; }
  .iv-about-mv-card p { font-size:15px; color:#64748b; line-height:1.7; margin:0; }
  .iv-steps-list { display:flex; flex-direction:column; gap:0; }
  .iv-step-row { display:flex; align-items:flex-start; gap:20px; padding:28px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
  .iv-step-row:last-child { border-bottom:none; }
  .iv-step-num-circle {
    flex-shrink:0; width:44px; height:44px; border-radius:50%;
    background:linear-gradient(135deg,#6366f1,#4f46e5);
    display:flex; align-items:center; justify-content:center;
    font-family:'Orbitron',monospace; font-weight:700; font-size:14px; color:#fff;
    box-shadow:0 0 20px rgba(99,102,241,.3);
  }
  .iv-step-text h3 { font-size:17px; font-weight:700; color:#e2e8f0; margin:0 0 8px; }
  .iv-step-text p { font-size:14px; color:#64748b; margin:0; line-height:1.6; }
  @media (max-width:768px) {
    .iv-about-hero { padding:60px 24px 48px; }
    .iv-about-body { padding:40px 24px 60px; }
    .iv-about-mv { grid-template-columns:1fr; }
  }
`;

function About() {
  return (
    <>
      <style>{styles}</style>
      <div className="iv-about">
        <div className="iv-about-hero">
          <div className="iv-grid-bg" />
          <div className="iv-about-hero-content">
            <div className="iv-label">Our Story</div>
            <h1>About InternVerse</h1>
            <p>Bridging the gap between academic learning and real-world industry requirements.</p>
          </div>
        </div>

        <div className="iv-about-body">
          {/* Who We Are */}
          <div className="iv-about-section">
            <h2>Who We Are</h2>
            <div className="iv-about-card">
              <p>InternVerse is a platform dedicated to providing structured virtual internship programs for students and aspiring professionals. We believe in learning through hands-on experience and real-world project work.</p>
              <p>Our programs are designed to bridge the gap between academic learning and industry requirements, helping participants build practical skills that matter in today's competitive job market.</p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="iv-about-section">
            <h2>Mission & Vision</h2>
            <div className="iv-about-mv">
              <div className="iv-about-mv-card">
                <div className="iv-about-mv-icon">🎯</div>
                <h3>Our Mission</h3>
                <p>To empower students and professionals with structured, project-based learning experiences that enhance their skills, build their portfolios, and prepare them for successful careers in technology and design.</p>
              </div>
              <div className="iv-about-mv-card">
                <div className="iv-about-mv-icon">🚀</div>
                <h3>Our Vision</h3>
                <p>To become a leading platform for virtual internships, recognized for providing high-quality, mentor-guided programs that deliver real value and help participants achieve their career goals.</p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="iv-about-section">
            <h2>How the Internship Process Works</h2>
            <div className="iv-about-card">
              <div className="iv-steps-list">
                {[
                  { num: '01', title: 'Apply for an Internship', desc: 'Browse our available internship programs and apply for the one that matches your interests and career goals.' },
                  { num: '02', title: 'Get Assigned Projects', desc: 'Once accepted, you\'ll receive structured project assignments designed to build real-world skills in your chosen domain.' },
                  { num: '03', title: 'Work with Mentors', desc: 'Receive guidance and feedback from experienced mentors who help you navigate challenges and improve your work.' },
                  { num: '04', title: 'Complete and Submit', desc: 'Complete your assigned projects, submit them for review, and incorporate feedback to refine your work.' },
                  { num: '05', title: 'Receive Certificate', desc: 'Upon successful completion of all requirements, receive a verifiable certificate that validates your internship experience.' },
                ].map(({ num, title, desc }) => (
                  <div key={num} className="iv-step-row">
                    <div className="iv-step-num-circle">{num}</div>
                    <div className="iv-step-text">
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
