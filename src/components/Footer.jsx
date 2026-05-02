import { Link } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Syne:wght@400;600;700&display=swap');
  .iv-footer {
    background: #030508;
    border-top: 1px solid rgba(99,102,241,0.12);
    font-family: 'Syne', sans-serif;
    margin-top: auto;
  }
  .iv-footer-inner {
    max-width: 1200px; margin: 0 auto; padding: 64px 40px 32px;
  }
  .iv-footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 48px;
    margin-bottom: 48px;
  }
  .iv-footer-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; margin-bottom: 16px;
  }
  .iv-footer-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Orbitron', monospace; font-weight: 700;
    font-size: 14px; color: #fff;
  }
  .iv-footer-logo-text {
    font-family: 'Orbitron', monospace; font-weight: 700;
    font-size: 16px; color: #fff;
  }
  .iv-footer-desc { font-size: 14px; color: #475569; line-height: 1.7; max-width: 280px; }
  .iv-footer-heading { font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #6366f1; margin-bottom: 20px; }
  .iv-footer-link {
    display: block; font-size: 14px; color: #64748b; text-decoration: none;
    margin-bottom: 12px; transition: color .2s; font-weight: 600;
  }
  .iv-footer-link:hover { color: #a5b4fc; }
  .iv-footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.05);
    padding-top: 28px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }
  .iv-footer-copy { font-size: 13px; color: #334155; }
  .iv-footer-note { font-size: 12px; color: #1e293b; }
  @media (max-width: 768px) {
    .iv-footer-grid { grid-template-columns: 1fr 1fr; }
    .iv-footer-bottom { flex-direction: column; text-align: center; }
    .iv-footer-inner { padding: 48px 24px 28px; }
  }
  @media (max-width: 480px) {
    .iv-footer-grid { grid-template-columns: 1fr; gap: 32px; }
  }
`;

function Footer() {
  return (
    <>
      <style>{styles}</style>
      <footer className="iv-footer">
        <div className="iv-footer-inner">
          <div className="iv-footer-grid">
            <div>
              <Link to="/" className="iv-footer-logo">
                <div className="iv-footer-logo-icon">IV</div>
                <span className="iv-footer-logo-text">InternVerse</span>
              </Link>
              <p className="iv-footer-desc">
                Empowering students with structured virtual internship programs. Real skills, real projects, real certificates.
              </p>
            </div>

            <div>
              <div className="iv-footer-heading">Navigate</div>
              <Link to="/" className="iv-footer-link">Home</Link>
              <Link to="/internships" className="iv-footer-link">Internships</Link>
              <Link to="/about" className="iv-footer-link">About</Link>
              <Link to="/contact" className="iv-footer-link">Contact</Link>
            </div>

            <div>
              <div className="iv-footer-heading">Support</div>
              <Link to="/verify" className="iv-footer-link">Verify Certificate</Link>
              <Link to="/login" className="iv-footer-link">Sign In</Link>
              <Link to="/signup" className="iv-footer-link">Sign Up</Link>
            </div>
          </div>

          <div className="iv-footer-bottom">
            <span className="iv-footer-copy">© 2025 InternVerse. All rights reserved.</span>
            <span className="iv-footer-note">Certificates issued based on internship completion & verification.</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
