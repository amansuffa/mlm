"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
};

function AnimatedSection({ children, className = "" }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCard({ children, delay = 0 }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={scaleIn}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative overflow-hidden"
        style={{ backgroundColor: 'var(--background)' }}
      >
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-24 h-24 rounded-full opacity-10"
          style={{ backgroundColor: 'var(--primary)' }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-20 h-20 rounded-full opacity-10"
          style={{ backgroundColor: 'var(--primary)' }}
          animate={{
            y: [0, 25, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full opacity-10"
          style={{ backgroundColor: 'var(--primary)' }}
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ color: 'var(--text)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            An Invitation to an <span style={{ color: 'var(--primary)' }}>Elevated</span> Lifestyle.
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-semibold"
            style={{ color: 'var(--text)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Earn Unlimited $100 Instant Commissions
          </motion.p>
          
          <motion.p 
            className="text-lg mb-8 max-w-2xl mx-auto opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join PASH.CLUB and build your financial freedom with our simple, proven 
            system that pays you $100 directly and instantly for every active member in 
            your team.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/signup">
              <motion.button 
                className="px-8 py-4 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg text-lg"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'var(--background)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join now
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button 
                className="px-8 py-4 font-semibold rounded-lg border transition-all duration-300 hover:shadow-lg text-lg"
                style={{ 
                  borderColor: 'var(--primary)',
                  color: 'var(--primary)',
                  backgroundColor: 'transparent'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>

          {/* Animated scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 rounded-full border-gray-400 flex justify-center">
              <motion.div
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-4"
              style={{ color: 'var(--text)' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Our Best Services
            </motion.h2>
            <motion.div
              className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-12 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </AnimatedSection>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {[
              {
                title: "One-up Affiliate System",
                description: "Earn direct commissions through our powerful and easy-to-understand 1-Up MLM model.",
                icon: "🚀",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "Digital Marketing Tools",
                description: "Access ready-to-use resources to promote, grow, and manage your online business.",
                icon: "🛠️",
                gradient: "from-green-500 to-teal-500"
              },
              {
                title: "Step-by-Step Training",
                description: "Get guided digital training to sharpen your skills and succeed in affiliate marketing.",
                icon: "📚",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((service, index) => (
              <AnimatedCard key={index} delay={index * 0.2}>
                <motion.div 
                  className={`rounded-2xl p-8 text-center h-full relative overflow-hidden group bg-gradient-to-br ${service.gradient} text-white`}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10">
                    <motion.div 
                      className="text-5xl mb-6"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {service.icon}
                    </motion.div>
                    <motion.h3 
                      className="text-xl font-semibold mb-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      {service.title}
                    </motion.h3>
                    <motion.p 
                      className="opacity-90 leading-relaxed"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {service.description}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatedCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: 'var(--text)' }}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                About us
              </motion.h2>
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
              >
                <motion.p variants={fadeInUp} className="text-lg mb-6 opacity-90 leading-relaxed">
                  At PASH.CLUB, we make online earning simple with our 1-Up affiliate system. You'll get access to digital tools and 
                  easy training designed to help you grow your income fast, even if you're just starting out.
                </motion.p>
                <motion.p variants={fadeInUp} className="text-lg mb-8 opacity-90 leading-relaxed">
                  We offer direct member-to-member payments, so you get paid instantly with no middleman. With 24/7 access to your dashboard, you're always in control of 
                  your business—anytime, anywhere.
                </motion.p>
                <motion.div variants={fadeInUp}>
                  <Link href="/about">
                    <motion.button 
                      className="px-6 py-3 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--primary)',
                        color: 'var(--background)'
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Learn More
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatedSection>
            
            {/* Team Visualization */}
            <AnimatedSection>
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative w-full max-w-md">
                  {/* Background Pattern */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl opacity-50"
                    whileHover={{ rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  
                  {/* Team Network Visualization */}
                  <div className="relative p-8">
                    {/* You */}
                    <motion.div 
                      className="absolute left-1/2 top-4 transform -translate-x-1/2"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-4 border-white"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        You
                      </div>
                    </motion.div>
                    
                    {/* First Level */}
                    <motion.div 
                      className="absolute left-1/2 top-28 transform -translate-x-1/2 flex gap-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold shadow-lg border-4 border-white"
                        style={{ backgroundColor: 'var(--accent)' }}
                        whileHover={{ scale: 1.1 }}
                      >
                        RB
                      </motion.div>
                    </motion.div>
                    
                    {/* Second Level */}
                    <motion.div 
                      className="absolute left-1/2 top-52 transform -translate-x-1/2 flex gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      {['JM', 'JA', '+5'].map((initial, index) => (
                        <motion.div
                          key={initial}
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg border-4 border-white"
                          style={{ backgroundColor: 'var(--accent)' }}
                          whileHover={{ scale: 1.1 }}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                        >
                          {initial}
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    {/* Animated Connecting Lines */}
                    <svg className="w-full h-64 absolute top-0 left-0" style={{ zIndex: -1 }}>
                      <motion.line 
                        x1="50%" y1="20" x2="50%" y2="100" 
                        stroke="var(--border)" strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                      <motion.line 
                        x1="50%" y1="100" x2="50%" y2="180" 
                        stroke="var(--border)" strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Interface Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <AnimatedSection>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: 'var(--text)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Work Smarter with a Clean and User-Friendly Interface
            </motion.h2>
            <motion.p 
              className="text-lg mb-8 max-w-2xl mx-auto opacity-90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              With an intuitive layout and streamlined design, you can work more efficiently without the hassle of complicated menus.
            </motion.p>
          </AnimatedSection>
          
          {/* Dashboard Mockup */}
          <AnimatedSection>
            <motion.div 
              className="mt-12 max-w-4xl mx-auto rounded-2xl p-8 shadow-2xl"
              style={{ 
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)'
              }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Header */}
              <motion.div 
                className="flex justify-between items-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="font-bold text-lg">PASH Dashboard</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((dot) => (
                    <motion.div
                      key={dot}
                      className="w-8 h-8 rounded-full bg-gray-300"
                      whileHover={{ scale: 1.2 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: dot * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Participants Grid */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
              >
                {[
                  { name: 'Olivia Fiona', email: 'oliviona@gmail.com', role: 'Host' },
                  { name: 'Dani Noer', email: 'daninoer@gmail.com', role: 'Participant' },
                  { name: 'Dave Crea', email: 'davecre4@gmail.com', role: 'Participant' },
                  { name: 'Ruth Haliza', email: 'ruthaliza21@gmail.com', role: 'Participant' }
                ].map((person, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center"
                    variants={scaleIn}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-semibold border-4 border-white shadow-lg"
                      style={{ backgroundColor: 'var(--accent)' }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </motion.div>
                    <p className="font-medium text-sm">{person.name}</p>
                    <p className="text-xs opacity-70 truncate">{person.email}</p>
                    <motion.span 
                      className="inline-block px-2 py-1 text-xs rounded-full mt-1"
                      style={{ 
                        backgroundColor: person.role === 'Host' ? 'var(--primary)' : 'var(--border)',
                        color: person.role === 'Host' ? 'white' : 'var(--text)'
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {person.role}
                    </motion.span>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Invite Section */}
              <motion.div 
                className="text-center p-6 rounded-lg"
                style={{ backgroundColor: 'var(--card)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-sm font-medium mb-3">Invite Guests</p>
                <div className="flex gap-2 justify-center items-center">
                  <motion.div 
                    className="px-4 py-2 rounded-lg font-mono text-sm border"
                    style={{ 
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)'
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    crean.ce/XHJ293ZH
                  </motion.div>
                  <motion.button 
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: 'var(--primary)' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Copy
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatedSection>
          
          <AnimatedSection>
            <Link href="/features">
              <motion.button 
                className="mt-8 px-6 py-3 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'var(--background)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: 'var(--text)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Portfolios of cases
            </motion.h2>
            <motion.h3 
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--primary)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Featured Case Study
            </motion.h3>
          </AnimatedSection>
          
          <motion.div 
            className="grid md:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {[
              {
                title: "New Member",
                subtitle: "Started with Zero Experience",
                description: "A new member joined PASH.CLUB with no background in online business or marketing.",
                gradient: "from-blue-400 to-cyan-500",
                icon: "👤"
              },
              {
                title: "Fastest Income Stream", 
                subtitle: "Earned Within Days",
                description: "By following our simple 1-Up system and training, they made their first $100 in just a few days.",
                gradient: "from-green-400 to-emerald-500",
                icon: "💰"
              },
              {
                title: "Weekly Earnings",
                subtitle: "Consistent Progress", 
                description: "With regular effort and the support of our tools, weekly earnings became steady",
                gradient: "from-yellow-400 to-orange-500",
                icon: "📈"
              },
              {
                title: "Collaborative Culture",
                subtitle: "Helping Others Grow",
                description: "Now, they actively share the opportunity and help others achieve similar results.",
                gradient: "from-purple-400 to-pink-500",
                icon: "🤝"
              }
            ].map((caseItem, index) => (
              <AnimatedCard key={index} delay={index * 0.1}>
                <motion.div 
                  className="text-center p-6 rounded-xl h-full group cursor-pointer"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)'
                  }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Image Placeholder */}
                  <motion.div 
                    className={`w-full h-32 rounded-lg mb-4 bg-gradient-to-r ${caseItem.gradient} flex items-center justify-center relative overflow-hidden`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.span 
                      className="text-white font-bold text-4xl"
                      whileHover={{ scale: 1.2 }}
                    >
                      {caseItem.icon}
                    </motion.span>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </motion.div>
                  
                  <motion.h4 
                    className="font-bold text-lg mb-2"
                    style={{ color: 'var(--text)' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {caseItem.title}
                  </motion.h4>
                  <motion.p 
                    className="text-sm font-semibold mb-3 opacity-80"
                    whileHover={{ scale: 1.02 }}
                  >
                    {caseItem.subtitle}
                  </motion.p>
                  <motion.p 
                    className="text-sm opacity-70"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.7 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {caseItem.description}
                  </motion.p>
                </motion.div>
              </AnimatedCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <AnimatedSection>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: 'var(--text)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Take The First Step Toward A Life of Freedom, Purpose, and Elevation.
            </motion.h2>
            <motion.p 
              className="text-lg mb-12 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Follow these simple steps to join now
            </motion.p>
          </AnimatedSection>
          
          <motion.div 
            className="grid md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
          >
            {[
              { step: "Visit the Registration Page", color: "from-blue-500 to-cyan-600", icon: "🌐" },
              { step: "Fill Out the Registration Form", color: "from-purple-500 to-pink-600", icon: "📝" },
              { step: "Verify Your Email", color: "from-green-500 to-emerald-600", icon: "✉️" },
              { step: "Complete Your Profile", color: "from-orange-500 to-red-600", icon: "✅" }
            ].map((item, index) => (
              <AnimatedCard key={index} delay={index * 0.2}>
                <div className="text-center">
                  {/* Step Image Placeholder */}
                  <motion.div 
                    className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg border-8 border-white relative overflow-hidden group`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.span
                      className="text-3xl"
                      whileHover={{ scale: 1.2 }}
                    >
                      {item.icon}
                    </motion.span>
                    <motion.div 
                      className="absolute -inset-4 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"
                    />
                  </motion.div>
                  <motion.h3 
                    className="font-semibold text-lg mb-2"
                    style={{ color: 'var(--text)' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.step}
                  </motion.h3>
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold mx-auto mt-2"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--background)' }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {index + 1}
                  </motion.div>
                </div>
              </AnimatedCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: 'var(--text)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Real Stories from Our Satisfied Clients
            </motion.h2>
            <motion.p 
              className="text-lg text-center mb-8 opacity-90 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Experience the real-world impact of our platform through user insights
            </motion.p>
          </AnimatedSection>
          
          <AnimatedSection>
            <motion.div 
              className="max-w-3xl mx-auto rounded-2xl p-8 relative overflow-hidden group"
              style={{ 
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Floating elements */}
              <motion.div
                className="absolute top-4 right-4 w-6 h-6 rounded-full opacity-20"
                style={{ backgroundColor: 'var(--primary)' }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Client Photo Placeholder */}
              <motion.div 
                className="flex items-center gap-6 mb-6"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  JI
                </motion.div>
                <div>
                  <div className="font-semibold text-lg">Jessya Inn</div>
                  <div className="opacity-70">New Affiliate Partner</div>
                </div>
              </motion.div>
              
              <motion.p 
                className="text-lg italic mb-6 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                "I tried other platforms before, but nothing clicked. With PASH.CLUB, I made my first sale 
                within days. The 1-Up system really works, and the direct payments are a game-changer."
              </motion.p>
              
              {/* Success Metrics */}
              <motion.div 
                className="grid grid-cols-3 gap-4 mt-6"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
              >
                {[
                  { value: "$100", label: "First Commission" },
                  { value: "3 days", label: "Time to Earn" },
                  { value: "5", label: "Team Members" }
                ].map((metric, index) => (
                  <motion.div 
                    key={index}
                    variants={scaleIn}
                    className="text-center p-4 rounded-lg group cursor-pointer"
                    style={{ backgroundColor: 'var(--background)' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="font-bold text-lg mb-1"
                      style={{ color: 'var(--primary)' }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {metric.value}
                    </motion.div>
                    <div className="text-xs opacity-70">{metric.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section 
        className="py-20 text-center relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
        }}
      >
        {/* Animated Background Pattern */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white opacity-10"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white opacity-10"
          animate={{
            y: [0, 25, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white opacity-10"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <AnimatedSection>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Start Collaborating Today with Pash Club
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 text-white opacity-90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join now and experience effortless video meetings, seamless file sharing, and powerful collaboration tools.
            </motion.p>
          </AnimatedSection>
          
          {/* App Screenshot Placeholder */}
          <AnimatedSection>
            <motion.div 
              className="mb-8 max-w-2xl mx-auto"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-white/20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="bg-white rounded-lg p-4 shadow-lg">
                  <motion.div 
                    className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded flex items-center justify-center relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.span 
                      className="text-white font-bold text-lg"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      App Interface Preview
                    </motion.span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection>
            <Link href="/signup">
              <motion.button 
                className="px-8 py-4 font-bold rounded-lg transition-all duration-300 hover:shadow-xl text-lg"
                style={{ 
                  backgroundColor: 'var(--background)',
                  color: 'var(--primary)'
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 10px 30px rgba(0,0,0,0.2)",
                    "0 15px 40px rgba(0,0,0,0.3)",
                    "0 10px 30px rgba(0,0,0,0.2)"
                  ]
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                Get Started
              </motion.button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  );
}