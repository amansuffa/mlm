"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import pashaImage from "../../../assets/pasha.png";

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

export default function AboutPage() {
  return (
    <>
      {/* Hero Section with Parallax Effect */}
      <section 
        className="relative py-20 text-center overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
        }}
      >
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white opacity-10"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-16 h-16 rounded-full bg-white opacity-10"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-12 h-12 rounded-full bg-white opacity-10"
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
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About <span className="text-yellow-300">PASH</span>.CLUB
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white opacity-90 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Built for Freedom, Designed for Real People
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-20 h-1 bg-yellow-300 mx-auto rounded-full"
          />
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-6">
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
                👋
              </div>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              className="max-w-4xl mx-auto space-y-6"
            >
              <motion.p variants={fadeInUp} className="text-xl leading-relaxed opacity-90">
                Welcome to PASH.CLUB, a global digital platform created to help everyday people unlock financial independence through simple, transparent, and proven online systems.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-xl leading-relaxed opacity-90">
                Founded by Pasha Rana, a respected entrepreneur and six-figure online earner, PASH.CLUB represents more than just a business model — it represents hope, opportunity, and a new beginning for anyone ready to take control of their financial future.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-xl leading-relaxed opacity-90">
                With over 12+ years in business, Pasha Rana has dedicated his life to learning, building, failing, succeeding, and ultimately mastering the online income world. Today, that experience is transformed into one powerful ecosystem: PASH.CLUB.
              </motion.p>
            </motion.div>
          </AnimatedSection>

          {/* Story Section */}
          <AnimatedSection>
            <motion.div 
              className="rounded-2xl p-8 mb-16 relative overflow-hidden group"
              style={{ 
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-bl-full" />
              
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  style={{ backgroundColor: 'var(--primary)' }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  ⭐
                </motion.div>
                <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                  Our Story: From a One-Man Dream to a Global Community
                </h2>
              </div>
              
              <motion.div
                variants={staggerContainer}
                className="space-y-4 relative z-10"
              >
                <motion.p variants={fadeInUp} className="opacity-90 leading-relaxed text-lg">
                  Every successful brand begins with a story — ours is rooted in resilience, belief, and the desire to create a better life.
                </motion.p>
                <motion.p variants={fadeInUp} className="opacity-90 leading-relaxed">
                  In 2013, Pasha Rana started his entrepreneurial journey with nothing but determination. No investors. No secret connections. Just a vision of building a life beyond limitations and helping others do the same.
                </motion.p>
                <motion.p variants={fadeInUp} className="opacity-90 leading-relaxed">
                  The early years were challenging — failed businesses, bad programs, trial-and-error, and moments where quitting felt easier. But through every setback, Pasha Rana kept learning. He kept improving.
                </motion.p>
                <motion.p variants={fadeInUp} className="opacity-90 leading-relaxed mt-6 font-semibold text-lg border-l-4 pl-4"
                  style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--primary)/10' }}
                >
                  That journey — the struggle, the hope, the breakthroughs — became the foundation of PASH.CLUB.
                </motion.p>
              </motion.div>
            </motion.div>
          </AnimatedSection>

          {/* What We Stand For */}
          <AnimatedSection>
            <div className="flex items-center gap-4 mb-8">
              <motion.div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: 'var(--primary)' }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                ⭐
              </motion.div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                What PASH.CLUB Stands For
              </h2>
            </div>
            
            <motion.div 
              className="rounded-2xl p-8 mb-12 text-center relative overflow-hidden group"
              style={{ 
                backgroundColor: 'var(--card)',
                border: '2px solid var(--primary)'
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              <motion.p 
                className="text-2xl font-bold mb-6 leading-tight"
                style={{ color: 'var(--primary)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                &ldquo;To provide real people with a real system to build real income — without confusion, pressure, or false promises.&rdquo;
              </motion.p>
              
              <motion.div
                variants={staggerContainer}
                className="space-y-4 relative z-10"
              >
                <motion.p variants={fadeInUp} className="opacity-90 leading-relaxed text-lg">
                  Our platform blends automation, education, digital products, and community-driven support, making it easier for members to start, grow, and scale their online earnings.
                </motion.p>
                <motion.p variants={fadeInUp} className="opacity-90 leading-relaxed">
                  We are proud to operate professionally and transparently as a registered US LLC, with an additional office in Toronto, Canada to support our global operations.
                </motion.p>
              </motion.div>
            </motion.div>
          </AnimatedSection>

          {/* Why Trust Us */}
          <AnimatedSection>
            <div className="flex items-center gap-4 mb-8">
              <motion.div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                ⭐
              </motion.div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                Why People Trust Us
              </h2>
            </div>
            
            <motion.div 
              className="grid md:grid-cols-2 gap-6 mb-16"
              variants={staggerContainer}
            >
              {[
                {
                  icon: "🔒",
                  text: "Transparent business structure - Registered US LLC + Canadian office + clear, legal compliance."
                },
                {
                  icon: "💳",
                  text: "Clear one-time membership model - Simple, fair, straightforward — no tricky monthly fees."
                },
                {
                  icon: "🚀",
                  text: "Built by someone who&apos;s been through the journey - Pasha Rana knows the struggle personally."
                },
                {
                  icon: "🤝",
                  text: "A supportive, value-driven environment - We give you community, mentorship, and growth."
                },
                {
                  icon: "🎯",
                  text: "Designed for beginners & professionals alike - The PASH.CLUB system adapts to you."
                }
              ].map((item, index) => (
                <AnimatedCard key={index} delay={index * 0.1}>
                  <motion.div 
                    className="flex items-start gap-4 p-6 rounded-xl h-full group cursor-pointer"
                    style={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)'
                    }}
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div 
                      className="text-2xl flex-shrink-0 mt-1"
                      whileHover={{ scale: 1.2 }}
                    >
                      {item.icon}
                    </motion.div>
                    <span className="opacity-90 leading-relaxed">{item.text}</span>
                  </motion.div>
                </AnimatedCard>
              ))}
            </motion.div>
          </AnimatedSection>

          {/* Founder Section */}
          <AnimatedSection>
            <motion.div 
              className="rounded-2xl p-10 mb-16 text-center relative overflow-hidden group"
              style={{ 
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
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

              <div className="flex flex-col items-center mb-8">
                <motion.div
                  className="w-48 h-48 rounded-full overflow-hidden mb-6 relative"
                  style={{ border: '4px solid var(--primary)' }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={pashaImage}
                    alt="Pasha Rana"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                  About the Founder: Pasha Rana
                </h2>
                <motion.p 
                  className="text-xl font-semibold opacity-90"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  Entrepreneur | Mentor | Visionary | 6-Figure Earner
                </motion.p>
              </div>
              
              <motion.div
                variants={staggerContainer}
                className="max-w-3xl mx-auto space-y-6 relative z-10"
              >
                <motion.p variants={fadeInUp} className="opacity-90 leading-relaxed text-lg">
                  For over a decade, Pasha Rana has worked in affiliate marketing, digital products, and online business systems. His strength lies in simplifying complex strategies so anyone — regardless of background — can start earning online.
                </motion.p>
                
                {/* Founder Beliefs */}
                <motion.div 
                  className="mt-8 p-6 rounded-xl"
                  style={{ backgroundColor: 'var(--background)' }}
                  variants={fadeInUp}
                >
                  <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text)' }}>He believes:</h3>
                  <div className="space-y-4 text-left max-w-md mx-auto">
                    {[
                      "Opportunities should be accessible to everyone.",
                      "Success should not depend on your location or background.",
                      "A supportive community can change someone&apos;s life."
                    ].map((belief, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center gap-4 p-3 rounded-lg group hover:shadow-md transition-shadow"
                        style={{ backgroundColor: 'var(--card)' }}
                        whileHover={{ x: 10 }}
                      >
                        <motion.div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: 'var(--primary)' }}
                          whileHover={{ scale: 1.5 }}
                        />
                        <span className="opacity-90 font-medium">{belief}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                <motion.p 
                  variants={fadeInUp}
                  className="opacity-90 leading-relaxed mt-6 font-semibold text-lg p-4 rounded-xl border-l-4"
                  style={{ 
                    borderColor: 'var(--primary)',
                    backgroundColor: 'var(--primary)/5'
                  }}
                >
                  Pasha Rana built PASH.CLUB so others don&apos;t have to go through the confusion and struggle he faced. His mission is to provide a fair, sustainable pathway for people who want financial independence but don&apos;t know where to start.
                </motion.p>
              </motion.div>
            </motion.div>
          </AnimatedSection>

          {/* Mission, Vision, Values */}
          <AnimatedSection>
            <motion.div 
              className="grid md:grid-cols-3 gap-8 mb-16"
              variants={staggerContainer}
            >
              {[
                {
                  title: "Our Mission",
                  icon: "🎯",
                  content: "To empower individuals around the world with a system that makes online income simple, honest, and achievable — backed by real tools, real training, and real community support.",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  title: "Our Vision", 
                  icon: "🔭",
                  content: "To become the #1 global platform for everyday people seeking financial freedom — by combining innovation, automation, and humanity.",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  title: "Our Values",
                  icon: "❤️",
                  content: [
                    "Integrity: We promise what we deliver",
                    "Transparency: Clear pricing & systems",
                    "Community: We rise by lifting each other",
                    "Innovation: Always improving",
                    "Empowerment: Success for everyone"
                  ],
                  color: "from-red-500 to-orange-500"
                }
              ].map((item, index) => (
                <AnimatedCard key={index} delay={index * 0.2}>
                  <motion.div 
                    className={`rounded-2xl p-6 h-full text-center relative overflow-hidden group bg-gradient-to-br ${item.color} text-white`}
                    whileHover={{ y: -8, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10">
                      <motion.div 
                        className="text-4xl mb-4"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {item.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                      {Array.isArray(item.content) ? (
                        <div className="space-y-2 text-sm text-left">
                          {item.content.map((value, i) => (
                            <motion.div 
                              key={i} 
                              className="flex items-center gap-2"
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <div className="w-1 h-1 bg-white rounded-full" />
                              <span>{value}</span>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed">{item.content}</p>
                      )}
                    </div>
                  </motion.div>
                </AnimatedCard>
              ))}
            </motion.div>
          </AnimatedSection>

          {/* Message from Founder */}
          <AnimatedSection>
            <motion.div 
              className="rounded-2xl p-10 text-center relative overflow-hidden group"
              style={{ 
                backgroundColor: 'var(--card)',
                border: '2px solid var(--primary)'
              }}
              whileHover={{ scale: 1.005 }}
            >
              {/* Floating elements */}
              <motion.div
                className="absolute top-6 left-6 w-4 h-4 rounded-full opacity-20"
                style={{ backgroundColor: 'var(--primary)' }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-8 right-8 w-6 h-6 rounded-full opacity-20"
                style={{ backgroundColor: 'var(--primary)' }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />

              <div className="flex items-center gap-4 mb-8 justify-center">
                <motion.div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  style={{ backgroundColor: 'var(--primary)' }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity 
                  }}
                >
                  ✉️
                </motion.div>
                <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                  A Message From Pasha Rana
                </h2>
              </div>
              
              <motion.div
                className="max-w-2xl mx-auto space-y-6 relative z-10"
                variants={staggerContainer}
              >
                <motion.p variants={fadeInUp} className="opacity-90 leading-relaxed text-lg italic">
                  &ldquo;If you&apos;re reading this, I want to say something from my heart:&rdquo;
                </motion.p>
                
                <motion.p 
                  variants={fadeInUp}
                  className="opacity-90 leading-relaxed text-lg"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  I know what it feels like to want more out of life.
                </motion.p>
                <motion.p 
                  variants={fadeInUp}
                  className="opacity-90 leading-relaxed text-lg"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  I know how hard it is to find something real online.
                </motion.p>
                <motion.p 
                  variants={fadeInUp}
                  className="opacity-90 leading-relaxed text-lg"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  And I know the courage it takes to start.
                </motion.p>
                <motion.p 
                  variants={fadeInUp}
                  className="opacity-90 leading-relaxed text-lg"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  That&apos;s why PASH.CLUB exists — to be your turning point.
                </motion.p>
                <motion.p 
                  variants={fadeInUp}
                  className="opacity-90 leading-relaxed text-lg"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Whether you&apos;re a student, job seeker, stay-at-home parent, business owner, or simply someone who wants change… you&apos;re welcome here.
                </motion.p>

                <motion.div 
                  className="mt-8 p-6 rounded-xl border-l-4"
                  style={{ 
                    borderColor: 'var(--primary)',
                    backgroundColor: 'var(--primary)/5'
                  }}
                  variants={fadeInUp}
                >
                  <motion.p 
                    className="font-semibold text-xl mb-4 space-y-2"
                    style={{ color: 'var(--primary)' }}
                  >
                    <motion.span 
                      className="block"
                      whileHover={{ scale: 1.05 }}
                    >Let&apos;s grow together.</motion.span>
                    <motion.span 
                      className="block"
                      whileHover={{ scale: 1.05 }}
                    >Let&apos;s achieve together.</motion.span>
                    <motion.span 
                      className="block"
                      whileHover={{ scale: 1.05 }}
                    >Let&apos;s build your future — starting today.</motion.span>
                  </motion.p>
                </motion.div>

                <motion.div 
                  className="mt-12 pt-6 border-t"
                  style={{ borderColor: 'var(--border)' }}
                  variants={fadeInUp}
                >
                  <motion.p 
                    className="font-semibold text-xl mb-2"
                    style={{ color: 'var(--text)' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Warm regards,
                  </motion.p>
                  <motion.p 
                    className="font-bold text-2xl mb-1"
                    style={{ color: 'var(--primary)' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Pasha Rana
                  </motion.p>
                  <motion.p 
                    className="opacity-90 text-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    Founder & CEO, PASH.CLUB
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}