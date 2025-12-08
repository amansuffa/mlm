"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  DollarSign, 
  Users, 
  Smartphone, 
  Rocket, 
  Wrench,
  Sparkles,
  Globe,
  Shield,
  CreditCard,
  UserPlus,
  TrendingUp,
  FileText,
  MessageCircle,
  ExternalLink,
  Home,
  Mail,
  Phone,
  Award
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useRef } from "../../../contexts/RefContext";

export default function FAQPage() {
  const { getUrlWithRef } = useRef();
  const [activeCategory, setActiveCategory] = useState("about");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);

  const categories = [
    {
      id: "about",
      title: "About PASH.CLUB",
      icon: <HelpCircle className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
      description: "Learn about who we are and our mission"
    },
    {
      id: "payments",
      title: "Payments & Fees",
      icon: <DollarSign className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
      description: "Everything about costs and payments"
    },
    {
      id: "sponsors",
      title: "Sponsors & Referrals",
      icon: <Users className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
      description: "Understanding sponsors and earning"
    },
    {
      id: "platform",
      title: "Platform & Apps",
      icon: <Smartphone className="w-5 h-5" />,
      color: "from-orange-500 to-amber-500",
      description: "System features and mobile access"
    },
    {
      id: "earning",
      title: "Earning & Growth",
      icon: <Rocket className="w-5 h-5" />,
      color: "from-red-500 to-rose-500",
      description: "How to maximize your income"
    },
    {
      id: "technical",
      title: "Technical Support",
      icon: <Wrench className="w-5 h-5" />,
      color: "from-indigo-500 to-violet-500",
      description: "Account help and technical issues"
    }
  ];

  const faqItems = [
    // About PASH.CLUB
    {
      id: "about-1",
      categoryId: "about",
      question: "What is PASH.CLUB?",
      answer: "PASH.CLUB is a global online business community that helps people achieve financial independence through our 1-Up system, automation tools, and supportive network."
    },
    {
      id: "about-2",
      categoryId: "about",
      question: "Who founded PASH.CLUB?",
      answer: "Founded by Pasha Rana, a seasoned entrepreneur in business since 2013."
    },
    {
      id: "about-3",
      categoryId: "about",
      question: "Is PASH.CLUB registered?",
      answer: "Yes, it's a U.S. registered LLC in New Mexico (1209 MOUNTAIN ROAD PL NE #7943 ALBUQUERQUE, NM 87110), with operations in Toronto, Canada."
    },
    {
      id: "about-4",
      categoryId: "about",
      question: "What's the purpose of PASH.CLUB?",
      answer: "To create a transparent system that allows anyone to build income online with no hidden fees or complex rules."
    },
    {
      id: "about-5",
      categoryId: "about",
      question: "Is this opportunity global?",
      answer: "Yes! However, due to local regulations, we don't offer services in Pakistan, Somalia, Sudan, DRC, or Yemen."
    },

    // Payments & Fees
    {
      id: "payments-1",
      categoryId: "payments",
      question: "How much does it cost to join?",
      answer: "It's a one-time $50 admin fee and a one-time $500 membership fee — no monthly or yearly charges."
    },
    {
      id: "payments-2",
      categoryId: "payments",
      question: "Who receives the $50 admin fee?",
      answer: "The admin fee goes directly to PASH.CLUB for platform support and maintenance."
    },
    {
      id: "payments-3",
      categoryId: "payments",
      question: "Who receives the $500 membership fee?",
      answer: "That fee goes directly to your sponsor via their preferred payout method."
    },
    {
      id: "payments-4",
      categoryId: "payments",
      question: "How can I pay the admin fee?",
      answer: "You can pay via USDT (crypto) or Wise bank transfer."
    },
    {
      id: "payments-5",
      categoryId: "payments",
      question: "How do I pay the membership fee?",
      answer: "You'll pay it directly to your sponsor, using their accepted payment options."
    },
    {
      id: "payments-6",
      categoryId: "payments",
      question: "Can I use PayPal or credit card?",
      answer: "Currently, we only support USDT and Wise for admin fees — sponsors may offer other options for membership fees."
    },
    {
      id: "payments-7",
      categoryId: "payments",
      question: "Are the fees refundable?",
      answer: "No. Both admin and membership fees are non-refundable, so please confirm before sending payment."
    },
    {
      id: "payments-8",
      categoryId: "payments",
      question: "Any renewal or monthly costs?",
      answer: "None! Once you're in, you're a lifetime member."
    },

    // Sponsors & Referrals
    {
      id: "sponsors-1",
      categoryId: "sponsors",
      question: "What's a sponsor?",
      answer: "Your sponsor is the person who referred you to PASH.CLUB — they help you get started and receive your membership fee."
    },
    {
      id: "sponsors-2",
      categoryId: "sponsors",
      question: "Can I change my sponsor later?",
      answer: "No, once payment is confirmed and your account is active, your sponsor is fixed."
    },
    {
      id: "sponsors-3",
      categoryId: "sponsors",
      question: "How do I earn money?",
      answer: "You earn $500 for every direct signup after your first pass-up sale."
    },
    {
      id: "sponsors-4",
      categoryId: "sponsors",
      question: "What's the 1-Up system?",
      answer: "Your first sale is passed to your sponsor, then you keep all future sales directly."
    },
    {
      id: "sponsors-5",
      categoryId: "sponsors",
      question: "How many people can I refer?",
      answer: "Unlimited! There's no cap on your referrals or earnings."
    },
    {
      id: "sponsors-6",
      categoryId: "sponsors",
      question: "How can I promote my link?",
      answer: "You can share it anywhere online — Facebook, YouTube, WhatsApp, or blogs."
    },
    {
      id: "sponsors-7",
      categoryId: "sponsors",
      question: "Do I get marketing tools?",
      answer: "Yes! Members get done-for-you funnels, banners, and social media posts."
    },

    // Platform & Apps
    {
      id: "platform-1",
      categoryId: "platform",
      question: "Is there a PASH.CLUB mobile app?",
      answer: "Yes! iOS and Google Play apps are launching soon for easy access."
    },
    {
      id: "platform-2",
      categoryId: "platform",
      question: "Can I talk to a real person?",
      answer: "Yes, if the bot can't solve your issue, you can connect to a real support agent or your sponsor."
    },
    {
      id: "platform-3",
      categoryId: "platform",
      question: "How secure is the platform?",
      answer: "We use modern encryption and secure servers to protect your data."
    },
    {
      id: "platform-4",
      categoryId: "platform",
      question: "Can I edit my account info later?",
      answer: "Yes, you can update your personal or wallet info anytime in your dashboard."
    },
    {
      id: "platform-5",
      categoryId: "platform",
      question: "How fast is activation after payment?",
      answer: "Usually instantly, but can take up to 24 hours for verification."
    },

    // Earning & Growth
    {
      id: "earning-1",
      categoryId: "earning",
      question: "How do I earn with PASH.CLUB?",
      answer: "Earn $500 for every new member you personally refer, after your pass-up sale."
    },
    {
      id: "earning-2",
      categoryId: "earning",
      question: "Can I build a global team?",
      answer: "Absolutely! You can refer people from any country we operate in."
    },
    {
      id: "earning-3",
      categoryId: "earning",
      question: "Will I get training?",
      answer: "Yes, members receive step-by-step video training and mentorship."
    },
    {
      id: "earning-4",
      categoryId: "earning",
      question: "How much can I earn monthly?",
      answer: "It depends on your effort — the more you share, the more you can earn. There's no limit!"
    },
    {
      id: "earning-5",
      categoryId: "earning",
      question: "Do I get a team dashboard?",
      answer: "Yes! You can track all referrals, earnings, and payments in real time."
    },
    {
      id: "earning-6",
      categoryId: "earning",
      question: "Will new features be added?",
      answer: "Definitely! PASH.CLUB is constantly evolving with new tools, features, and rewards."
    },

    // Technical Support
    {
      id: "technical-1",
      categoryId: "technical",
      question: "Forgot my password — what now?",
      answer: "Click 'Forgot Password' on the login page and follow the reset instructions."
    },
    {
      id: "technical-2",
      categoryId: "technical",
      question: "How do I contact support?",
      answer: "You can chat here anytime or submit a ticket through the contact page."
    },
    {
      id: "technical-3",
      categoryId: "technical",
      question: "Is the website reliable?",
      answer: "Yes, we run on secure VPS servers with 99.9% uptime."
    },
    {
      id: "technical-4",
      categoryId: "technical",
      question: "Can I have multiple accounts?",
      answer: "No, each person can only own one account for fairness."
    },
    {
      id: "technical-5",
      categoryId: "technical",
      question: "Can I transfer my account?",
      answer: "No, accounts are non-transferable once registered."
    },
    {
      id: "technical-6",
      categoryId: "technical",
      question: "What if I made a wrong payment?",
      answer: "Contact support immediately with your transaction details — we'll assist you."
    },
    {
      id: "technical-7",
      categoryId: "technical",
      question: "Will there be system updates?",
      answer: "Yes! We roll out updates regularly to improve features and speed."
    },
    {
      id: "technical-8",
      categoryId: "technical",
      question: "Where can I learn more about PASH.CLUB?",
      answer: "Visit our official site → www.pash.club"
    }
  ];

  const filteredFAQs = faqItems.filter(item => {
    if (activeCategory !== "all" && item.categoryId !== activeCategory) return false;
    if (searchQuery) {
      return item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
             item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <>

      
      {/* Hero Section */}
      <div className="min-h-screen">
        <section className="py-20 relative overflow-hidden">
          <div className="bg-[var(--primary)]/5 absolute inset-0" 
          />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" 
                style={{ 
                  backgroundColor: 'rgba(var(--primary-rgb, 59, 130, 246), 0.1)',
                  color: 'var(--text)',
                  border: '1px solid rgba(var(--primary-rgb, 59, 130, 246), 0.2)'
                }}>
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm font-medium">🤖 PASH.CLUB Chatbot FAQ</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                Find Answers to Your <span style={{ color: 'var(--primary)' }}>Questions</span>
              </h1>
              
              <p className="text-xl opacity-90 mb-8" style={{ color: 'var(--text)' }}>
                Get instant answers about PASH.CLUB membership, payments, earning system, and more
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl pl-12 pr-4 py-4 focus:outline-none transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--card)',
                      border: `2px solid var(--border)`,
                      color: 'var(--text)'
                    }}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <HelpCircle className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-16">
              <div 
                className="rounded-2xl p-8 text-center"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)'
                }}
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="bg-[var(--primary)]/10 w-12 h-12 rounded-xl flex items-center justify-center"
                >
                    <MessageCircle className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                  👋 Hi there! Welcome to PASH.CLUB — where financial freedom begins!
                </h3>
                <p className="text-lg opacity-80 mb-6" style={{ color: 'var(--text)' }}>
                  Would you like to explore our FAQs? Select a category below to get started.
                </p>
              </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`p-6 rounded-2xl text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${activeCategory === category.id ? 'ring-2' : ''}`}
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderColor: activeCategory === category.id ? 'var(--primary)' : 'var(--border)'
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${category.color}`}>
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-sm opacity-70" style={{ color: 'var(--text)' }}>
                    {category.description}
                  </p>
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-[var(--primary)]/10 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
               >
                        <HelpCircle className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      </div>
                      <h3 className="font-semibold text-lg" style={{ color: 'var(--text)' }}>
                        {faq.question}
                      </h3>
                    </div>
                    {openFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                    ) : (
                      <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                    )}
                  </button>
                  
                  {openFAQ === faq.id && (
                    <div className="px-6 pb-5 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                      <div className="pl-12">
                        <p className="opacity-80 leading-relaxed" style={{ color: 'var(--text)' }}>
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* End Message & Actions */}
            <div className="mt-16">
              <div 
                className="rounded-2xl p-8 text-center"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)'
                }}
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="bg-[var(--primary)]/10 w-12 h-12 rounded-xl flex items-center justify-center"
    >
                    <Sparkles className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                  🎉 Thanks for exploring our FAQs!
                </h3>
                <p className="text-lg opacity-80 mb-8" style={{ color: 'var(--text)' }}>
                  Ready to take the next step towards your financial freedom?
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={getUrlWithRef("/signup")}
                    className="group px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: 'white'
                    }}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>🔗 Register Now</span>
                  </Link>
                  
                  <Link
                    href={getUrlWithRef("/contact")}
                    className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--card)',
                      border: `1px solid var(--border)`,
                      color: 'var(--text)'
                    }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>🧑💼 Contact Support</span>
                  </Link>
                  
                  <a
                    href="https://www.pash.club"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--card)',
                      border: `1px solid var(--border)`,
                      color: 'var(--text)'
                    }}
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>🌐 Visit Official Website</span>
                  </a>
                </div>

                {/* Quick Links */}
                <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className="p-3 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                        style={{ 
                          backgroundColor: 'var(--cardSecondary)',
                          color: 'var(--text)'
                        }}
                      >
                        {category.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "FAQs", value: "40+" },
                { label: "Categories", value: "6" },
                { label: "Active Members", value: "1k+" },
                { label: "Countries", value: "100+" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl text-center"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--primary)' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm opacity-70" style={{ color: 'var(--text)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

    </>
  );
}