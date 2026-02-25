"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "../contexts/RefContext";
import { 
  Play, 
  Download, 
  ChevronRight, 
  CheckCircle, 
  Star, 
  Zap, 
  Users, 
  Bot, 
  TrendingUp, 
  Globe, 
  Shield,
  Sparkles,
  Clock,
  Award,
  DollarSign,
  Target,
  Briefcase,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Trophy,
  UserPlus,
  Mail,
  Phone,
  Building,
  FileText
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";
import Footer from "./Footer";
import VideoSection from "./VideoSection";
import pashaImage from "../assets/pasha.png";
import compImage from "../assets/comp-image.png";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
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
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

// Animation Components
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

export default function HomePage() {
  const { getUrlWithRef } = useRef();

  const stats = [
    { icon: Users, value: "1k+", label: "Active Learners", delay: 0.1 },
    { icon: DollarSign, value: "Trusted Curriculum", label: "Structured Tracks", delay: 0.2 },
    { icon: Clock, value: "48hrs", label: "Quick Start Guidance", delay: 0.3 },
    { icon: Globe, value: "100+", label: "Countries", delay: 0.4 },
  ];

  const features = [
    {
      icon: Zap,
      title: "Plug-and-Play Funnels",
      description: "Implementation-ready funnels and systems to help translate training into practical results."
    },
    {
      icon: TrendingUp,
      title: "Step-by-Step Training",
      description: "Clear, beginner-friendly training that guides skill development and practical application."
    },
    {
      icon: Award,
      title: "Peer-to-peer Partner Contribution Structure",
      description: "An optional Partner Program that supports peer contributions between members; participation is optional and managed directly by members."
    },
    {
      icon: Bot,
      title: "AI Learning Assistant",
      description: "An AI assistant to help explain lessons, provide implementation guidance, and support learner questions."
    },
    {
      icon: Users,
      title: "Mentorship & Peer Support",
      description: "Access guidance from experienced professionals and peers focused on skill development and best practices."
    },
    {
      icon: Globe,
      title: "Global Learning Network",
      description: "Collaborate with learners around the world and access resources from anywhere."
    }
  ];

  const benefits = [
    "A complete, structured training curriculum",
    "Implementation tools and productivity systems",
    "Ready-to-use resources for practical application",
    "An AI learning assistant to support progress",
    "Optional Partner Program for peer contributions",
    "Premium instruction from experienced professionals",
    "Support from a private global learning community",
    "Clear pathways for digital skill development"
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Member",
      text: "The curriculum and implementation tools helped me build useful digital skills quickly.",
      rating: 5
    },
    {
      name: "Ahmed R.",
      role: "Entrepreneur",
      text: "The structured lessons and practical templates saved me months of development time.",
      rating: 5
    },
    {
      name: "Lisa D.",
      role: "Digital Creator",
      text: "The training and AI assistant made implementation clear and manageable.",
      rating: 5
    },
    {
      name: "John P.",
      role: "Business Owner",
      text: "The support and productivity systems improved our team's digital capabilities.",
      rating: 5
    }
  ];

  const faqItems = [
    {
      question: "What is PASH.CLUB?",
      answer: "PASH.CLUB is a professional training platform focused on digital skills development, practical implementation tools, and ongoing mentorship."
    },
    {
      question: "Do I need experience?",
      answer: "No. The platform provides beginner-friendly, step-by-step training and implementation guidance."
    },
    {
      question: "Is this an income guarantee program?",
      answer: "No. This is a professional training platform focused on skill development. There is no income guarantee; outcomes depend on individual effort and application. Participation in the Partner Program is optional and does not guarantee income."
    },
    {
      question: "Is this a global system?",
      answer: "Yes. Learners from around the world can join and access training resources." 
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* 🚀 Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0" 
          style={{ 
            backgroundColor: 'var(--primary)',
            opacity: 0.05
          }}
        />
        
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-12 items-center py-20">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >  <div className="flex flex-col items-center justify-center text-center">
                <motion.div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" 
                  style={{ 
                    backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)',
                    color: 'var(--text)',
                    border: '1px solid rgba(var(--primary-rgb, 59, 130, 246), 0.2)'
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                
                  <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <span className="text-sm font-medium">Limited Time Launch Offer</span>
                </motion.div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold lg:px-16 mb-6" style={{ color: 'var(--text)' }}>
                  Build Real Digital Skills for Today’s Professional World
                </h1>

                <p className="text-xl opacity-90 mb-8" style={{ color: 'var(--text)' }}>
                  Structured training, clear pathways, and guided support for practical skill development.
                </p>

                <p className="text-lg opacity-90 mb-8 lg:px-16" style={{ color: 'var(--text)' }}>
                  Join PASH.CLUB to access professional training, implementation tools, and mentorship — Partner Program participation is optional and not required to access training.
                </p>
                
                <div className="flex flex-col justify-center sm:flex-row gap-4 mb-12">
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
                      <span>Get Instant Access Now</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--card)',
                      border: `1px solid var(--border)`,
                      color: 'var(--text)'
                    }}
                  >
                    <Play className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    <span>Watch Explainer Video</span>
                  </motion.button>
                </div>
                </div>
              </motion.div>
              
              {/* Right Content - Smaller Stats */}
              {/* <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="flex gap-4">
                  {stats.map((stat, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: stat.delay }}
                      whileHover={{ y: -3 }}
                      className="p-4 rounded-xl text-center transition-all duration-300"
                      style={{ 
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <stat.icon className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--primary)' }} />
                      <div className="text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>
                        {stat.value}
                      </div>
                      <div className="text-xs opacity-70" style={{ color: 'var(--text)' }}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div> */}
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

      <VideoSection />

      {/* 📄 Comp Plan PDF */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div 
              className="rounded-2xl p-8 md:p-12"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col justify-center items-center">
                  <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                    Download the Program Overview PDF
                  </h2>
                  <p className="text-lg opacity-80 mb-8" style={{ color: 'var(--text)' }}>
                    Review the program overview, Partner Program details (optional), and how membership access and any peer contributions are managed. This PDF explains access, expectations, and policies in clear terms.
                  </p>
                  <motion.a
                    href={compImage}
                    download="pash-club-comp-plan.pdf"
                    className="w-80 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: 'white'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Program Overview</span>
                  </motion.a>
                </div>
                <div className="flex justify-center">
                  <motion.a
                    href={compImage}
                    download="pash-club-comp-plan.pdf"
                    className="rounded-xl overflow-hidden relative cursor-pointer"
                    style={{ 
                      border: '3px solid var(--primary)',
                      width: 'fit-content',
                      height: 'fit-content'
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={compImage}
                      alt="Program Overview"
                      width={400}
                      height={500}
                      className="object-contain"
                      priority
                    />
                  </motion.a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 🔥 Why PASH.CLUB? */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                A Modern Professional Training Ecosystem Built for the Future
              </h2>
              <p className="text-lg opacity-80 mb-8" style={{ color: 'var(--text)' }}>
                PASH.CLUB gives you training, implementation tools, and mentorship to build practical digital skills from anywhere. No experience required — just a willingness to learn and apply.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <AnimatedCard>
              <div 
                className="rounded-2xl p-8 h-full"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)'
                }}
              >
                <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                  You Get:
                </h3>
                <ul className="space-y-4">
                  {benefits.map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                      <span style={{ color: 'var(--text)' }}>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </AnimatedCard>
            
            <AnimatedCard delay={0.2}>
              <div 
                className="rounded-2xl p-8 h-full flex flex-col justify-center"
                style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)'
                }}
              >
                <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                  Designed for Real People
                </h3>
                <p className="text-lg opacity-80 mb-6" style={{ color: 'var(--text)' }}>
                  PASH.CLUB is designed to help everyday people build practical digital skills and apply them with confidence — even if they’ve struggled before.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--cardSecondary)' }}>
                    <Shield className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    <span style={{ color: 'var(--text)' }}>Beginner-Friendly System</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--cardSecondary)' }}>
                    <Zap className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    <span style={{ color: 'var(--text)' }}>No Technical Skills Required</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--cardSecondary)' }}>
                    <Users className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    <span style={{ color: 'var(--text)' }}>Community Support Included</span>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* 📈 Features Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                Everything in One High-End System
              </h2>
              <p className="text-lg opacity-80" style={{ color: 'var(--text)' }}>
                Six powerful components that work together to create your success system
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedCard key={index} delay={index * 0.1}>
                <motion.div 
                  className="p-8 rounded-2xl transition-all duration-300 hover:shadow-lg h-full"
                  style={{ 
                    backgroundColor: 'var(--cardSecondary)',
                    border: '1px solid var(--border)'
                  }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--primary)' }}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
            
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                    {feature.title}
                  </h3>
                  <p className="opacity-80" style={{ color: 'var(--text)' }}>{feature.description}</p>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full mb-6"
                style={{ 
                  backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)',
                  border: '1px solid rgba(var(--primary-rgb, 59, 130, 246), 0.2)',
                  color: 'var(--text)'
                }}>
                <Clock className="w-4 h-4 mr-2" style={{ color: 'var(--primary)' }} />
                Early-stage Access Available
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                Early Access - Platform Evolving with New Features
              </h2>
              <p className="text-xl opacity-90 mb-8" style={{ color: 'var(--text)' }}>
                The platform is evolving. Early-stage access offers a chance to shape the experience and receive guided support.
              </p>
              
              <div className="p-8 rounded-2xl mb-8"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)'
                }}>
                <p className="text-lg italic mb-4" style={{ color: 'var(--text)' }}>
                  Early participants help shape the platform and gain closer support from mentors and peers.
                </p>
                <p className="text-lg italic mb-4" style={{ color: 'var(--text)' }}>
                  The platform is designed for steady progress — focused learning and consistent application lead to the best outcomes.
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                  Consider early access if you want structured support and a collaborative learning experience.
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={getUrlWithRef("/signup")}
                  className="inline-flex items-center px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--primary)',
                    color: 'white'
                  }}
                >
                  <span>Request Early Access</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ✨ Testimonials */}
      <section className="py-20" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                What Members Are Saying
              </h2>
              <p className="text-lg opacity-80" style={{ color: 'var(--text)' }}>
                Join thousands of learners who have strengthened their digital skills and applied them to real projects
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedCard key={index} delay={index * 0.1}>
                <motion.div 
                  className="p-6 rounded-2xl transition-all duration-300 hover:shadow-lg h-full flex flex-col"
                  style={{ 
                    backgroundColor: 'var(--cardSecondary)',
                    border: '1px solid var(--border)'
                  }}
                  whileHover={{ y: -8, scale: 1.02, rotate: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="flex mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.1 }}
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Star className="w-4 h-4" style={{ color: 'var(--primary)' }} fill="var(--primary)" />
                      </motion.div>
                    ))}
                  </motion.div>
                  <p className="italic mb-4 text-sm opacity-90 flex-grow" style={{ color: 'var(--text)' }}>
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="mt-auto">
                    <p className="font-bold" style={{ color: 'var(--text)' }}>{testimonial.name}</p>
                    <p className="text-xs opacity-70" style={{ color: 'var(--text)' }}>{testimonial.role}</p>
                  </div>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <AnimatedSection>
              <p className="opacity-80 mb-4" style={{ color: 'var(--text)' }}>Read verified reviews from our members</p>
              <a 
                href="https://www.trustpilot.com/review/pash.club" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-80"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: '2px solid var(--primary)',
                  color: 'var(--text)'
                }}
              >
                <span className="text-2xl">⭐</span>
                <span>See All Reviews on Trustpilot</span>
              </a>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 🔵 About Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div 
              className="rounded-2xl p-8 md:p-12"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                    About PASH.CLUB
                  </h2>
                  <p className="text-lg opacity-80 mb-6" style={{ color: 'var(--text)' }}>
                    PASH.CLUB is founded by Pasha Rana, an experienced entrepreneur and educator who has worked in online business and training since 2013.
                  </p>
                  <p className="opacity-80 mb-6" style={{ color: 'var(--text)' }}>
                    Registered as PASH CLUB LLC in New Mexico, USA, with additional operations in Toronto, Canada — the platform is built on trust, professionalism, and long-term stability.
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-4" style={{ color: 'var(--text)' }}>
                      After helping thousands of people, Pasha realized most beginners fail because they {"don't"} have:
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "A system",
                        "A mentor",
                        "A plan",
                        "Automation",
                        "Proper tools"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                          <span style={{ color: 'var(--text)' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>
                    So he built PASH.CLUB, a modern solution designed to eliminate confusion and give anyone the tools to apply skills and grow professionally.
                  </p>
                  
                  <Link href={getUrlWithRef("/about")} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-80 mt-8" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                    Learn More About PASH.CLUB
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                
                <div className="flex items-center justify-center">
                  <motion.div 
                    className="w-80 h-80 rounded-2xl overflow-hidden relative"
                    style={{ border: '3px solid var(--primary)' }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={pashaImage}
                      alt="Pasha Rana"
                      width={320}
                      height={320}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ❓ FAQ Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--card)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                Frequently Asked Questions
              </h2>
              <p className="text-lg opacity-80" style={{ color: 'var(--text)' }}>
                Everything you need to know about PASH.CLUB
              </p>
            </div>
          </AnimatedSection>
          
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <AnimatedCard key={index} delay={index * 0.1}>
                <motion.div 
                  className="p-6 rounded-xl transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--cardSecondary)',
                    border: '1px solid var(--border)'
                  }}
                  whileHover={{ y: -5, scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>
                    {faq.question}
                  </h3>
                  <p className="opacity-80" style={{ color: 'var(--text)' }}>{faq.answer}</p>
                </motion.div>
              </AnimatedCard>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href={getUrlWithRef("/faq")} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-80" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              View Full FAQ
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 🎯 Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" 
          style={{ 
            backgroundColor: 'var(--primary)',
            opacity: 0.03
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ 
                backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)',
                color: 'var(--text)',
                border: '1px solid rgba(var(--primary-rgb, 59, 130, 246), 0.2)'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <span className="font-medium">Your Journey Starts Here</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: 'var(--text)' }}>
              Take the First Step Toward a Better Future
            </h2>
            
            <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto" style={{ color: 'var(--text)' }}>
              {"You're"} one decision away from accessing structured training, practical tools, and a supportive community for professional growth.
              <br />
              <span className="font-bold">Begin your learning journey today.</span>
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <motion.div
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={getUrlWithRef("/signup")}
                  className="group px-10 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-2xl"
                  style={{ 
                    backgroundColor: 'var(--primary)',
                    color: 'white'
                  }}
                >
                  <span>Activate Your PASH.CLUB Membership</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href="/about"
                  className="px-10 py-5 rounded-2xl font-semibold text-xl flex items-center justify-center gap-3 transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: `1px solid var(--border)`,
                    color: 'var(--text)'
                  }}
                >
                  <span>Learn More</span>
                </Link>
              </motion.div>
            </div>
          </AnimatedSection>
          
          {/* Final FOMO */}
          <AnimatedSection delay={0.5}>
            <div className="pt-12 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-2xl font-bold mb-4 opacity-90" style={{ color: 'var(--text)' }}>
                Success loves speed.
              </p>
              <p className="text-2xl font-bold mb-4 opacity-90" style={{ color: 'var(--text)' }}>
                Opportunities reward action.
              </p>
              <p className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
                Your moment is right now.
              </p>
              <p className="text-lg opacity-80 mt-4" style={{ color: 'var(--text)' }}>
                Join PASH.CLUB before you miss it.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
      
      <Footer />
    </>
  );
}