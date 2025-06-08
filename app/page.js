'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Orbitron, Bungee_Shade } from 'next/font/google';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import BasswaveLogo from '../public/basswave-logo.png';
import ScrollVideoCanvas from '@/components/ScrollVideoCanvas';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const bungee = Bungee_Shade({
  subsets: ['latin'],
  weight: '400',
});

export default function IntroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [isBlueSquareStuck, setIsBlueSquareStuck] = useState(false);
  const [showFinalLogo, setShowFinalLogo] = useState(false);

  const endTriggerRef = useRef();
  const blueSquareRef = useRef();
  const logoRef = useRef();
  const badgeTriggerRef = useRef();
  const logoTriggerRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      if (logoTriggerRef.current) {
        const distanceFromTop = logoTriggerRef.current.getBoundingClientRect().top;
        setIsFixed(distanceFromTop <= 0);
      }

      if (badgeTriggerRef.current) {
        const triggerY = badgeTriggerRef.current.getBoundingClientRect().top;
        setShowBadge(triggerY <= window.innerHeight / 2 && triggerY >= 0);
      }

      if (blueSquareRef.current) {
        const triggerY = blueSquareRef.current.getBoundingClientRect().top;
        const screenCenter = window.innerHeight / 2;
        setIsBlueSquareStuck(triggerY <= screenCenter && triggerY >= 0);
      }

      if (endTriggerRef.current) {
        const triggerY = endTriggerRef.current.getBoundingClientRect().top;
        const triggerZone = window.innerHeight * 0.75;
        setShowFinalLogo(triggerY <= triggerZone);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className='relative min-h-[400vh] w-full text-white'>
      <ScrollVideoCanvas />

      {/* Scrollable logo block */}
      <div
        className='relative h-[100vh] pt-[40vh]'
        style={{ opacity: showFinalLogo ? 0 : 1, transition: 'opacity 0.5s ease' }}
      >
        {/* Dummy div to track position */}
        <div ref={logoTriggerRef} className='h-[1px] w-full' />

        <div style={{ height: isFixed ? logoRef.current?.offsetHeight : 'auto' }} />

        <div
          ref={logoRef}
          className={`flex flex-col items-center justify-center transition-all duration-300 ${
            isFixed ? 'fixed top-0 left-0 w-full z-20' : 'relative'
          }`}
        >
          <Image src={BasswaveLogo} alt='Basswave Logo' className='w-60 h-auto mb-2' priority />
          <h2
            className={`text-3xl tracking-widest uppercase opacity-0 animate-fade-in ${orbitron.className}`}
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
          >
            Presents
          </h2>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        className='fixed bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center text-sm text-white/70 transition-opacity duration-300 z-20 pointer-events-none'
        style={{
          opacity: showFinalLogo ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      >
        <span className='mb-1 text-xs tracking-widest'>scroll down</span>
        <FaChevronDown className='animate-bounce text-2xl' />
      </div>

      {/* Trigger zone for badge */}
      <div ref={badgeTriggerRef} className='h-[50vh] w-full' />

      {/* Animated sunburst badge */}
      <AnimatePresence>
        {showBadge && !showFinalLogo && (
          <motion.div
            key='badge'
            initial={{ clipPath: 'circle(0% at 50% 50%)', opacity: 0 }}
            animate={{ clipPath: 'circle(150% at 50% 50%)', opacity: 1 }}
            exit={{ clipPath: 'circle(0% at 50% 50%)', opacity: 0 }}
            transition={{ duration: 1 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-3xl md:text-5xl p-8 rounded-full bg-blue-900/90 text-white max-w-[400px] ${bungee.className}`}
          >
            A POOL PARTY FOR THE AGES!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blue square scroll trigger */}
      <div ref={blueSquareRef} className='h-[100vh] w-full bg-transparent' />

      {/* Blue square */}
      <AnimatePresence>
        {isBlueSquareStuck && !showFinalLogo && (
          <motion.div
            key='blue-square'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30'
          >
            <Image
              src='/july-13-lexi.png'
              alt='Lexi Info'
              width={300}
              height={300}
              className='max-w-[80vw] h-auto'
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll trigger for final logo reveal */}
      <div ref={endTriggerRef} className='h-[100vh] w-full bg-transparent' />

      {/* Final AQUARIUM logo + link */}
      <AnimatePresence>
        {showFinalLogo && (
          <motion.div
            key='aquarium-logo'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className='fixed inset-0 flex flex-col items-center justify-center text-center z-40'
          >
            <Image
              src='/the-aquarium.png'
              alt='The Aquarium Logo'
              width={400}
              height={150}
              className='mb-6 w-full max-w-[500px] h-auto'
            />
            <motion.a
              href='#'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className='px-6 py-3 bg-blue-600 text-white rounded-lg text-lg shadow-lg animate-pulse-glow'
            >
              More Info
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 18px rgba(255, 255, 255, 0.8);
          }
          100% {
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
    </section>
  );
}
