"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "../../../contexts/RefContext";
import { 
  FileText, 
  Shield, 
  AlertCircle, 
  Mail,
  ChevronRight,
  CheckCircle,
  Download,
  Printer,
  ArrowRight,
  Clock,
  Scale,
  Gavel,
  BookOpen,
  Users,
  Ban,
  Info,
  MessageCircle,
  MapPin,
  Phone,
  Globe,
  FileWarning,
  CopyCheck,
  Eye,
  PenTool
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

export default function DMCAPolicy() {
  const { getUrlWithRef } = useRef();

  const dmcaSections = [
    {
      id: "reporting",
      icon: FileWarning,
      title: "1. Reporting Copyright Infringement",
      content: [
        "If you believe that your copyrighted work has been copied and is accessible on PASH.CLUB in a way that constitutes copyright infringement, you may submit a written notice to our designated Copyright Agent containing the following information:"
      ],
      requirements: [
        "A physical or electronic signature of the person authorized to act on behalf of the copyright owner.",
        "Identification of the copyrighted work claimed to have been infringed.",
        "Identification of the material that is claimed to be infringing, including information reasonably sufficient to locate the material on PASH.CLUB.",
        "Your contact information, including address, telephone number, and email address.",
        "A statement by you that you have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.",
        "A statement that the information in your notice is accurate, and under penalty of perjury, that you are the copyright owner or authorized to act on their behalf."
      ]
    },
    {
      id: "agent",
      icon: Mail,
      title: "Copyright Agent Contact Information",
      content: [],
      contact: {
        email: "dmca@pash.club",
        address: "PASH.CLUB, [Your Business Address], [City, Country]"
      }
    },
    {
      id: "counter",
      icon: CopyCheck,
      title: "2. Counter-Notification",
      content: [
        "If your content has been removed due to a DMCA notice and you believe it was removed in error, you may submit a counter-notification containing:"
      ],
      requirements: [
        "Your physical or electronic signature.",
        "Identification of the material removed and its location before removal.",
        "A statement under penalty of perjury that you have a good faith belief that the material was removed as a result of mistake or misidentification.",
        "Your name, address, telephone number, and email address.",
        "Consent to the jurisdiction of your local federal district court, or if outside the U.S., any appropriate jurisdiction.",
        "Upon receipt of a valid counter-notification, PASH.CLUB may restore the material unless the original complainant files a legal action against you."
      ]
    },
    {
      id: "repeat",
      icon: Ban,
      title: "3. Repeat Infringers",
      content: [
        "PASH.CLUB reserves the right to terminate accounts of users who are repeat infringers of copyright, in accordance with our Terms of Service."
      ]
    },
    {
      id: "misc",
      icon: Info,
      title: "4. Miscellaneous",
      content: [
        "This policy applies to all users and visitors of PASH.CLUB. PASH.CLUB may modify this DMCA policy at any time without prior notice."
      ]
    }
  ];

  const keyPoints = [
    {
      icon: Gavel,
      title: "DMCA Compliant",
      description: "We follow DMCA regulations"
    },
    {
      icon: Mail,
      title: "DMCA Agent",
      description: "dmca@pash.club"
    },
    {
      icon: Clock,
      title: "24/7 Reporting",
      description: "Submit notices anytime"
    },
    {
      icon: Shield,
      title: "Rights Protected",
      description: "For copyright owners"
    }
  ];

  const relatedDocuments = [
    { name: "Terms & Conditions", href: "/terms", icon: FileText },
    { name: "Privacy Policy", href: "/privacy", icon: Shield },
    { name: "Income Disclaimer", href: "/income-disclaimer", icon: AlertCircle },
    { name: "Payment Policy", href: "/payment-policy", icon: Scale }
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
                <Gavel className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="text-sm font-medium">Digital Millennium Copyright Act</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                DMCA Policy
              </h1>
              
              <p className="text-xl opacity-90 mb-2" style={{ color: 'var(--text)' }}>
                PASH.CLUB
              </p>
              
              <p className="text-lg opacity-80 mb-8" style={{ color: 'var(--text)' }}>
                Effective Date: February 26, 2026
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
                    const content = document.getElementById('dmca-content')?.innerText;
                    if (content) {
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'pash-club-dmca-policy.txt';
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
      <section id="dmca-content" className="py-12" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Key Points Grid */}
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
              {keyPoints.map((point, index) => (
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

          {/* Introduction */}
          <AnimatedSection delay={0.15}>
            <div 
              className="rounded-2xl p-8 mb-12"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text)' }}>
                PASH.CLUB respects the intellectual property rights of others and expects our users to do the same. 
                In accordance with the Digital Millennium Copyright Act (DMCA), PASH.CLUB provides a mechanism 
                for copyright owners to report alleged copyright infringements.
              </p>
            </div>
          </AnimatedSection>

          {/* DMCA Sections */}
          <div className="space-y-6">
            {dmcaSections.map((section, index) => (
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
                      
                      {section.content && section.content.length > 0 && (
                        <div className="space-y-3">
                          {section.content.map((item, i) => (
                            <p key={i} className="opacity-80 leading-relaxed" style={{ color: 'var(--text)' }}>
                              {item}
                            </p>
                          ))}
                        </div>
                      )}

                      {section.requirements && (
                        <ul className="space-y-3 mt-2">
                          {section.requirements.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                              <span className="opacity-80" style={{ color: 'var(--text)' }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.contact && (
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.05)' }}>
                            <Mail className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                            <span className="font-medium" style={{ color: 'var(--text)' }}>Email: </span>
                            <a href={`mailto:${section.contact.email}`} className="hover:underline" style={{ color: 'var(--primary)' }}>
                              {section.contact.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.05)' }}>
                            <MapPin className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                            <span className="font-medium" style={{ color: 'var(--text)' }}>Address: </span>
                            <span className="opacity-80" style={{ color: 'var(--text)' }}>{section.contact.address}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>

          {/* Important Notice */}
          <AnimatedSection delay={0.7}>
            <div 
              className="rounded-2xl p-8 my-12"
              style={{
                backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.03)',
                border: '1px solid var(--border)'
              }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <AlertCircle className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span>Important Notice</span>
              </h2>
              
              <div className="space-y-4">
                <p className="opacity-80" style={{ color: 'var(--text)' }}>
                  The DMCA process is a legal procedure. By submitting a notice or counter-notification, you acknowledge that:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.05)' }}>
                    <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                      <PenTool className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      False Claims
                    </h3>
                    <p className="text-sm opacity-80" style={{ color: 'var(--text)' }}>
                      Knowingly misrepresenting copyright infringement can lead to legal liability.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.05)' }}>
                    <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                      <Users className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      User Rights
                    </h3>
                    <p className="text-sm opacity-80" style={{ color: 'var(--text)' }}>
                      Users have the right to contest claims through counter-notification.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.05)' }}>
                    <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                      <Clock className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      Timely Response
                    </h3>
                    <p className="text-sm opacity-80" style={{ color: 'var(--text)' }}>
                      We aim to respond to all DMCA notices promptly.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.05)' }}>
                    <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                      <Ban className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      Repeat Infringers
                    </h3>
                    <p className="text-sm opacity-80" style={{ color: 'var(--text)' }}>
                      Accounts may be terminated for repeat violations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Quick Reference Card */}
          <AnimatedSection delay={0.8}>
            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--text)' }}>
                DMCA Quick Reference
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <FileWarning className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    To File a Complaint
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <span className="opacity-80" style={{ color: 'var(--text)' }}>Email dmca@pash.club</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <span className="opacity-80" style={{ color: 'var(--text)' }}>Include all required info</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <span className="opacity-80" style={{ color: 'var(--text)' }}>Sign your notice</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <CopyCheck className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    To File a Counter-Notice
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <span className="opacity-80" style={{ color: 'var(--text)' }}>Respond within timeframe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <span className="opacity-80" style={{ color: 'var(--text)' }}>Provide good faith statement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <span className="opacity-80" style={{ color: 'var(--text)' }}>Consent to jurisdiction</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Related Documents */}
          <AnimatedSection delay={0.9}>
            <div 
              className="rounded-2xl p-8 my-12"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--text)' }}>
                Related Policies
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
          <AnimatedSection delay={1.0}>
            <div 
              className="rounded-2xl p-8 text-center"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                Contact Our DMCA Agent
              </h2>
              
              <p className="opacity-80 mb-6" style={{ color: 'var(--text)' }}>
                For all copyright infringement notices and counter-notifications:
              </p>
              
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a 
                    href="mailto:dmca@pash.club"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: 'white'
                    }}
                  >
                    <Mail className="w-5 h-5" />
                    <span>dmca@pash.club</span>
                  </a>
                </motion.div>
                
                <p className="text-sm opacity-60 mt-4" style={{ color: 'var(--text)' }}>
                  Or use our mailing address: PASH.CLUB, [Your Business Address], [City, Country]
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Footer Note */}
          <AnimatedSection delay={1.1}>
            <p className="text-sm opacity-60 text-center mt-12" style={{ color: 'var(--text)' }}>
              Last updated: February 26, 2026 • PASH.CLUB DMCA Policy
            </p>
          </AnimatedSection>
        </div>
      </section>
      
    </>
  );
}