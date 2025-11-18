import Link from "next/link";

export default function Footer() {
  return (
    <footer 
      className="border-t"
      style={{ 
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>PASH.CLUB</h3>
            <p className="mb-4 opacity-80">
              Receive updates and latest news
            </p>
            <div className="opacity-80">
              <p>www.pash.club</p>
              <p>support@pash.club</p>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Explore</h4>
            <ul className="space-y-2 opacity-80">
              <li><Link href="/privacy-policy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:opacity-100 transition-opacity">Terms & Conditions</Link></li>
              <li><Link href="/earnings-disclaimer" className="hover:opacity-100 transition-opacity">Earnings Disclaimer</Link></li>
              <li><Link href="/refund-policy" className="hover:opacity-100 transition-opacity">Refund Policy</Link></li>
              <li><Link href="/affiliate-agreement" className="hover:opacity-100 transition-opacity">Affiliate Agreement</Link></li>
              <li><Link href="/contact" className="hover:opacity-100 transition-opacity">Contact</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Connect with us</h4>
            <div className="opacity-80 space-y-2">
              <p>Instagram | Twitter | Youtube</p>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Legal</h4>
            <ul className="space-y-2 opacity-80">
              <li><Link href="/faq" className="hover:opacity-100 transition-opacity">FAQ</Link></li>
              <li><Link href="/terms" className="hover:opacity-100 transition-opacity">Terms of Condition</Link></li>
              <li><Link href="/privacy-policy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
              <li><Link href="/changelog" className="hover:opacity-100 transition-opacity">Changelog</Link></li>
            </ul>
          </div>
        </div>

        <div 
          className="border-t mt-8 pt-8 text-center opacity-70"
          style={{ borderColor: 'var(--border)' }}
        >
          <p>&copy; {new Date().getFullYear()} PASH.CLUB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}