"use client";
import { useState, useEffect } from "react";

const languages = {
  en: "🇺🇸 EN",
  fr: "🇫🇷 FR", 
  es: "🇪🇸 ES",
  nl: "🇳🇱 NL",
  pt: "🇵🇹 PT"
};

export default function TranslateWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Prevent loading on server-side
    if (typeof window === 'undefined' || !mounted) return;

    // Check if Google Translate is already loaded
    if (window.google?.translate?.TranslateElement) {
      initTranslate();
      return;
    }

    // Load Google Translate script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    window.googleTranslateElementInit = () => {
      initTranslate();
    };

    return () => {
      delete window.googleTranslateElementInit;
    };
  }, [mounted]);

  const initTranslate = () => {
    if (window.google?.translate?.TranslateElement) {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,fr,es,nl,pt'
      }, 'google_translate_element');
    }
  };

  const handleLanguageChange = (lang) => {
    setSelected(lang);
    setIsOpen(false);
    
    // Find the Google Translate select element
    setTimeout(() => {
      const select = document.querySelector('.goog-te-combo');

      if (select) {
        if (lang === "en") {
          // More reliable reset for English: set the googtrans cookie and reload.
          // Google Translate stores the translation in the 'googtrans' cookie as '/source/target'.
          try {
            const cookieValue = '/en/en';
            // set cookie for current domain/path and long expiry
            document.cookie = `googtrans=${cookieValue};path=/;expires=Fri, 31 Dec 9999 23:59:59 GMT`;
            document.cookie = `googtrans=${cookieValue};domain=${window.location.hostname};path=/;expires=Fri, 31 Dec 9999 23:59:59 GMT`;
          } catch (e) {
            console.warn('Could not set googtrans cookie', e);
          }

          // Small delay then reload to fully clear the translation
          setTimeout(() => {
            window.location.reload();
          }, 250);
        } else {
          // For non-English languages try to use the translate dropdown
          try {
            select.value = lang;
            const event = new Event('change', { bubbles: true, cancelable: true });
            select.dispatchEvent(event);
          } catch (e) {
            console.warn('Failed to change translate select value', e);
          }
        }

        console.log(`Language changed to: ${lang}`);
      } else {
        console.warn('Google Translate element not found');
      }
    }, 150);
  };

  return (
    <div className="relative">
      <div id="google_translate_element" className="hidden"></div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm rounded-md transition-colors"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          color: "var(--text)"
        }}
      >
        <span>{languages[selected] || languages["en"]}</span>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className="absolute right-0 mt-1 py-1 rounded-md shadow-lg z-50"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)"
          }}
        >
          {Object.entries(languages).map(([code, label]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`block w-full px-3 py-1 text-sm text-left transition-opacity ${
                selected === code ? 'font-bold opacity-100' : 'hover:opacity-80'
              }`}
              style={{ color: "var(--text)" }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}