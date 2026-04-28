import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">InternVerse</h3>
            <p className="text-sm">
              Empowering students with structured virtual internship programs.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/internships" className="hover:text-white transition-colors">Internships</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/verify" className="hover:text-white transition-colors">Verify Certificate</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8">
          <p className="text-sm text-center">
            © 2025 InternVerse. All rights reserved.
          </p>
          <p className="text-xs text-center mt-2 text-gray-500">
            Certificates are issued based on internship completion and verification.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;