function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
        </div>

        <div className="space-y-12">
          {/* Who We Are */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Who We Are</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                InternVerse is a platform dedicated to providing structured virtual internship programs 
                for students and aspiring professionals. We believe in learning through hands-on 
                experience and real-world project work.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our programs are designed to bridge the gap between academic learning and industry 
                requirements, helping participants build practical skills that matter in today's 
                competitive job market.
              </p>
            </div>
          </section>

          {/* Mission */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-700 leading-relaxed">
                To empower students and professionals with structured, project-based learning 
                experiences that enhance their skills, build their portfolios, and prepare them 
                for successful careers in technology and design.
              </p>
            </div>
          </section>

          {/* Vision */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-700 leading-relaxed">
                To become a leading platform for virtual internships, recognized for providing 
                high-quality, mentor-guided programs that deliver real value to participants 
                and help them achieve their career goals.
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How the Internship Process Works</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Apply for an Internship</h3>
                    <p className="text-gray-700">
                      Browse our available internship programs and apply for the one that matches 
                      your interests and career goals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Get Assigned Projects</h3>
                    <p className="text-gray-700">
                      Once accepted, you'll receive structured project assignments designed to 
                      build real-world skills in your chosen domain.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Work with Mentors</h3>
                    <p className="text-gray-700">
                      Receive guidance and feedback from experienced mentors who help you 
                      navigate challenges and improve your work.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Complete and Submit</h3>
                    <p className="text-gray-700">
                      Complete your assigned projects, submit them for review, and incorporate 
                      feedback to refine your work.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Receive Certificate</h3>
                    <p className="text-gray-700">
                      Upon successful completion of all requirements, receive a verifiable 
                      certificate that validates your internship experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;

