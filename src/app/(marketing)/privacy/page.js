"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "../../../contexts/RefContext";
import { 
  Shield, 
  Mail, 
  Clock, 
  Globe, 
  Lock, 
  Cookie, 
  FileText, 
  AlertCircle,
  ChevronRight,
  CheckCircle,
  Download,
  Printer,
  ArrowRight
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

export default function PrivacyPolicy() {
  const { getUrlWithRef } = useRef();

  const sections = [
    {
      id: "information",
      icon: FileText,
      title: "1. Information We Collect",
      content: [
        "a. Personal Information: Name, email address, phone number, payment details (processed securely via Stripe, PayPal, etc.), account login credentials",
        "b. Non-Personal Information: Device type, browser type, IP address, pages visited, session duration, clicks, and other usage data",
        "c. Information from Third-Party Services: Referral data and affiliate program tracking, marketing interactions (if you opt-in)"
      ]
    },
    {
      id: "usage",
      icon: Globe,
      title: "2. How We Use Your Information",
      content: [
        "Provide access to PASH.CLUB training, tools, and education resources",
        "Manage your membership and payments",
        "Communicate updates, newsletters, and announcements",
        "Improve our platform, products, and services",
        "Detect and prevent fraud or unauthorized access",
        "Comply with legal obligations",
        "We do not sell your personal information to third parties."
      ]
    },
    {
      id: "cookies",
      icon: Cookie,
      title: "3. Cookies and Tracking",
      content: [
        "We use cookies and similar technologies to enhance your experience, analyze site traffic, and provide personalized content. You can manage cookie preferences in your browser settings."
      ]
    },
    {
      id: "sharing",
      icon: Shield,
      title: "4. Sharing Your Information",
      content: [
        "Service providers (payment processors, cloud hosting, analytics tools)",
        "Legal authorities if required by law",
        "Affiliate/partner program tracking platforms",
        "All partners and service providers are contractually obligated to protect your data."
      ]
    },
    {
      id: "rights",
      icon: CheckCircle,
      title: "5. Your Rights",
      content: [
        "Under GDPR (EU Residents): Right to access, correct, or delete your personal data; Right to restrict or object to processing; Right to data portability",
        "Under CCPA (California Residents): Right to know what personal data is collected; Right to request deletion of personal information; Right to opt-out of the sale of personal information (PASH.CLUB does not sell your data); Right to non-discrimination for exercising these rights",
        "To exercise your rights, please contact us at privacy@pash.club."
      ]
    },
    {
      id: "retention",
      icon: Clock,
      title: "6. Data Retention",
      content: [
        "We retain your personal information only as long as necessary to provide services, comply with legal obligations, or resolve disputes. Non-personal and anonymized data may be kept indefinitely for analytics purposes."
      ]
    },
    {
      id: "security",
      icon: Lock,
      title: "7. Data Security",
      content: [
        "We implement industry-standard technical and organizational measures to protect your data from unauthorized access, disclosure, or misuse. This includes encryption, secure servers, and limited internal access."
      ]
    },
    {
      id: "third-party",
      icon: Globe,
      title: "8. Third-Party Links",
      content: [
        "Our platform may contain links to third-party websites. We are not responsible for the privacy practices of those sites. We encourage you to read their privacy policies."
      ]
    },
    {
      id: "children",
      icon: AlertCircle,
      title: "9. Children's Privacy",
      content: [
        "PASH.CLUB is not intended for individuals under 18. We do not knowingly collect personal information from children."
      ]
    },
    {
      id: "updates",
      icon: Clock,
      title: "10. Updates to this Privacy Policy",
      content: [
        "We may update this policy periodically. The 'Effective Date' will reflect the most recent revision. Continued use of PASH.CLUB constitutes acceptance of any updates."
      ]
    }
  ];

  const complianceNotes = [
    "Explicit consent is required for marketing emails and cookies",
    "Users can access, delete, or export their data via account settings or by contacting support",
    "PASH.CLUB does not sell personal data, simplifying CCPA compliance",
    "Data processing agreements should be in place with all service providers"
  ];

  return (
    <>

      
      {/* Hero Section - Simplified */}
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
                <Shield className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="text-sm font-medium">GDPR & CCPA Compliant</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                Privacy Policy
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
                    const content = document.getElementById('privacy-content')?.innerText;
                    if (content) {
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'pash-club-privacy-policy.txt';
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
      <section id="privacy-content" className="py-12" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <AnimatedSection>
            <div 
              className="rounded-2xl p-8 mb-12"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text)' }}>
                PASH.CLUB (“we,” “our,” “us”) respects your privacy and is committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, store, and share your information when you access our platform, 
                services, and tools. It also describes your rights under applicable privacy laws, including the General Data 
                Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
              </p>
            </div>
          </AnimatedSection>

          {/* Policy Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <AnimatedCard key={section.id} delay={index * 0.1}>
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
                      
                      <div className="space-y-3">
                        {section.content.map((item, i) => (
                          <p key={i} className="opacity-80 leading-relaxed" style={{ color: 'var(--text)' }}>
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>

          {/* Compliance Notes */}
          <AnimatedSection delay={0.5}>
            <div 
              className="rounded-2xl p-8 my-12"
              style={{
                backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.05)',
                border: '1px solid var(--border)'
              }}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <Shield className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span>✅ GDPR & CCPA Compliance Notes</span>
              </h2>
              
              <div className="space-y-3">
                {complianceNotes.map((note, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                    <p className="opacity-80" style={{ color: 'var(--text)' }}>{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Section */}
          <AnimatedSection delay={0.6}>
            <div 
              className="rounded-2xl p-8 text-center"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                11. Contact Us
              </h2>
              
              <p className="opacity-80 mb-6" style={{ color: 'var(--text)' }}>
                If you have questions about this Privacy Policy, GDPR, or CCPA compliance, contact us:
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <a 
                    href="mailto:privacy@pash.club" 
                    className="hover:underline"
                    style={{ color: 'var(--primary)' }}
                  >
                    privacy@pash.club
                  </a>
                </div>
           
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={getUrlWithRef("/contact")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 mt-4"
                  style={{ 
                    backgroundColor: 'var(--primary)',
                    color: 'white'
                  }}
                >
                  <span>Contact Support</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Footer Note */}
          <AnimatedSection delay={0.7}>
            <p className="text-sm opacity-60 text-center mt-12" style={{ color: 'var(--text)' }}>
              Last updated: February 26, 2026
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}