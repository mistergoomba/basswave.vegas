'use client';

import { useEffect, useRef, useState } from 'react';

const frameCount = 150;
const getFrameSrc = (index) => `/video-frames/frame_${String(index).padStart(4, '0')}.jpg`;

export default function ScrollVideoCanvas() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const preloadImages = async () => {
      const imgs = await Promise.all(
        Array.from({ length: frameCount }, (_, i) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = getFrameSrc(i + 1);
            img.onload = () => resolve(img);
          });
        })
      );
      setImages(imgs);
    };
    preloadImages();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / maxScroll;
      const frameIndex = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));

      const currentImage = images[frameIndex];
      if (currentImage) {
        context.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Draw first frame immediately
    if (images.length > 0) {
      const firstImage = images[0];
      context.drawImage(firstImage, 0, 0, canvas.width, canvas.height);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [images]);

  return (
    <canvas
      ref={canvasRef}
      width={1080}
      height={1920}
      className='fixed top-0 left-1/2 -translate-x-1/2 h-screen z-[-1]'
    />
  );
}
