"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Copy, Check} from "lucide-react";

export default function ReferralDashboard() {
  const { data: session } = useSession();

  const [copied, setCopied] = useState(false);
    const [showSponsorModal, setShowSponsorModal] = useState(false);
      const [user, setUser] = useState(null);

  const referralLink = `${window.location.origin}/register?ref=${session?.user?.username || "user"}`;

  useEffect(() => {
    fetchSponsor();
  }, []);

  async function fetchSponsor() {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();

      if (!data.error) {
        setUser(data.user);

      }
    } catch (err) {
      console.error(err);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  return (
    <div className="space-y-8">


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Referral Link Card */}
        <div 
          className="rounded-2xl shadow-xl overflow-hidden"
          style={{ 
            backgroundColor: 'var(--card)',
            border: `1px solid var(--border)`
          }}
        >
          <div className="px-6 py-4" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
              Your Referral Link
            </h2>
            <p className="text-sm opacity-70 mt-1">
              Share this link to invite friends and earn rewards
            </p>
          </div>

          <div className="px-6 py-2">
            {/* Link Display */}
            <div className="mb-3">
              <div className="relative">
                <div 
                  className="rounded-xl p-4 pr-20 break-all text-sm"
                  style={{ 
                    backgroundColor: 'var(--cardSecondary)',
                    border: `2px solid var(--border)`
                  }}
                >
                  {referralLink}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 top-3 p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                  style={{ 
                    backgroundColor: copied ? 'var(--accent)' : 'var(--primary)',
                    color: 'white'
                  }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

       

          </div>
        </div>

        {/* Sponsored By Section */}
        <div 
          className="rounded-2xl shadow-xl overflow-hidden"
          style={{ 
            backgroundColor: 'var(--card)',
            border: `1px solid var(--border)`
          }}
        >
          <div className="px-6 py-4" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
                Sponsored By
              </h2>

              {user?.sponsor ?
              (<div 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'white'
                }}
              >
             { user?.isPassup ? 'Passup Sponsor' : 'Direct Sponsor' }
              </div>) : null}
            </div>
     
                    
          </div>

          <div className="p-6 space-y-6">
       {user?.sponsor ? (
                        <div className="flex items-center justify-center gap-3">
                          {user.sponsor.profilePicture ? (
                            <Image
                              src={user.sponsor.profilePicture}
                              alt={user.sponsor.name || 'Sponsor'}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                              style={{ backgroundColor: 'var(--primary)' }}
                              title={user.sponsor.name || 'Sponsor'}
                            >
                              {user.sponsor.name?.charAt(0)?.toUpperCase() || 'S'}
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <p className="font-semibold" style={{ color: 'var(--text)' }}>
                              {user?.sponsor.name}
                            </p>
                            <button
                              onClick={() => setShowSponsorModal(true)}
                              className="p-1 transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                              style={{ color: 'var(--accent)' }}
                              title="View Profile"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm" style={{ color: 'var(--textSecondary)' }}>No sponsor</p>
                      )}
          </div>


        </div>
          {/* Sponsor Profile Modal */}
                {showSponsorModal && user?.sponsor && (
                  <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 p-4">
                    <div 
                      className="rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                      style={{ backgroundColor: 'var(--card)' }}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Sponsor Profile</h2>
                          <button
                            onClick={() => setShowSponsorModal(false)}
                            className="p-2 hover:opacity-70 transition-opacity"
                            style={{ color: 'var(--text)' }}
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
        
                        <div className="text-center mb-6">
                          {user.sponsor.profilePicture ? (
                            <Image
                              src={user.sponsor.profilePicture}
                              alt={user.sponsor.name}
                              width={96}
                              height={96}
                              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                            />
                          ) : (
                            <div 
                              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white"
                              style={{ backgroundColor: 'var(--primary)' }}
                            >
                              {user.sponsor.name?.charAt(0)?.toUpperCase() || 'S'}
                            </div>
                          )}
                          <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
                            {user.sponsor.name}
                          </h3>
                          <p className="opacity-70">@{user.sponsor.username}</p>
                        </div>
        
                        <div className="mt-6 pt-6" style={{ borderTop: `1px solid var(--border)` }}>
                          <h4 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Social Links</h4>
                          <div className="grid grid-cols-4 gap-3">
                            {/* Email */}
                            <a
                              href={`mailto:${user.sponsor.email || ''}`}
                              className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                              style={{ backgroundColor: 'var(--cardSecondary)', color: '#EA4335' }}
                              title="Email"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819v.273L12 8.91l6.545-4.816v-.273h3.819c.904 0 1.636.732 1.636 1.636z"/>
                              </svg>
                            </a>
        
                            {/* Facebook */}
                            {user.sponsor.socialMedia?.facebook && user.sponsor.socialMedia.facebook.trim() !== '' ? (
                              <a
                                href={user.sponsor.socialMedia.facebook.startsWith('http') ? user.sponsor.socialMedia.facebook : `https://facebook.com/${user.sponsor.socialMedia.facebook}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                                style={{ backgroundColor: 'var(--cardSecondary)', color: '#1877F2' }}
                                title="Facebook"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                              </a>
                            ) : (
                              <div className="p-3 rounded-lg opacity-30 flex items-center justify-center" style={{ backgroundColor: 'var(--cardSecondary)', color: '#1877F2' }}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                              </div>
                            )}
        
                            {/* Instagram */}
                            {user.sponsor.socialMedia?.instagram && user.sponsor.socialMedia.instagram.trim() !== '' ? (
                              <a
                                href={user.sponsor.socialMedia.instagram.startsWith('http') ? user.sponsor.socialMedia.instagram : `https://instagram.com/${user.sponsor.socialMedia.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                                style={{ backgroundColor: 'var(--cardSecondary)', color: '#E4405F' }}
                                title="Instagram"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                              </a>
                            ) : (
                              <div className="p-3 rounded-lg opacity-30 flex items-center justify-center" style={{ backgroundColor: 'var(--cardSecondary)', color: '#E4405F' }}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                              </div>
                            )}
        
                            {/* TikTok */}
                            {user.sponsor.socialMedia?.tiktok && user.sponsor.socialMedia.tiktok.trim() !== '' ? (
                              <a
                                href={user.sponsor.socialMedia.tiktok.startsWith('http') ? user.sponsor.socialMedia.tiktok : `https://tiktok.com/@${user.sponsor.socialMedia.tiktok}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                                style={{ backgroundColor: 'var(--cardSecondary)', color: '#000000' }}
                                title="TikTok"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                                </svg>
                              </a>
                            ) : (
                              <div className="p-3 rounded-lg opacity-30 flex items-center justify-center" style={{ backgroundColor: 'var(--cardSecondary)', color: '#000000' }}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                                </svg>
                              </div>
                            )}
        
                            {/* WhatsApp */}
                            {user.sponsor.socialMedia?.whatsapp && user.sponsor.socialMedia.whatsapp.trim() !== '' ? (
                              <a
                                href={`https://wa.me/${user.sponsor.socialMedia.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                                style={{ backgroundColor: 'var(--cardSecondary)', color: '#25D366' }}
                                title="WhatsApp"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                                </svg>
                              </a>
                            ) : (
                              <div className="p-3 rounded-lg opacity-30 flex items-center justify-center" style={{ backgroundColor: 'var(--cardSecondary)', color: '#25D366' }}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
      </div>

 
    </div>
  );
}
