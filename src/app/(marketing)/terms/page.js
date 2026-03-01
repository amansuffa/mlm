"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "../../../contexts/RefContext";
import { 
  FileText, 
  Shield, 
  DollarSign, 
  Users, 
  Award, 
  Lock, 
  AlertCircle,
  ChevronRight,
  CheckCircle,
  Download,
  Printer,
  ArrowRight,
  Briefcase,
  CreditCard,
  RefreshCw,
  Ban,
  Scale,
  Clock,
  Mail
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

export default function TermsAndConditions() {
  const { getUrlWithRef } = useRef();

  const sections = [
    {
      id: "overview",
      icon: FileText,
      title: "1. Overview",
      content: [
        "PASH.CLUB is an online platform offering Professional Development Membership, training tools, resources, and an optional Partner Program to help members develop skills and grow their professional network.",
        "These Terms cover the use of all services provided by PASH.CLUB, including educational content, community access, affiliate programs, and related services."
      ]
    },
    {
      id: "membership",
      icon: Users,
      title: "2. Professional Development Membership",
      content: [
        "Membership Fee: One-time payment of $50 for lifetime access to all educational resources, training, tools, dashboards, and community support. Payment is collected securely by PASH.CLUB.",
        "Refund Policy: A 7-day refund period applies from the date of purchase. To request a refund, members must visit our Refund Policy page. After the 7-day period, no refunds will be issued.",
        "Access Rights: Members are granted non-exclusive, non-transferable access to training content and tools. Sharing login credentials or content with third parties is strictly prohibited."
      ]
    },
    {
      id: "partner",
      icon: Award,
      title: "3. Partner Program",
      content: [
        "Program Fee: One-time payment of $500 to participate in the PASH.CLUB Partner Program. Payments are peer-to-peer, meaning PASH.CLUB does not process, handle, or guarantee these transactions.",
        "Refund Policy: Since payments are peer-to-peer, no refunds are provided for the $500 Partner Program fee. Participants are responsible for confirming payment arrangements independently.",
        "Program Benefits: Access to partner resources, community, and support to grow your business or network. Commissions or earnings are earned through the PASH.CLUB system, based on referred members' activities. Grants you the opportunity to receive instant 100% partner contributions from your future participants."
      ]
    },
    {
      id: "affiliate",
      icon: Briefcase,
      title: "4. Affiliate Terms",
      content: [
        "Eligibility: Only registered members of PASH.CLUB with an active Professional Development Membership or Partner Program enrollment can participate in the affiliate program.",
        "Earnings: Affiliates earn commissions as outlined in the PASH.CLUB Partner Program and referral system. Commissions are paid directly to affiliates by the members they recruit, according to our system.",
        "Prohibited Practices: Fraudulent activity, false claims, spamming, or misrepresentation of PASH.CLUB services is strictly prohibited. Violation may result in termination of affiliate rights and forfeiture of commissions."
      ]
    },
    {
      id: "payments",
      icon: CreditCard,
      title: "5. Payments",
      content: [
        "Professional Development Membership: Processed securely by PASH.CLUB using supported payment methods.",
        "Partner Program: Peer-to-peer payments are arranged directly between members. PASH.CLUB does not manage or guarantee peer-to-peer transactions.",
        "Taxes & Fees: Members are responsible for any applicable taxes, transaction fees, or currency conversion charges."
      ]
    },
    {
      id: "refund",
      icon: RefreshCw,
      title: "6. Refund Policy",
      content: [
        "Professional Development Membership: Refunds available within 7 days of purchase.",
        "Partner Program: No refunds due to peer-to-peer payment structure.",
        "Policy Link: Full details available at: PASH.CLUB Refund Policy"
      ]
    },
    {
      id: "intellectual-property",
      icon: Lock,
      title: "7. Intellectual Property",
      content: [
        "All content, training materials, logos, and trademarks on PASH.CLUB are owned by or licensed to PASH.CLUB.",
        "Members are granted a limited license for personal use only.",
        "Unauthorized use, reproduction, or distribution is prohibited."
      ]
    },
    {
      id: "liability",
      icon: Shield,
      title: "8. Limitation of Liability",
      content: [
        "PASH.CLUB is not responsible for any losses, damages, or issues arising from participation in the Partner Program, peer-to-peer payments, or misuse of membership content.",
        "Use of services is at your own risk."
      ]
    },
    {
      id: "termination",
      icon: Ban,
      title: "9. Termination",
      content: [
        "PASH.CLUB reserves the right to suspend or terminate memberships or partner program access for violations of these Terms."
      ]
    },
    {
      id: "governing-law",
      icon: Scale,
      title: "10. Governing Law",
      content: [
        "These Terms are governed by the laws of the jurisdiction where PASH.CLUB operates."
      ]
    },
    {
      id: "updates",
      icon: Clock,
      title: "11. Updates to Terms",
      content: [
        "PASH.CLUB may update these Terms at any time. Members are encouraged to review them periodically. Continued use constitutes acceptance of the updated Terms."
      ]
    }
  ];

  const keyPoints = [
    {
      icon: DollarSign,
      title: "$50 Lifetime Membership",
      description: "One-time payment for lifetime access to all educational resources"
    },
    {
      icon: RefreshCw,
      title: "7-Day Refund Policy",
      description: "Full refunds available within 7 days of membership purchase"
    },
    {
      icon: Users,
      title: "Partner Program: $500",
      description: "Peer-to-peer payments with no refunds"
    },
    {
      icon: Ban,
      title: "No Credential Sharing",
      description: "Strictly prohibited - accounts are non-transferable"
    }
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
                <FileText className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="text-sm font-medium">Legal Agreement</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                Terms & Conditions
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
                    const content = document.getElementById('terms-content')?.innerText;
                    if (content) {
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'pash-club-terms.txt';
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
      <section id="terms-content" className="py-12" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Message */}
          <AnimatedSection>
            <div 
              className="rounded-2xl p-8 mb-12"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text)' }}>
                Welcome to PASH.CLUB. By accessing or using our platform, services, or membership programs, 
                you agree to be bound by these Terms & Conditions. Please read them carefully.
              </p>
            </div>
          </AnimatedSection>

          {/* Key Points Grid */}
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {keyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.03)',
                    border: '1px solid var(--border)'
                  }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)' }}
                    >
                      <point.icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{point.title}</h3>
                      <p className="text-sm opacity-70" style={{ color: 'var(--text)' }}>{point.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* Terms Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
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
                      
                      <div className="space-y-3">
                        {section.content.map((item, i) => (
                          <p key={i} className="opacity-80 leading-relaxed" style={{ color: 'var(--text)' }}>
                            {item}
                          </p>
                        ))}
                      </div>

                      {/* Special link for refund policy */}
                      {section.id === "refund" && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-4"
                        >
                          <Link
                            href={getUrlWithRef("/payment-policies")}
                            className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                            style={{ color: 'var(--primary)' }}
                          >
                            <span>View Full Refund Policy</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>

          {/* Important Notice */}
          <AnimatedSection delay={0.8}>
            <div 
              className="rounded-2xl p-8 my-12"
              style={{
                backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.05)',
                border: '1px solid var(--border)'
              }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <AlertCircle className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span>Important Notice</span>
              </h2>
              
              <div className="space-y-3">
                <p className="opacity-80" style={{ color: 'var(--text)' }}>
                  By joining PASH.CLUB, you acknowledge that:
                </p>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  <p className="opacity-80" style={{ color: 'var(--text)' }}>
                    The $50 Professional Development Membership is a one-time fee with a 7-day refund window
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  <p className="opacity-80" style={{ color: 'var(--text)' }}>
                    The $500 Partner Program fee is paid peer-to-peer and is non-refundable
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  <p className="opacity-80" style={{ color: 'var(--text)' }}>
                    You have read and agree to all terms outlined in this document
                  </p>
                </div>
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
                Questions About These Terms?
              </h2>
              
              <p className="opacity-80 mb-6" style={{ color: 'var(--text)' }}>
                For questions about these Terms, memberships, or programs, contact us:
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <a 
                    href="mailto:support@pash.club" 
                    className="hover:underline"
                    style={{ color: 'var(--primary)' }}
                  >
                    support@pash.club
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
          <AnimatedSection delay={1.0}>
            <p className="text-sm opacity-60 text-center mt-12" style={{ color: 'var(--text)' }}>
              Last updated: February 26, 2026
            </p>
          </AnimatedSection>
        </div>
      </section>
      
    </>
  );
}