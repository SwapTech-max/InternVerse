function Verify() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Verify Certificate</h1>
          <p className="text-lg text-gray-600">
            Enter your certificate ID to verify the authenticity of your internship certificate.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <label htmlFor="certificateId" className="block text-sm font-semibold text-gray-700 mb-2">
              Certificate ID
            </label>
            <input
              type="text"
              id="certificateId"
              placeholder="Enter your certificate ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
            Verify Certificate
          </button>
        </div>

        {/* Result Card Layout (Static) */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8 border-l-4 border-gray-300">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Verification Result</h3>
              <p className="text-gray-600">
                Enter a certificate ID and click "Verify Certificate" to see the verification result.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;

