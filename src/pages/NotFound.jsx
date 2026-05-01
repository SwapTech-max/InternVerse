import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-8">
      <div className="text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-blue-600">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;