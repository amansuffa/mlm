"use client";
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

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative py-20 text-center overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
        }}
      >
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-10 left-10 w-24 h-24 rounded-full bg-white opacity-10"
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
          className="absolute bottom-20 right-20 w-20 h-20 rounded-full bg-white opacity-10"
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
          className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white opacity-10"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Contact <span className="text-yellow-300">PASH</span>.CLUB
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We're here to help!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-20 h-1 bg-yellow-300 mx-auto rounded-full mt-4"
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-6">
          {/* Welcome Section */}
          <AnimatedSection className="text-center mb-16">
            <motion.div
              className="inline-block mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                💬
              </div>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              className="max-w-4xl mx-auto space-y-6"
            >
              <motion.p variants={fadeInUp} className="text-xl leading-relaxed opacity-90">
                Whether you have questions about your membership, need technical support, or simply want to learn more about PASH.CLUB, our team is always ready to assist you.
              </motion.p>
            </motion.div>
          </AnimatedSection>

          {/* Contact Methods Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Email Support */}
            <AnimatedCard>
              <motion.div 
                className="rounded-2xl p-8 h-full group cursor-pointer"
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
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    style={{ backgroundColor: 'var(--primary)' }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    📩
                  </motion.div>
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                    Email Support
                  </h2>
                </div>
                
                <motion.div
                  variants={staggerContainer}
                  className="space-y-4"
                >
                  <motion.p variants={fadeInUp} className="opacity-90 leading-relaxed">
                    For all general inquiries, membership questions, or account assistance:
                  </motion.p>
                  
                  <motion.div 
                    variants={fadeInUp}
                    className="flex items-center gap-3 p-4 rounded-xl group hover:shadow-lg transition-all duration-300"
                    style={{ backgroundColor: 'var(--background)' }}
                  >
                    <motion.div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: 'var(--primary)' }}
                      whileHover={{ scale: 1.2 }}
                    >
                      ➡
                    </motion.div>
                    <motion.a 
                      href="mailto:info@pash.club"
                      className="text-lg font-semibold hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--primary)' }}
                      whileHover={{ x: 5 }}
                    >
                      info@pash.club
                    </motion.a>
                  </motion.div>
                  
                  <motion.p variants={fadeInUp} className="opacity-90 leading-relaxed font-semibold">
                    Our support team replies within 24–48 hours.
                  </motion.p>
                </motion.div>
              </motion.div>
            </AnimatedCard>

            {/* Business Addresses */}
            <AnimatedCard delay={0.2}>
              <motion.div 
                className="rounded-2xl p-8 h-full group cursor-pointer"
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
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    style={{ backgroundColor: 'var(--primary)' }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    🏢
                  </motion.div>
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                    Official Business Addresses
                  </h2>
                </div>
                
                <motion.div
                  variants={staggerContainer}
                  className="space-y-6"
                >
                  {/* US Address */}
                  <motion.div 
                    variants={fadeInUp}
                    className="p-4 rounded-xl group hover:shadow-lg transition-all duration-300"
                    style={{ backgroundColor: 'var(--background)' }}
                  >
                    <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--text)' }}>
                      PASH CLUB LLC
                    </h3>
                    <div className="space-y-1 text-sm opacity-90">
                      <p>1209 MOUNTAIN ROAD PL NE #7943</p>
                      <p>ALBUQUERQUE, NM 87110, USA</p>
                      <motion.p 
                        className="text-xs mt-2 p-2 rounded-lg inline-block"
                        style={{ 
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          opacity: '0.8'
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        Official registered business address in New Mexico
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Canada Address */}
                  <motion.div 
                    variants={fadeInUp}
                    className="p-4 rounded-xl group hover:shadow-lg transition-all duration-300"
                    style={{ backgroundColor: 'var(--background)' }}
                  >
                    <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--text)' }}>
                      Canada Office (Operations & Management)
                    </h3>
                    <div className="space-y-1 text-sm opacity-90">
                      <p>PASH CLUB LLC</p>
                      <p>35 SHOREHAM DR</p>
                      <p>TORONTO, ONTARIO</p>
                      <p>M3N 1S5, Canada</p>
                      <motion.p 
                        className="text-xs mt-2 p-2 rounded-lg inline-block"
                        style={{ 
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          opacity: '0.8'
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        Operations, management, and member services
                      </motion.p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatedCard>
          </div>

          {/* Commitment Section */}
          <AnimatedSection>
            <motion.div 
              className="rounded-2xl p-10 text-center relative overflow-hidden group"
              style={{ 
                backgroundColor: 'var(--card)',
                border: '2px solid var(--primary)'
              }}
              whileHover={{ scale: 1.01 }}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <motion.div
                  className="absolute top-10 left-10 w-20 h-20 rounded-full"
                  style={{ backgroundColor: 'var(--primary)' }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-10 right-10 w-16 h-16 rounded-full"
                  style={{ backgroundColor: 'var(--primary)' }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
              </div>

              <div className="flex items-center gap-4 mb-8 justify-center">
                <motion.div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: 'var(--primary)' }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  🌍
                </motion.div>
                <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                  We're Here for You
                </h2>
              </div>
              
              <motion.div
                variants={staggerContainer}
                className="max-w-3xl mx-auto space-y-6 relative z-10"
              >
                <motion.p variants={fadeInUp} className="text-xl leading-relaxed opacity-90">
                  At PASH.CLUB, communication and transparency are at the heart of everything we do.
                </motion.p>
                <motion.p variants={fadeInUp} className="text-lg leading-relaxed opacity-90">
                  If you have feedback, suggestions, or partnership inquiries, feel free to reach out — we appreciate hearing from our community.
                </motion.p>
                
                {/* Contact Features */}
                <motion.div 
                  className="grid md:grid-cols-3 gap-4 mt-8"
                  variants={staggerContainer}
                >
                  {[
                    {
                      icon: "💡",
                      title: "Quick Response",
                      description: "24-48 hour reply time"
                    },
                    {
                      icon: "🛠️",
                      title: "Technical Support",
                      description: "Expert assistance"
                    },
                    {
                      icon: "🤝",
                      title: "Partnerships",
                      description: "Business inquiries"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      variants={scaleIn}
                      className="text-center p-4 rounded-xl group cursor-pointer"
                      style={{ backgroundColor: 'var(--background)' }}
                      whileHover={{ y: -5, scale: 1.05 }}
                    >
                      <motion.div 
                        className="text-3xl mb-3"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <h4 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>
                        {feature.title}
                      </h4>
                      <p className="text-sm opacity-80">{feature.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatedSection>

          {/* Quick Action Cards */}
          <AnimatedSection>
            <motion.div 
              className="mt-16 grid md:grid-cols-2 gap-6"
              variants={staggerContainer}
            >
              {/* FAQ Card */}
              <AnimatedCard delay={0.1}>
                <motion.div 
                  className="rounded-2xl p-6 h-full group cursor-pointer"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)'
                  }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                      style={{ backgroundColor: 'var(--primary)' }}
                      whileHover={{ scale: 1.1 }}
                    >
                      ❓
                    </motion.div>
                    <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>
                      Frequently Asked Questions
                    </h3>
                  </div>
                  <p className="opacity-80 mb-4">
                    Find quick answers to common questions about membership, payments, and more.
                  </p>
                  <motion.button
                    className="w-full py-3 rounded-xl font-semibold transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: 'white'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Visit FAQ
                  </motion.button>
                </motion.div>
              </AnimatedCard>

              {/* Community Card */}
              <AnimatedCard delay={0.2}>
                <motion.div 
                  className="rounded-2xl p-6 h-full group cursor-pointer"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)'
                  }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                      style={{ backgroundColor: 'var(--primary)' }}
                      whileHover={{ scale: 1.1 }}
                    >
                      👥
                    </motion.div>
                    <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>
                      Join Our Community
                    </h3>
                  </div>
                  <p className="opacity-80 mb-4">
                    Connect with other members and get support from our growing community.
                  </p>
                  <motion.button
                    className="w-full py-3 rounded-xl font-semibold transition-all duration-300 border"
                    style={{ 
                      borderColor: 'var(--primary)',
                      color: 'var(--primary)',
                      backgroundColor: 'transparent'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: 'var(--primary)',
                      color: 'white'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Join Community
                  </motion.button>
                </motion.div>
              </AnimatedCard>
            </motion.div>
          </AnimatedSection>

          {/* Final CTA */}
          <AnimatedSection>
            <motion.div 
              className="mt-16 rounded-2xl p-12 text-center relative overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
              }}
              whileHover={{ scale: 1.005 }}
            >
              {/* Floating elements */}
              <motion.div
                className="absolute top-6 left-6 w-4 h-4 rounded-full opacity-20 bg-white"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-8 right-8 w-6 h-6 rounded-full opacity-20 bg-white"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />

              <motion.h2 
                className="text-3xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Ready to Get Started?
              </motion.h2>
              <motion.p 
                className="text-white text-opacity-90 text-lg mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Join thousands of members who are already building their financial freedom with PASH.CLUB
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.button
                  className="px-8 py-4 font-bold rounded-lg transition-all duration-300 hover:shadow-xl text-lg"
                  style={{ 
                    backgroundColor: 'white',
                    color: 'var(--primary)'
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join Now
                </motion.button>
                <motion.button
                  className="px-8 py-4 font-bold rounded-lg transition-all duration-300 hover:shadow-xl text-lg border-2 border-white text-white"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    backgroundColor: 'white',
                    color: 'var(--primary)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}