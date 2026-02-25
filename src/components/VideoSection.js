"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Play } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import thumbnailLight from "../assets/thumbnail-light.jpeg";
import thumbnailDark from "../assets/thumbnail-dark.jpeg";

function AnimatedSection({ children, delay = 0 }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  
  const videoUrl = "https://res.cloudinary.com/daennbn5f/video/upload/v1765208074/PASH.CLUB_How_Does_It_work_1UP_Comp_Plan_Male_New_Music_ebc2ed.mov";
  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'light';
  const thumbnail = currentTheme === 'dark' ? thumbnailDark : thumbnailLight;

  return (
    <section id="video-section" className="py-20" style={{ backgroundColor: 'var(--card)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
              See Exactly How the PASH.CLUB System Works, In Less Than 5 Minutes
            </h2>
            <p className="text-lg opacity-80" style={{ color: 'var(--text)' }}>
              Watch this short explainer video to understand how thousands of learners are building practical digital skills using our structured training, implementation tools, and supportive community.
            </p>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.3}>
          <motion.div 
            className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
            style={{ 
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)'
            }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="aspect-video relative">
              {!isPlaying ? (
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={() => setIsPlaying(true)}
                >
                  <Image
                    src={thumbnail}
                    alt="Video thumbnail"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black opacity-30"></div>
                  <motion.div 
                    className="relative w-20 h-20 rounded-full flex items-center justify-center z-10"
                    style={{ backgroundColor: 'var(--primary)' }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Play className="w-10 h-10 text-white ml-1" />
                  </motion.div>
                </div>
              ) : (
                <video
                  className="w-full h-full"
                  controls
                  src={videoUrl}
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}
