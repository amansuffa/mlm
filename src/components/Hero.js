import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="min-h-screen flex  items-center text-center p-6 overflow-hidden"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div className="min-w-1/2 ">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--text)' }}>
            An Invitation to an Elevated Lifestyle.
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: 'var(--text)' }}>
            Earn Unlimited $100 Instant Commissions
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join PASH.CLUB and build your financial freedom with our simple, proven 
            system that pays you $100 directly and instantly for every active member in 
            your team.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button 
                className="px-8 py-4 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'var(--background)'
                }}
              >
                Join now
              </button>
            </Link>
            <Link href="/about">
              <button 
                className="px-8 py-4 font-semibold rounded-lg border transition-all duration-300 hover:shadow-lg"
                style={{ 
                  borderColor: 'var(--primary)',
                  color: 'var(--primary)',
                  backgroundColor: 'transparent'
                }}
              >
                Learn More
              </button>
            </Link>
          </div>
        </div>
        {/* Background Pattern/Image */}
        <div className="opacity-10 min-w-1/2 ">
          <div className="w-full flex items-center justify-center">
            <div 
              className="w-92 h-92 rounded-lg"
              style={{ backgroundColor: 'var(--primary)' }}
            ></div>
          </div>
        </div>

      </section>

      {/* Services Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--text)' }}>
            Our Best Services
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div 
              className="p-8 rounded-xl text-center hover:shadow-xl transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">1-Up</div>
                  <div className="text-sm">System</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
                One-up Affiliate System
              </h3>
              <p className="opacity-80">
                Earn direct commissions through our powerful and easy-to-understand 1-Up MLM model.
              </p>
            </div>

            {/* Service 2 */}
            <div 
              className="p-8 rounded-xl text-center hover:shadow-xl transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">Tools</div>
                  <div className="text-sm">Digital</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Digital Marketing Tools
              </h3>
              <p className="opacity-80">
                Access ready-to-use resources to promote, grow, and manage your online business.
              </p>
            </div>

            {/* Service 3 */}
            <div 
              className="p-8 rounded-xl text-center hover:shadow-xl transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">Training</div>
                  <div className="text-sm">Step-by-Step</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Step-by-Step Training
              </h3>
              <p className="opacity-80">
                Get guided digital training to sharpen your skills and succeed in affiliate marketing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                About us
              </h2>
              <p className="text-lg mb-6 opacity-90">
                At PASH.CLUB, we make online earning simple with our 1-Up affiliate system. You will get access to digital tools and 
                easy training designed to help you grow your income fast, even if you are just starting out.
              </p>
              <p className="text-lg mb-8 opacity-90">
                We offer direct member-to-member payments, so you get paid instantly with no middleman. With 24/7 access to your dashboard, you are always in control of 
                your business—anytime, anywhere.
              </p>
              <Link href="/about">
                <button 
                  className="px-6 py-3 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
                  style={{ 
                    backgroundColor: 'var(--primary)',
                    color: 'var(--background)'
                  }}
                >
                  Learn More
                </button>
              </Link>
            </div>
            
            {/* Team Visualization with Image Placeholder */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl opacity-50"></div>
                
                {/* Team Network Visualization */}
                <div className="relative p-8">
                  {/* You */}
                  <div className="absolute left-1/2 top-4 transform -translate-x-1/2">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-4 border-white"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      You
                    </div>
                  </div>
                  
                  {/* First Level */}
                  <div className="absolute left-1/2 top-28 transform -translate-x-1/2 flex gap-6">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold shadow-lg border-4 border-white"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      RB
                    </div>
                  </div>
                  
                  {/* Second Level */}
                  <div className="absolute left-1/2 top-52 transform -translate-x-1/2 flex gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg border-4 border-white"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      JM
                    </div>
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg border-4 border-white"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      JA
                    </div>
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg border-4 border-white"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      +5
                    </div>
                  </div>
                  
                  {/* Connecting Lines */}
                  <svg className="w-full h-64 absolute top-0 left-0" style={{ zIndex: -1 }}>
                    <line x1="50%" y1="40" x2="50%" y2="120" stroke="var(--border)" strokeWidth="2" />
                    <line x1="50%" y1="120" x2="50%" y2="200" stroke="var(--border)" strokeWidth="2" />
                  </svg>
                </div>

                {/* Replace this div with actual image */}
                <div className="mt-8 rounded-xl overflow-hidden shadow-lg">
                  <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-semibold">Team Success Image</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interface Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
            Work Smarter with a Clean and User-Friendly Interface
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            With an intuitive layout and streamlined design, you can work more efficiently without the hassle of complicated menus.
          </p>
          
          {/* Dashboard Mockup */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div 
              className="rounded-xl p-8 mx-auto shadow-2xl"
              style={{ 
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)'
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <span className="font-bold text-lg">PASH Dashboard</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-400"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-500"></div>
                </div>
              </div>

              {/* Participants Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[
                  { name: 'Olivia Fiona', email: 'oliviona@gmail.com', role: 'Host' },
                  { name: 'Dani Noer', email: 'daninoer@gmail.com', role: 'Participant' },
                  { name: 'Dave Crea', email: 'davecre4@gmail.com', role: 'Participant' },
                  { name: 'Ruth Haliza', email: 'ruthaliza21@gmail.com', role: 'Participant' }
                ].map((person, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-semibold border-4 border-white shadow-lg"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="font-medium text-sm">{person.name}</p>
                    <p className="text-xs opacity-70 truncate">{person.email}</p>
                    <span className="inline-block px-2 py-1 text-xs rounded-full mt-1"
                      style={{ 
                        backgroundColor: person.role === 'Host' ? 'var(--primary)' : 'var(--border)',
                        color: person.role === 'Host' ? 'white' : 'var(--text)'
                      }}
                    >
                      {person.role}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Invite Section */}
              <div className="text-center p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                <p className="text-sm font-medium mb-3">Invite Guests</p>
                <div className="flex gap-2 justify-center items-center">
                  <div 
                    className="px-4 py-2 rounded-lg font-mono text-sm border"
                    style={{ 
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    crean.ce/XHJ293ZH
                  </div>
                  <button className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <Link href="/features">
            <button 
              className="mt-8 px-6 py-3 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: 'var(--primary)',
                color: 'var(--background)'
              }}
            >
              Learn More
            </button>
          </Link>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--text)' }}>
            Our Portfolios of cases
          </h2>
          <h3 className="text-2xl font-bold text-center mb-16" style={{ color: 'var(--primary)' }}>
            Featured Case Study
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "New Member",
                subtitle: "Started with Zero Experience",
                description: "A new member joined PASH.CLUB with no background in online business or marketing.",
                imageColor: "from-blue-400 to-cyan-500"
              },
              {
                title: "Fastest Income Stream", 
                subtitle: "Earned Within Days",
                description: "By following our simple 1-Up system and training, they made their first $100 in just a few days.",
                imageColor: "from-green-400 to-emerald-500"
              },
              {
                title: "Weekly Earnings",
                subtitle: "Consistent Progress", 
                description: "With regular effort and the support of our tools, weekly earnings became steady",
                imageColor: "from-yellow-400 to-orange-500"
              },
              {
                title: "Collaborative Culture",
                subtitle: "Helping Others Grow",
                description: "Now, they actively share the opportunity and help others achieve similar results.",
                imageColor: "from-purple-400 to-pink-500"
              }
            ].map((caseItem, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)'
                }}
              >
                {/* Image Placeholder */}
                <div className={`w-full h-32 rounded-lg mb-4 bg-gradient-to-r ${caseItem.imageColor} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">Case {index + 1}</span>
                </div>
                
                <h4 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>
                  {caseItem.title}
                </h4>
                <p className="text-sm font-semibold mb-3 opacity-80">{caseItem.subtitle}</p>
                <p className="text-sm opacity-70">{caseItem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
            Take The First Step Toward A Life of Freedom, Purpose, and Elevation.
          </h2>
          <p className="text-lg mb-12 opacity-90">Follow these simple steps to join now</p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "Visit the Registration Page", color: "from-blue-500 to-cyan-600" },
              { step: "Fill Out the Registration Form", color: "from-purple-500 to-pink-600" },
              { step: "Verify Your Email", color: "from-green-500 to-emerald-600" },
              { step: "Complete Your Profile", color: "from-orange-500 to-red-600" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                {/* Step Image Placeholder */}
                <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg border-8 border-white`}>
                  {index + 1}
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text)' }}>
                  {item.step}
                </h3>
              </div>
            ))}
          </div>

          {/* Process Flow Image */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl p-8 text-white text-center">
              <h4 className="font-bold text-lg mb-4">Simple Registration Process</h4>
              <p>Replace this with your process flow image</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6" style={{ color: 'var(--text)' }}>
            Real Stories from Our Satisfied Clients
          </h2>
          <p className="text-lg text-center mb-12 opacity-90 max-w-2xl mx-auto">
            Experience the real-world impact of our platform through user insights
          </p>
          
          <div className="max-w-3xl mx-auto">
            <div 
              className="p-8 rounded-xl"
              style={{ 
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              {/* Client Photo Placeholder */}
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                  JI
                </div>
                <div>
                  <div className="font-semibold text-lg">Jessya Inn</div>
                  <div className="opacity-70">New Affiliate Partner</div>
                </div>
              </div>
              
              <p className="text-lg italic mb-6">
                I tried other platforms before, but nothing clicked. With PASH.CLUB, I made my first sale 
                within days. The 1-Up system really works, and the direct payments are a game-changer.
              </p>
              
              {/* Success Metrics */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                  <div className="font-bold text-lg" style={{ color: 'var(--primary)' }}>$100</div>
                  <div className="text-xs opacity-70">First Commission</div>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                  <div className="font-bold text-lg" style={{ color: 'var(--primary)' }}>3 days</div>
                  <div className="text-xs opacity-70">Time to Earn</div>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
                  <div className="font-bold text-lg" style={{ color: 'var(--primary)' }}>5</div>
                  <div className="text-xs opacity-70">Team Members</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section 
        className="py-20 text-center relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white opacity-20"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white opacity-10"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Start Collaborating Today with Pash Club
          </h2>
          <p className="text-xl mb-8 text-white opacity-90">
            Join now and experience effortless video meetings, seamless file sharing, and powerful collaboration tools.
          </p>
          
          {/* App Screenshot Placeholder */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-white/20 rounded-2xl p-8 backdrop-blur-sm">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">App Interface Preview</span>
                </div>
              </div>
            </div>
          </div>

          <Link href="/signup">
            <button 
              className="px-8 py-4 font-bold rounded-lg transition-all duration-300 hover:shadow-xl"
              style={{ 
                backgroundColor: 'var(--background)',
                color: 'var(--primary)'
              }}
            >
              Get Started
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}