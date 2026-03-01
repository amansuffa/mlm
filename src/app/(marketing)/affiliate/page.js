"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "../../../contexts/RefContext";
import { 
  Users, 
  Award, 
  DollarSign, 
  Shield, 
  TrendingUp,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Clock,
  Mail,
  Globe,
  Star,
  Zap,
  Target,
  Briefcase,
  UserPlus,
  Network,
  Gift,
  Sparkles,
  Heart,
  Handshake,
  Rocket,
  BarChart,
  Crown,
  BadgeCheck,
  Medal,
  Gem,
  Infinity,
  Coffee,
  MessageCircle,
  Play,
  Download
} from "lucide-react";
import Link from "next/link";

import Image from "next/image";
import pashaImage from "../../../assets/pasha.png";

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

export default function PartnerProgram() {
  const { getUrlWithRef } = useRef();

  const benefits = [
    {
      icon: Gift,
      title: "Instant 100% Partner Contributions",
      description: "Receive 100% partner contributions instantly from your future participants when they join through you."
    },
    {
      icon: Users,
      title: "Peer-to-Peer Structure",
      description: "Direct payments between partners - PASH.CLUB does not handle or take any portion of these transactions."
    },
    {
      icon: Award,
      title: "Exclusive Partner Resources",
      description: "Access premium partner-only training, tools, and resources to grow your network effectively."
    },
    {
      icon: Globe,
      title: "Global Partner Network",
      description: "Connect with partners worldwide and build relationships across borders."
    },
    {
      icon: Rocket,
      title: "Accelerated Growth Path",
      description: "Fast-track your professional growth with advanced partner-level training and support."
    },
    {
      icon: Handshake,
      title: "Mentorship from Leaders",
      description: "Get direct mentorship from successful partners who have built thriving networks."
    }
  ];

  const partnerLevels = [
    {
      icon: BadgeCheck,
      name: "Partner",
      investment: "$500",
      color: "var(--primary)",
      features: [
        "Access to partner resources",
        "Peer-to-peer payment structure",
        "Partner community access",
        "Basic partner training",
        "Receive 100% contributions"
      ]
    }
  ];

  const whyJoin = [
    {
      icon: Infinity,
      title: "No Recurring Fees",
      description: "One-time $500 investment for lifetime partner access"
    },
    {
      icon: Heart,
      title: "Built on Trust",
      description: "Direct peer-to-peer relationships with no middleman"
    },
    {
      icon: Zap,
      title: "Instant Activation",
      description: "Start immediately after connecting with your sponsor"
    },
    {
      icon: Crown,
      title: "Elite Community",
      description: "Join a select group of motivated professionals"
    }
  ];

  const faqs = [
    {
      question: "How does the $500 Partner Program payment work?",
      answer: "The $500 payment is made directly to your sponsor on a peer-to-peer basis. PASH.CLUB does not process, receive, or control these payments."
    },
    {
      question: "What do I get for the $500 investment?",
      answer: "You get access to partner-level resources, training, community support, and the ability to receive 100% partner contributions from your future participants."
    },
    {
      question: "Is the Partner Program refundable?",
      answer: "No. Since payments are peer-to-peer and not processed by PASH.CLUB, the Partner Program fee is non-refundable."
    },
    {
      question: "Do I need the $50 membership first?",
      answer: "Yes, you must have an active Professional Development Membership to be eligible for the Partner Program."
    },
    {
      question: "How do I find a sponsor?",
      answer: "Your sponsor will typically be the person who introduced you to PASH.CLUB. They'll guide you through the partner enrollment process."
    }
  ];

  const steps = [
    {
      icon: UserPlus,
      title: "Connect with a Sponsor",
      description: "Find a current PASH.CLUB partner who can sponsor you into the program"
    },
    {
      icon: DollarSign,
      title: "Make Your Payment",
      description: "Pay $500 directly to your sponsor via your preferred payment method"
    },
    {
      icon: CheckCircle,
      title: "Get Activated",
      description: "Your sponsor activates your partner status in the system"
    },
    {
      icon: Rocket,
      title: "Start Building",
      description: "Access partner resources and begin growing your network"
    }
  ];

  return (
    <>
      
      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0" 
          style={{ 
            backgroundColor: 'var(--primary)',
            opacity: 0.05
          }}
        />
        
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12 py-20">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1 text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" 
                  style={{ 
                    backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)',
                    border: '1px solid rgba(var(--primary-rgb, 59, 130, 246), 0.2)',
                    color: 'var(--text)'
                  }}>
                  <Award className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm font-medium">Exclusive Partner Program</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                  Take Your PASH.CLUB Journey to the Next Level
                </h1>

                <p className="text-xl opacity-90 mb-8" style={{ color: 'var(--text)' }}>
                  Become a Partner and unlock the full potential of peer-to-peer collaboration.
                </p>

                <p className="text-lg opacity-80 mb-8" style={{ color: 'var(--text)' }}>
                  For a one-time $500 peer-to-peer payment to your sponsor, you gain access to exclusive resources, advanced training, and the ability to receive 100% partner contributions from your future participants.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={getUrlWithRef("/signup")}
                      className="group px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300"
                      style={{ 
                        backgroundColor: 'var(--primary)',
                        color: 'white'
                      }}
                    >
                      <span>Become a Partner Today</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)'
                    }}
                  >
                    <Play className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    <span>Watch Partner Overview</span>
                  </motion.button>
                </div>

                {/* Partner Badge */}
                <motion.div 
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full"
                  style={{ 
                    backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)',
                    border: '1px solid rgba(var(--primary-rgb, 59, 130, 246), 0.2)'
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                    One-time $500 • Peer-to-Peer • Non-Refundable
                  </span>
                </motion.div>
              </motion.div>
              
              {/* Right Content - Stats/Visual */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex-1"
              >
                <div className="grid grid-cols-2 gap-4">
                  {whyJoin.map((item, index) => (
                    <motion.div
                      key={index}
                      className="p-6 rounded-2xl text-center"
                      style={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)'
                      }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <item.icon className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--primary)' }} />
                      <h3 className="font-bold mb-1" style={{ color: 'var(--text)' }}>{item.title}</h3>
                      <p className="text-sm opacity-70" style={{ color: 'var(--text)' }}>{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                How the Partner Program Works
              </h2>
              <p className="text-lg opacity-80" style={{ color: 'var(--text)' }}>
                A simple, transparent process to elevate your PASH.CLUB experience
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {steps.map((step, index) => (
              <AnimatedCard key={index} delay={index * 0.1}>
                <motion.div 
                  className="p-6 rounded-2xl text-center relative h-full"
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)'
                  }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--primary)' }}>
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <step.icon className="w-10 h-10 mx-auto mb-4 mt-2" style={{ color: 'var(--primary)' }} />
                  <h3 className="font-bold mb-2" style={{ color: 'var(--text)' }}>{step.title}</h3>
                  <p className="text-sm opacity-70" style={{ color: 'var(--text)' }}>{step.description}</p>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                Partner Benefits
              </h2>
              <p className="text-lg opacity-80" style={{ color: 'var(--text)' }}>
                Everything you gain when you become a PASH.CLUB Partner
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <AnimatedCard key={index} delay={index * 0.1}>
                <motion.div 
                  className="p-8 rounded-2xl h-full"
                  style={{
                    backgroundColor: 'var(--cardSecondary)',
                    border: '1px solid var(--border)'
                  }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--primary)' }}>
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>{benefit.title}</h3>
                  <p className="opacity-80" style={{ color: 'var(--text)' }}>{benefit.description}</p>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Level */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                Simple, Transparent Partner Structure
              </h2>
              <p className="text-lg opacity-80" style={{ color: 'var(--text)' }}>
                One level. One investment. Full access.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedCard>
            <motion.div 
              className="rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
              style={{
                backgroundColor: 'var(--card)',
                border: '2px solid var(--primary)'
              }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
              
              <Medal className="w-16 h-16 mx-auto mb-6" style={{ color: 'var(--primary)' }} />
              
              <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                PASH.CLUB Partner
              </h3>
              
              <div className="text-5xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
                $500
              </div>
              
              <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text)' }}>
                One-time peer-to-peer payment to your sponsor • Non-refundable • Lifetime access
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                {partnerLevels[0].features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                    <span style={{ color: 'var(--text)' }}>{feature}</span>
                  </div>
                ))}
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={getUrlWithRef("/signup")}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--primary)',
                    color: 'white'
                  }}
                >
                  <span>Become a Partner</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatedCard>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                What Partners Are Saying
              </h2>
              <p className="text-lg opacity-80" style={{ color: 'var(--text)' }}>
                Join successful partners who have elevated their PASH.CLUB experience
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Michael T.",
                role: "Partner since 2025",
                text: "The Partner Program opened doors I didn't know existed. The peer-to-peer structure is refreshingly transparent.",
                rating: 5
              },
              {
                name: "Jennifer L.",
                role: "Partner since 2025",
                text: "Best decision I made after joining PASH.CLUB. The partner community is incredibly supportive.",
                rating: 5
              },
              {
                name: "David K.",
                role: "Partner since 2025",
                text: "The $500 investment paid for itself within weeks. The training and support are world-class.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <AnimatedCard key={index} delay={index * 0.1}>
                <motion.div 
                  className="p-6 rounded-2xl h-full"
                  style={{
                    backgroundColor: 'var(--cardSecondary)',
                    border: '1px solid var(--border)'
                  }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4" style={{ color: 'var(--primary)' }} fill="var(--primary)" />
                    ))}
                  </div>
                  <p className="italic mb-4 opacity-90" style={{ color: 'var(--text)' }}>"{testimonial.text}"</p>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--text)' }}>{testimonial.name}</p>
                    <p className="text-sm opacity-70" style={{ color: 'var(--text)' }}>{testimonial.role}</p>
                  </div>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                Frequently Asked Questions
              </h2>
              <p className="text-lg opacity-80" style={{ color: 'var(--text)' }}>
                Everything you need to know about the Partner Program
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <AnimatedCard key={index} delay={index * 0.1}>
                <motion.div 
                  className="p-6 rounded-xl"
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)'
                  }}
                  whileHover={{ y: -3 }}
                >
                  <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <MessageCircle className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    {faq.question}
                  </h3>
                  <p className="opacity-80 ml-6" style={{ color: 'var(--text)' }}>{faq.answer}</p>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Pasha */}
      <section className="py-20" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div 
              className="rounded-2xl p-8 md:p-12"
              style={{
                backgroundColor: 'var(--cardSecondary)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                    A Message from Pasha
                  </h2>
                  <p className="text-lg opacity-80 mb-6" style={{ color: 'var(--text)' }}>
                    "The Partner Program was designed to create genuine peer-to-peer relationships. No middleman, no hidden fees - just direct connections between motivated professionals."
                  </p>
                  <p className="opacity-80 mb-6" style={{ color: 'var(--text)' }}>
                    When you become a partner, you're not just paying a fee - you're investing in a relationship with someone who will guide you and help you succeed. That's why payments are peer-to-peer, not processed by us.
                  </p>
                  <p className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>
                    Your success is built on trust and direct collaboration.
                  </p>
                </div>
                
                <div className="flex items-center justify-center">
                  <motion.div 
                    className="w-64 h-64 rounded-2xl overflow-hidden relative"
                    style={{ border: '3px solid var(--primary)' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image
                      src={pashaImage}
                      alt="Pasha Rana"
                      width={256}
                      height={256}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" 
          style={{ 
            backgroundColor: 'var(--primary)',
            opacity: 0.03
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ 
                backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)',
                border: '1px solid rgba(var(--primary-rgb, 59, 130, 246), 0.2)',
                color: 'var(--text)'
              }}>
              <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <span className="font-medium">Ready to Level Up?</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: 'var(--text)' }}>
              Become a PASH.CLUB Partner Today
            </h2>
            
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text)' }}>
              One-time $500 peer-to-peer payment • Non-refundable • Lifetime partner access
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={getUrlWithRef("/signup")}
                  className="group px-10 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--primary)',
                    color: 'white'
                  }}
                >
                  <span>Find a Sponsor</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={getUrlWithRef("/contact")}
                  className="px-10 py-5 rounded-2xl font-semibold text-xl flex items-center justify-center gap-3 transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)'
                  }}
                >
                  <span>Questions? Contact Us</span>
                </Link>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      
    </>
  );
}