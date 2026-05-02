const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Syne:wght@400;600;700&display=swap');
  .iv-contact { background:#050810; min-height:100vh; font-family:'Syne',sans-serif; color:#e2e8f0; }
  .iv-contact-hero { position:relative; overflow:hidden; padding:80px 40px 64px; }
  .iv-contact-hero::before { content:''; position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(ellipse 70% 60% at 50% 0%,rgba(99,102,241,0.14) 0%,transparent 70%); }
  .iv-grid-bg { position:absolute; inset:0; pointer-events:none;
    background-image:linear-gradient(rgba(99,102,241,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.05) 1px,transparent 1px);
    background-size:60px 60px; }
  .iv-contact-hero-content { position:relative; z-index:2; max-width:1200px; margin:0 auto; }
  .iv-label { font-size:11px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:#6366f1; margin-bottom:12px; }
  .iv-contact-hero h1 { font-family:'Orbitron',monospace; font-size:clamp(32px,5vw,52px); font-weight:900; color:#fff; margin:0 0 16px; }
  .iv-contact-hero p { font-size:18px; color:#64748b; margin:0; max-width:520px; line-height:1.6; }
  .iv-contact-body { max-width:800px; margin:0 auto; padding:60px 40px 80px; }
  .iv-contact-card {
    background:#0a0f1e; border:1px solid rgba(255,255,255,0.06);
    border-radius:24px; padding:48px; position:relative; overflow:hidden;
  }
  .iv-contact-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#6366f1,#06b6d4); }
  .iv-contact-info-item {
    display:flex; align-items:flex-start; gap:20px;
    padding:28px 0; border-bottom:1px solid rgba(255,255,255,0.05);
  }
  .iv-contact-info-item:last-child { border-bottom:none; padding-bottom:0; }
  .iv-contact-icon {
    width:48px; height:48px; border-radius:12px; flex-shrink:0;
    background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2);
    display:flex; align-items:center; justify-content:center;
    font-size:20px;
  }
  .iv-contact-info-label { font-size:12px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#475569; margin-bottom:6px; }
  .iv-contact-info-value { font-size:17px; font-weight:600; color:#e2e8f0; }
  .iv-contact-info-sub { font-size:14px; color:#64748b; margin-top:4px; }
  .iv-contact-email-link { color:#a5b4fc; text-decoration:none; transition:color .2s; }
  .iv-contact-email-link:hover { color:#818cf8; }
  @media (max-width:640px) {
    .iv-contact-hero { padding:60px 24px 48px; }
    .iv-contact-body { padding:40px 24px 60px; }
    .iv-contact-card { padding:28px 24px; }
  }
`;

function Contact() {
  return (
    <>
      <style>{styles}</style>
      <div className="iv-contact">
        <div className="iv-contact-hero">
          <div className="iv-grid-bg" />
          <div className="iv-contact-hero-content">
            <div className="iv-label">Reach Out</div>
            <h1>Contact Us</h1>
            <p>Have questions about our internship programs? We're happy to help.</p>
          </div>
        </div>

        <div className="iv-contact-body">
          <div className="iv-contact-card">
            <div className="iv-contact-info-item">
              <div className="iv-contact-icon">📧</div>
              <div>
                <div className="iv-contact-info-label">Email Us</div>
                <a href="mailto:build.uniconnect2025@gmail.com" className="iv-contact-info-value iv-contact-email-link">
                  build.uniconnect2025@gmail.com
                </a>
                <div className="iv-contact-info-sub">For internship queries, certificate issues, and general support.</div>
              </div>
            </div>

            <div className="iv-contact-info-item">
              <div className="iv-contact-icon">⏱️</div>
              <div>
                <div className="iv-contact-info-label">Response Time</div>
                <div className="iv-contact-info-value">24 – 48 Hours</div>
                <div className="iv-contact-info-sub">We typically respond within 24 to 48 hours during business days.</div>
              </div>
            </div>

            <div className="iv-contact-info-item">
              <div className="iv-contact-icon">🌐</div>
              <div>
                <div className="iv-contact-info-label">Platform</div>
                <div className="iv-contact-info-value">100% Virtual</div>
                <div className="iv-contact-info-sub">All internships and support are provided remotely.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
