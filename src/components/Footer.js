"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "../contexts/RefContext";
import { Mail, Phone, ExternalLink, ChevronDown, Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const { getUrlWithRef } = useRef();
  const [expandedDisclaimer, setExpandedDisclaimer] = useState(null);

  return (
    <footer 
      className="border-t"
      style={{ 
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">

  {/* Certifications & Trust Badges */}
        <div className="mb-8">
          <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide" style={{ color: 'var(--primary)' }}>Certifications & Trust</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ maxWidth: '1000px' }}>
            <a href="https://www.trustpilot.com/review/pash.club" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }} title="Trustpilot Reviews">
                <Image src="/logos/Trust-Pilot.png" alt="Trust Pilot" width={50} height={30} />
              <span>Trustpilot</span>
            </a>
            <a href="https://www.bbb.org/us/nm/albuquerque/profile/affiliate-marketing/pash-club-llc-0806-99186609" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }} title="BBB Better Business Bureau">
                <Image src="/logos/BBB.png" alt="BBB" width={50} height={30} />
              <span>BBB Better Business Bureau®</span>
            </a>
            <a href="https://www.dnb.com/business-directory/company-profiles.pash_club_llc.d21f23ae29222c5dcd079a78aea15f08.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }} title="Dun & Bradstreet">
                <Image src="/logos/DUN-and-Bradstreet.png" alt="DUN-and-Bradstreet" width={35} height={30} />
              <span>Dun & Bradstreet</span>
            </a>
          </div>
          <p className="mt-4 text-xs opacity-75" style={{ color: 'var(--text)' }}>
            <strong>PASH CLUB™</strong> name, logo, and slogan are protected trademarks™. Unauthorized use is prohibited. Contact <a href="mailto:info@pash.club" className="underline hover:opacity-80">admin</a> for permission.
          </p>
        </div>

        {/* Disclaimers - Accordion */}
        <div className="border-t mb-8 pt-8" style={{ borderColor: 'var(--border)' }}>
          <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide" style={{ color: 'var(--primary)' }}>Disclosures</h4>
          
          <div className="space-y-2">
            {[
              { title: "📋 Testimonials Disclaimer", content: "Case studies, and examples found on this page are results that have been our own experiences & forwarded to us by users of our products, and may not reflect the typical purchaser's experience, may not apply to the average person and are not intended to represent or guarantee that anyone will achieve the same or similar results.", id: 1 },
              { title: "📹 YouTube Disclaimer", content: "This website may reference or embed YouTube videos to enhance the user experience and offer relevant insights. All videos are publicly available on YouTube and remain the intellectual property of their respective creators. We do not claim ownership, upload copied content, or violate any copyright rules. Our sole intention is to guide and educate users by linking directly to original YouTube sources.", id: 2 },
              { title: "💰 Income Disclaimer", content: "This website and the items it distributes contain business strategies, marketing methods and other business advice that, regardless of our own results and experience, may not produce the same results (or any results) for you. PASH.CLUB makes absolutely no guarantee, expressed or implied, that by following the advice or content available from this web site you will make any money or improve current profits, as there are several factors and variables that come into play regarding any given business. Primarily, results will depend on the nature of the product or business model, the conditions of the marketplace, the experience of the individual, and situations and elements that are beyond your control. You may make more, less or no money at all. As with any business endeavour, you assume all risk related to investment and money based on your own discretion and at your own potential expense.", id: 3 },
              { title: "⚖️ Liability Disclaimer", content: "By reading this website or the documents it offers, you assume all risks associated with using the advice given, with a full understanding that you, solely, are responsible for anything that may occur as a result of putting this information into action in any way, and regardless of your interpretation of the advice. You further agree that our company cannot be held responsible in any way for the success or failure of your business as a result of the information provided by our company. It is your responsibility to conduct your own due diligence regarding the safe and successful operation of your business if you intend to apply any of our information in any way to your business operations. In summary, you understand that we make absolutely no guarantees regarding income as a result of applying this information, as well as the fact that you are solely responsible for the results of any action taken on your part as a result of any given information. In addition, for all intents and purposes you agree that our content is to be considered \"for entertainment purposes only\". Always seek the advice of a professional when making financial, tax or business decisions.", id: 4 }
            ].map((disclaimer) => (
              <div key={disclaimer.id} className="border rounded text-xs" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setExpandedDisclaimer(expandedDisclaimer === disclaimer.id ? null : disclaimer.id)}
                  className="w-full p-3 flex items-center justify-between hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: 'var(--card)' }}
                >
                  <span className="font-semibold" style={{ color: 'var(--text)' }}>{disclaimer.title}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedDisclaimer === disclaimer.id ? 'rotate-180' : ''}`} style={{ color: 'var(--primary)' }} />
                </button>
                
                {expandedDisclaimer === disclaimer.id && (
                  <div className="p-3 border-t opacity-75" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                    {disclaimer.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-6 gap-10 mb-12 border-t pt-8" style={{ borderColor: 'var(--border)' }}>
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>PASH.CLUB</h3>
            <p className="text-sm opacity-80 mb-6" style={{ color: 'var(--text)' }}>
              Professional training platform for digital skills development.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide" style={{ color: 'var(--primary)' }}>Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={getUrlWithRef("/")} className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>Home</Link></li>
              <li><Link href={getUrlWithRef("/about")} className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>About</Link></li>
              <li><Link href={getUrlWithRef("/faq")} className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>FAQ</Link></li>
              <li><Link href={getUrlWithRef("/contact")} className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>Contact</Link></li>
                   <li><Link href={getUrlWithRef("/products")} className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>Resources</Link></li>
              <li><Link href={getUrlWithRef("/blogs")} className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>Training</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide" style={{ color: 'var(--primary)' }}>Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={getUrlWithRef("/privacy")} className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>Privacy</Link></li>
              <li><Link href={getUrlWithRef("/terms")} className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>Terms</Link></li>
              <li><Link href={getUrlWithRef("/payment-policies")} className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>Payment Policies</Link></li>
              <li><Link href={getUrlWithRef("/affiliate")} className="opacity-80 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>Affiliate</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide" style={{ color: 'var(--primary)' }}>Contact</h4>
            <div className="space-y-2 text-sm">
              <a href="mailto:info@pash.club" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>
                <Mail className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span>info@pash.club</span>
              </a>
              <a href="tel:+16313266177" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>
                <Image src="/logos/whatsapp-logo.png" alt="WhatsApp" width={18} height={18} />
                <span>+1 (289) 796 8899 </span>
              </a>
            </div>
          </div>

          {/* Offices */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide" style={{ color: 'var(--primary)' }}>Offices</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>🇨🇦 Canada</p>
                <p className="opacity-80 text-xs" style={{ color: 'var(--text)' }}>35 Shoreham Dr, Toronto, ON M3N 1S5</p>
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>🇺🇸 United States</p>
                <p className="opacity-80 text-xs" style={{ color: 'var(--text)' }}>1209 Mountain Road Pl NE #7943, Albuquerque, NM 87110</p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wide" style={{ color: 'var(--primary)' }}>Follow Us</h4>
            <div className="flex gap-3 flex-wrap">
              <a href="https://www.instagram.com/PASH.CLUB" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg hover:scale-110 transition-all duration-200" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} title="Instagram">
                <Instagram className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </a>
              <a href="https://www.facebook.com/PASH.CLUB" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg hover:scale-110 transition-all duration-200" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} title="Facebook">
                <Facebook className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </a>
              <a href="https://x.com/PASHCLUB" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg hover:scale-110 transition-all duration-200" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} title="Twitter/X">
                <Twitter className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </a>
              <a href="https://www.youtube.com/@PASHCLUB" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg hover:scale-110 transition-all duration-200" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} title="YouTube">
                <Youtube className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </a>
              <a href="https://www.tiktok.com/@clubpash" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg hover:scale-110 transition-all duration-200" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} title="TikTok">
                <Image src="/logos/tiktok-logo.png" alt="TikTok" width={20} height={20} />
              </a>
              <a href="https://www.whatsapp.com/channel/0029Vb6a4msBVJlCcJb4wc2W" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg hover:scale-110 transition-all duration-200" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} title="WhatsApp">
                <Image src="/logos/whatsapp-logo.png" alt="WhatsApp" width={20} height={20} />
              </a>
            </div>
          </div>
        </div>


        {/* Copyright */}
        <div 
          className="border-t pt-6 text-center text-xs opacity-70"
          style={{ borderColor: 'var(--border)' }}
        >
          <p>&copy; {new Date().getFullYear()} PASH.CLUB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}