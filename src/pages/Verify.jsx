import { useState } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Syne:wght@400;600;700&display=swap');
  .iv-verify { background:#050810; min-height:100vh; font-family:'Syne',sans-serif; color:#e2e8f0; }
  .iv-verify-hero { position:relative; overflow:hidden; padding:80px 40px 64px; }
  .iv-verify-hero::before { content:''; position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(ellipse 70% 60% at 50% 0%,rgba(99,102,241,0.14) 0%,transparent 70%); }
  .iv-grid-bg { position:absolute; inset:0; pointer-events:none;
    background-image:linear-gradient(rgba(99,102,241,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.05) 1px,transparent 1px);
    background-size:60px 60px; }
  .iv-verify-hero-content { position:relative; z-index:2; max-width:1200px; margin:0 auto; }
  .iv-label { font-size:11px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:#6366f1; margin-bottom:12px; }
  .iv-verify-hero h1 { font-family:'Orbitron',monospace; font-size:clamp(32px,5vw,52px); font-weight:900; color:#fff; margin:0 0 16px; }
  .iv-verify-hero p { font-size:18px; color:#64748b; margin:0; max-width:520px; line-height:1.6; }
  .iv-verify-body { max-width:680px; margin:0 auto; padding:60px 40px 80px; }
  .iv-verify-card { background:#0a0f1e; border:1px solid rgba(255,255,255,0.06); border-radius:24px; padding:40px; position:relative; overflow:hidden; }
  .iv-verify-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#6366f1,#06b6d4); }
  .iv-input-label { font-size:13px; font-weight:700; color:#94a3b8; margin-bottom:10px; display:block; letter-spacing:.05em; text-transform:uppercase; }
  .iv-input {
    width:100%; background:#070b14; border:1px solid rgba(255,255,255,0.08);
    border-radius:12px; padding:16px 18px; color:#e2e8f0;
    font-family:'Syne',sans-serif; font-size:16px; outline:none; transition:all .3s;
    letter-spacing:.05em;
  }
  .iv-input::placeholder { color:#1e293b; }
  .iv-input:focus { border-color:rgba(99,102,241,.6); box-shadow:0 0 0 3px rgba(99,102,241,.1); }
  .iv-verify-btn {
    width:100%; margin-top:20px; padding:15px; border-radius:12px;
    background:linear-gradient(135deg,#6366f1,#4f46e5); color:#fff;
    font-family:'Syne',sans-serif; font-weight:700; font-size:16px;
    border:1px solid rgba(99,102,241,.5); cursor:pointer;
    box-shadow:0 0 28px rgba(99,102,241,.3); transition:all .3s;
  }
  .iv-verify-btn:hover { box-shadow:0 0 44px rgba(99,102,241,.5); transform:translateY(-1px); }
  .iv-result-card {
    margin-top:24px; background:#070b14;
    border:1px solid rgba(255,255,255,0.06); border-radius:16px; padding:28px;
    display:flex; align-items:flex-start; gap:16px;
  }
  .iv-result-icon { width:44px; height:44px; border-radius:10px; flex-shrink:0;
    background:rgba(99,102,241,.1); display:flex; align-items:center; justify-content:center; }
  .iv-result-title { font-size:16px; font-weight:700; color:#e2e8f0; margin:0 0 6px; }
  .iv-result-text { font-size:14px; color:#475569; margin:0; line-height:1.6; }
  @media (max-width:640px) {
    .iv-verify-hero { padding:60px 24px 48px; }
    .iv-verify-body { padding:40px 24px 60px; }
    .iv-verify-card { padding:24px; }
  }
`;

function Verify() {
  const [certId, setCertId] = useState('');

  return (
    <>
      <style>{styles}</style>
      <div className="iv-verify">
        <div className="iv-verify-hero">
          <div className="iv-grid-bg" />
          <div className="iv-verify-hero-content">
            <div className="iv-label">Authentication</div>
            <h1>Verify Certificate</h1>
            <p>Enter your certificate ID to verify the authenticity of your InternVerse internship certificate.</p>
          </div>
        </div>

        <div className="iv-verify-body">
          <div className="iv-verify-card">
            <label htmlFor="certificateId" className="iv-input-label">Certificate ID</label>
            <input
              type="text"
              id="certificateId"
              className="iv-input"
              placeholder="e.g. IV-2025-XXXXXX"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
            />
            <button className="iv-verify-btn">
              Verify Certificate →
            </button>
          </div>

          <div className="iv-result-card">
            <div className="iv-result-icon">
              <svg width="20" height="20" fill="none" stroke="#6366f1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <p className="iv-result-title">Verification Result</p>
              <p className="iv-result-text">Enter a certificate ID above and click "Verify Certificate" to check its authenticity.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Verify;
