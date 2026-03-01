"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "../../../contexts/RefContext";
import { 
  CreditCard, 
  RefreshCw, 
  DollarSign, 
  Shield, 
  AlertCircle,
  ChevronRight,
  CheckCircle,
  Download,
  Printer,
  ArrowRight,
  Clock,
  Mail,
  Users,
  Lock,
  FileText,
  Scale,
  Ban
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

export default function PaymentRefundPolicy() {
  const { getUrlWithRef } = useRef();

  const sections = [
    {
      id: "overview",
      icon: FileText,
      title: "1. Overview",
      content: [
        "PASH.CLUB provides secure access to professional development resources, tools, and training programs. This policy explains how payments are processed and the conditions under which refunds are available."
      ]
    },
    {
      id: "payments",
      icon: CreditCard,
      title: "2. Payments",
      subsections: [
        {
          title: "A. Professional Development Membership ($50 One-Time Fee)",
          content: [
            "The $50 payment grants lifetime access to PASH.CLUB's Professional Development Membership, including training modules, educational resources, tools, community support, and member dashboard access.",
            "Payment is processed securely via our authorized payment processor (Stripe).",
            "This is a one-time, non-recurring fee."
          ]
        },
        {
          title: "B. Partner Program ($500 One-Time Payment)",
          content: [
            "Payments for the Partner Program are peer-to-peer and made directly to your sponsor.",
            "Grants you the opportunity to receive instant 100% partner contributions from your future participants.",
            "PASH.CLUB does not receive, control, or process these payments.",
            "Refunds cannot be issued by PASH.CLUB for Partner Program payments. Any questions or disputes must be resolved directly with the recipient."
          ]
        }
      ]
    },
    {
      id: "refund",
      icon: RefreshCw,
      title: "3. Refund Policy",
      subsections: [
        {
          title: "A. Professional Development Membership",
          content: [
            "Refund requests can be submitted within 7 days of purchase.",
            "Refunds are processed through Stripe and will be returned to your original payment method.",
            "Bank or processing fees may be deducted from the refund.",
            "Refunds typically take 5–10 business days depending on your bank or payment provider."
          ]
        },
        {
          title: "B. Partner Program",
          content: [
            "Payments made for the Partner Program are non-refundable.",
            "PASH.CLUB is not responsible for peer-to-peer transactions between members and sponsors."
          ]
        }
      ]
    },
    {
      id: "contact",
      icon: Mail,
      title: "4. Contact for Refunds",
      content: [
        "For refund requests related to the Professional Development Membership, contact:",
        "Email: support@pash.club",
        "Response Time: Within 48 hours"
      ]
    },
    {
      id: "important-notes",
      icon: AlertCircle,
      title: "5. Important Notes",
      content: [
        "Refunds apply only to the Professional Development Membership.",
        "Partner Program payments are independent of PASH.CLUB and are outside our control.",
        "By completing a payment on PASH.CLUB, you agree to this Payment & Refund Policy."
      ]
    },
    {
      id: "agreement",
      icon: Scale,
      title: "6. Agreement to Terms",
      content: [
        "By joining PASH.CLUB and completing any payment, you confirm that you have read, understood, and agreed to:",
        "• This Payment & Refund Policy",
        "• Our Terms & Conditions",
        "• Our Earnings Disclaimer",
        "• Our Affiliate Agreement",
        "• Our Privacy Policy"
      ]
    }
  ];

  const paymentHighlights = [
    {
      icon: DollarSign,
      title: "$50 Membership",
      description: "One-time fee - lifetime access",
      color: "var(--primary)"
    },
    {
      icon: Users,
      title: "$500 Partner Program",
      description: "Peer-to-peer payment",
      color: "var(--primary)"
    },
    {
      icon: RefreshCw,
      title: "7-Day Refund Window",
      description: "For membership only",
      color: "var(--primary)"
    },
    {
      icon: Lock,
      title: "Secure Processing",
      description: "Via Stripe",
      color: "var(--primary)"
    }
  ];

  const relatedPolicies = [
    { name: "Terms & Conditions", href: "/terms", icon: FileText },
    { name: "Privacy Policy", href: "/privacy", icon: Shield },
    { name: "Earnings Disclaimer", href: "/earnings-disclaimer", icon: DollarSign },
    { name: "Affiliate Agreement", href: "/affiliate-agreement", icon: Users }
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
                <CreditCard className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="text-sm font-medium">Payment & Refund Policy</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                Payment & Refund Policy
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
                    const content = document.getElementById('payment-content')?.innerText;
                    if (content) {
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'pash-club-payment-policy.txt';
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
      <section id="payment-content" className="py-12" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Payment Highlights Grid */}
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
              {paymentHighlights.map((highlight, index) => (
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
                  <highlight.icon className="w-6 h-6 mx-auto mb-2" style={{ color: highlight.color }} />
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{highlight.title}</h3>
                  <p className="text-xs opacity-70 mt-1" style={{ color: 'var(--text)' }}>{highlight.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* Policy Sections */}
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
                      
                      {section.content && (
                        <div className="space-y-3">
                          {section.content.map((item, i) => (
                            <p key={i} className="opacity-80 leading-relaxed" style={{ color: 'var(--text)' }}>
                              {item}
                            </p>
                          ))}
                        </div>
                      )}

                      {section.subsections && (
                        <div className="space-y-6">
                          {section.subsections.map((subsection, i) => (
                            <div key={i}>
                              <h3 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>
                                {subsection.title}
                              </h3>
                              <div className="space-y-2">
                                {subsection.content.map((item, j) => (
                                  <p key={j} className="opacity-80 leading-relaxed" style={{ color: 'var(--text)' }}>
                                    {item}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Special formatting for agreement section */}
                      {section.id === "agreement" && section.content && (
                        <div className="mt-2 space-y-1">
                          {section.content.map((item, i) => (
                            <p key={i} className={i === 0 ? "opacity-80 mb-2" : "opacity-80 ml-4"} style={{ color: 'var(--text)' }}>
                              {item}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Contact email link */}
                      {section.id === "contact" && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="mt-4 inline-block"
                        >
                          <a 
                            href="mailto:support@pash.club"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg"
                            style={{ 
                              backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)',
                              color: 'var(--primary)'
                            }}
                          >
                            <Mail className="w-4 h-4" />
                            <span className="font-medium">support@pash.club</span>
                          </a>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>

          {/* Quick Reference Card */}
          <AnimatedSection delay={0.8}>
            <div 
              className="rounded-2xl p-8 my-12"
              style={{
                backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.03)',
                border: '1px solid var(--border)'
              }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <Clock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <span>Quick Reference</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <DollarSign className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    Membership ($50)
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <span className="opacity-80" style={{ color: 'var(--text)' }}>7-day refund window</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <span className="opacity-80" style={{ color: 'var(--text)' }}>Processed via Stripe</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <span className="opacity-80" style={{ color: 'var(--text)' }}>One-time payment</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <Users className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    Partner Program ($500)
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <Ban className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <span className="opacity-80" style={{ color: 'var(--text)' }}>Non-refundable</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Ban className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <span className="opacity-80" style={{ color: 'var(--text)' }}>Peer-to-peer payment</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Ban className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <span className="opacity-80" style={{ color: 'var(--text)' }}>Outside PASH.CLUB control</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Related Policies */}
          <AnimatedSection delay={0.9}>
            <div 
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--text)' }}>
                Related Policies
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedPolicies.map((policy, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={getUrlWithRef(policy.href)}
                      className="flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300"
                      style={{ 
                        backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.03)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <policy.icon className="w-6 h-6 mb-2" style={{ color: 'var(--primary)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{policy.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Section */}
          <AnimatedSection delay={1.0}>
            <div 
              className="rounded-2xl p-8 text-center mt-8"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                Need Help With a Payment or Refund?
              </h2>
              
              <p className="opacity-80 mb-6" style={{ color: 'var(--text)' }}>
                Our support team is here to help with any questions about payments or refunds.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
              
              <p className="text-sm opacity-60 mt-6" style={{ color: 'var(--text)' }}>
                Response time: Within 48 hours
              </p>
            </div>
          </AnimatedSection>

          {/* Footer Note */}
          <AnimatedSection delay={1.1}>
            <p className="text-sm opacity-60 text-center mt-12" style={{ color: 'var(--text)' }}>
              Last updated: February 26, 2026
            </p>
          </AnimatedSection>
        </div>
      </section>
      
    </>
  );
}