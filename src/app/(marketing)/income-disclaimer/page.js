"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "../../../contexts/RefContext";
import { 
  AlertCircle, 
  DollarSign, 
  Shield, 
  TrendingUp,
  ChevronRight,
  CheckCircle,
  Download,
  Printer,
  ArrowRight,
  Mail,
  Scale,
  Award,
  Users,
  Briefcase,
  Clock,
  Target,
  BarChart,
  Info,
  FileWarning,
  Handshake,
  Eye,
  MessageCircle
} from "lucide-react";
import Link from "next/link";


// Animation variants (matching hero component)
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

// Animation Components (matching hero component)
function AnimatedSection({ children, className = "", delay = 0 }) {
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
      transition={{ duration: 0.6, delay }}
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

export default function IncomeDisclaimer() {
  const { getUrlWithRef } = useRef();

  const disclaimerSections = [
    {
      id: "purpose",
      icon: Info,
      title: "Purpose of This Disclaimer",
      content: [
        "PASH CLUB LLC provides digital tools, training, marketing resources, and a member-to-member system designed to help individuals learn online marketing strategies.",
        "We do not guarantee any financial results. Any income examples, testimonials, or success stories shared on our website, social media, or marketing materials are for illustration purposes only and should not be interpreted as typical, guaranteed, or promised results."
      ]
    },
    {
      id: "factors",
      icon: Target,
      title: "Your Earning Potential Depends On:",
      list: [
        "Your skills",
        "Your effort and consistency",
        "Your personal work ethic",
        "Your marketing strategies",
        "Your ability to follow the training",
        "Market conditions outside our control"
      ]
    },
    {
      id: "no-guarantees",
      icon: AlertCircle,
      title: "No Income Guarantees",
      content: [
        "We do not guarantee that you will earn any income at all. We do not guarantee that past results or testimonials reflect what you may achieve. Individual results vary widely, and some members may earn little or nothing."
      ]
    },
    {
      id: "no-advice",
      icon: Scale,
      title: "No Financial or Business Advice",
      content: [
        "PASH CLUB LLC does not provide financial advice, business advice, or investment advice. You are solely responsible for your decisions, actions, and results."
      ]
    },
    {
      id: "acknowledgment",
      icon: Handshake,
      title: "Your Acknowledgment",
      content: [
        "By using this website or participating in the PASH CLUB LLC system, you acknowledge that:"
      ],
      list: [
        "There are risks involved in any business activity",
        "Success requires effort, commitment, and ongoing learning",
        "No earnings or outcomes are promised"
      ]
    }
  ];

  const importantPoints = [
    {
      icon: DollarSign,
      title: "No Income Guarantee",
      description: "Results vary by individual effort"
    },
    {
      icon: TrendingUp,
      title: "Testimonials Not Typical",
      description: "Success stories are for illustration only"
    },
    {
      icon: Users,
      title: "Individual Results Vary",
      description: "Some earn little or nothing"
    },
    {
      icon: Briefcase,
      title: "You Are Responsible",
      description: "For your own decisions and actions"
    }
  ];

  const relatedDocuments = [
    { name: "Terms & Conditions", href: "/terms", icon: FileWarning },
    { name: "Privacy Policy", href: "/privacy", icon: Shield },
    { name: "Payment & Refund Policy", href: "/payment-policy", icon: DollarSign },
    { name: "Partner Program", href: "/partner-program", icon: Users }
  ];

  return (
    <>
      
      {/* Hero Section */}
      <section className="min-h-[40vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0" 
          style={{ 
            backgroundColor: 'var(--primary)',
            opacity: 0.05
          }}
        />
        
        <div className="relative z-10 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" 
                style={{ 
                  backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)',
                  border: '1px solid rgba(var(--primary-rgb, 59, 130, 246), 0.2)',
                  color: 'var(--text)'
                }}>
                <AlertCircle className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="text-sm font-medium">Important Legal Notice</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                Income Disclaimer
              </h1>
              
              <p className="text-xl opacity-90 mb-2" style={{ color: 'var(--text)' }}>
                PASH CLUB LLC
              </p>
              
              <p className="text-lg opacity-80 mb-8" style={{ color: 'var(--text)' }}>
                Last Updated: December 2025
              </p>
              
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.print()}
                  className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)'
                  }}
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </motion.button>
                
                <motion.a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const content = document.getElementById('disclaimer-content')?.innerText;
                    if (content) {
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'pash-club-income-disclaimer.txt';
                      a.click();
                    }
                  }}
                  className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronRight className="w-6 h-6 opacity-50 transform rotate-90" style={{ color: 'var(--text)' }} />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section id="disclaimer-content" className="py-12" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Important Points Grid */}
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
              {importantPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="p-4 rounded-xl text-center"
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)'
                  }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <point.icon className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--primary)' }} />
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{point.title}</h3>
                  <p className="text-xs opacity-70 mt-1" style={{ color: 'var(--text)' }}>{point.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* Main Disclaimer Card - Prominent */}
          <AnimatedSection delay={0.15}>
            <div 
              className="rounded-2xl p-8 mb-12"
              style={{
                backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.05)',
                border: '2px solid var(--primary)'
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }}>
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                    Read This Carefully
                  </h2>
                  <p className="text-lg leading-relaxed font-medium" style={{ color: 'var(--text)' }}>
                    PASH CLUB LLC provides digital tools, training, marketing resources, and a member-to-member system designed to help individuals learn online marketing strategies. We do not guarantee any financial results.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Disclaimer Sections */}
          <div className="space-y-6">
            {disclaimerSections.map((section, index) => (
              <AnimatedCard key={section.id} delay={index * 0.1 + 0.2}>
                <motion.div 
                  className="rounded-2xl p-8 transition-all duration-300 hover:shadow-lg"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)'
                  }}
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)' }}
                    >
                      <section.icon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                        {section.title}
                      </h2>
                      
                      {section.content && (
                        <div className="space-y-3">
                          {section.content.map((item, i) => (
                            <p key={i} className="opacity-80 leading-relaxed" style={{ color: 'var(--text)' }}>
                              {item}
                            </p>
                          ))}
                        </div>
                      )}

                      {section.list && (
                        <ul className="space-y-2 mt-2">
                          {section.list.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                              <span className="opacity-80" style={{ color: 'var(--text)' }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>

          {/* Key Emphasis Box */}
          <AnimatedSection delay={0.6}>
            <div 
              className="rounded-2xl p-8 my-12"
              style={{
                backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.03)',
                border: '1px solid var(--border)'
              }}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <BarChart className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span>What This Means For You</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <TrendingUp className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    Results Are Individual
                  </h3>
                  <p className="text-sm opacity-80 leading-relaxed" style={{ color: 'var(--text)' }}>
                    Your results will be unique to you. They depend on your skills, effort, consistency, and many other personal factors.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <Shield className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    No Promises Made
                  </h3>
                  <p className="text-sm opacity-80 leading-relaxed" style={{ color: 'var(--text)' }}>
                    We make no promises about earnings. Any income examples shown are not typical and should not be expected.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <Users className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    Testimonials Vary
                  </h3>
                  <p className="text-sm opacity-80 leading-relaxed" style={{ color: 'var(--text)' }}>
                    Success stories represent individual experiences and may not reflect what you'll achieve.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <Briefcase className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    Your Responsibility
                  </h3>
                  <p className="text-sm opacity-80 leading-relaxed" style={{ color: 'var(--text)' }}>
                    You are solely responsible for your decisions, actions, and results when using our platform.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Acknowledgment Statement */}
          <AnimatedSection delay={0.7}>
            <div 
              className="rounded-2xl p-8 text-center"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <Award className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--primary)' }} />
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                By Using PASH CLUB LLC, You Acknowledge:
              </h2>
              <div className="space-y-2 max-w-2xl mx-auto">
                <p className="opacity-80" style={{ color: 'var(--text)' }}>
                  ✓ There are risks involved in any business activity
                </p>
                <p className="opacity-80" style={{ color: 'var(--text)' }}>
                  ✓ Success requires effort, commitment, and ongoing learning
                </p>
                <p className="opacity-80" style={{ color: 'var(--text)' }}>
                  ✓ No earnings or outcomes are promised
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Related Documents */}
          <AnimatedSection delay={0.8}>
            <div 
              className="rounded-2xl p-8 my-12"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--text)' }}>
                Related Legal Documents
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedDocuments.map((doc, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={getUrlWithRef(doc.href)}
                      className="flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300"
                      style={{ 
                        backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.03)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <doc.icon className="w-6 h-6 mb-2" style={{ color: 'var(--primary)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{doc.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Section */}
          <AnimatedSection delay={0.9}>
            <div 
              className="rounded-2xl p-8 text-center"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                Questions About This Disclaimer?
              </h2>
              
              <p className="opacity-80 mb-6" style={{ color: 'var(--text)' }}>
                If you have questions about this income disclaimer, please contact us:
              </p>
              
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a 
                    href="mailto:info@pash.club"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: 'white'
                    }}
                  >
                    <Mail className="w-4 h-4" />
                    <span>info@pash.club</span>
                  </a>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={getUrlWithRef("/contact")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--cardSecondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)'
                    }}
                  >
                    <span>Contact</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>

          {/* Footer Note */}
          <AnimatedSection delay={1.0}>
            <p className="text-sm opacity-60 text-center mt-12" style={{ color: 'var(--text)' }}>
              Last Updated: December 2025 • PASH CLUB LLC
            </p>
          </AnimatedSection>
        </div>
      </section>
      
    </>
  );
}