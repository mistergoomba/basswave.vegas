'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Orbitron, Bungee_Shade } from 'next/font/google';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import BasswaveLogo from '../public/basswave-logo.png';
import ScrollVideoCanvas from '@/components/ScrollVideoCanvas';

import SplashLeft from '../public/splash-left.png';
import SplashRight from '../public/splash-right.png';
import TheAquarium from '../public/the-aquarium.png';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700'] });
const bungee = Bungee_Shade({ subsets: ['latin'], weight: '400' });

function HalfCircleLeft({ rotation }) {
  return (
    <div
      className='fixed top-1/2 z-50'
      style={{
        width: '100vw',
        left: '-100vw',
        transform: `translateY(-50%) rotate(${rotation}deg)`,
        transformOrigin: '100% 50%',
        pointerEvents: 'none',
      }}
    >
      <Image src={SplashLeft} alt='Splash Left' className='w-full h-auto' />
    </div>
  );
}

function HalfCircleRight({ rotation }) {
  return (
    <div
      className='fixed top-1/2 z-50'
      style={{
        width: '100vw',
        right: '-100vw',
        transform: `translateY(-50%) rotate(${rotation}deg)`,
        transformOrigin: '0% 50%',
        pointerEvents: 'none',
      }}
    >
      <Image src={SplashRight} alt='Splash Right' className='w-full h-auto' />
    </div>
  );
}

export default function IntroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [isBlueSquareStuck, setIsBlueSquareStuck] = useState(false);
  const [showFinalLogo, setShowFinalLogo] = useState(false);
  const [splashProgress, setSplashProgress] = useState(0);

  const endTriggerRef = useRef();
  const blueSquareRef = useRef();
  const logoRef = useRef();
  const badgeTriggerRef = useRef();
  const logoTriggerRef = useRef();
  const splashStartRef = useRef();

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

      if (splashStartRef.current && endTriggerRef.current) {
        const startRect = splashStartRef.current.getBoundingClientRect();
        const endRect = endTriggerRef.current.getBoundingClientRect();

        const viewportHeight = window.innerHeight;
        const scrollStart = viewportHeight;
        const scrollEnd = 0;

        const totalDistance = startRect.top - endRect.top;
        const currentDistance = Math.min(
          Math.max(viewportHeight - startRect.top, 0),
          totalDistance
        );
        const progress = totalDistance > 0 ? currentDistance / totalDistance : 0;

        setSplashProgress(progress);
        setShowFinalLogo(progress > 0);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftRotation = -360 * splashProgress;
  const rightRotation = 360 * splashProgress;

  return (
    <section className='relative min-h-[600vh] w-full text-white'>
      <ScrollVideoCanvas />

      <div
        className='relative h-[100vh] pt-[40vh]'
        style={{ opacity: showFinalLogo ? 0 : 1, transition: 'opacity 0.5s ease' }}
      >
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

      <div
        className='fixed bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center text-sm text-white/70 transition-opacity duration-300 z-20 pointer-events-none'
        style={{ opacity: showFinalLogo ? 0 : 1, transition: 'opacity 0.5s ease' }}
      >
        <span className='mb-1 text-xs tracking-widest'>scroll down</span>
        <FaChevronDown className='animate-bounce text-2xl' />
      </div>

      <div ref={badgeTriggerRef} className='h-[50vh] w-full' />

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

      <div ref={blueSquareRef} className='h-[100vh] w-full bg-transparent' />

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

      <div ref={splashStartRef} className='h-[100vh] w-full bg-transparent' />
      <div ref={endTriggerRef} className='h-[200vh] w-full bg-transparent' />

      <HalfCircleLeft rotation={leftRotation} />
      <HalfCircleRight rotation={rightRotation} />

      <AnimatePresence>
        {showFinalLogo === 1 && (
          <motion.div
            key='aquarium-final'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className='fixed inset-0 flex items-center justify-center z-40 bg-black'
          >
            <Image
              src={TheAquarium}
              alt='The Aquarium Logo'
              width={500}
              height={200}
              className='w-full max-w-[500px] h-auto'
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className='relative z-40 transition-opacity duration-500'
        style={{ opacity: showFinalLogo ? 1 : 0 }}
      >
        <section className='min-h-screen bg-white text-black flex items-center justify-center'>
          <div className='max-w-xl text-center'>
            <h2 className='text-4xl font-bold mb-4'>The Splash Zone</h2>
            <p className='text-lg'>
              Here’s all the juicy info we washed in just for you. Pool party details, RSVP links,
              etc.
            </p>
          </div>
        </section>
      </div>

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
      `}</style>
    </section>
  );
}
