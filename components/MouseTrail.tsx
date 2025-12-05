import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const MouseTrail: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;
      
      const { clientX, clientY } = e;
      
      gsap.to(glowRef.current, {
        x: clientX,
        y: clientY,
        duration: 1.5,
        ease: "power3.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* The Glow */}
      <div 
        ref={glowRef}
        className="absolute w-[600px] h-[600px] bg-lavender/20 rounded-full blur-[100px] mix-blend-multiply opacity-60 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      />
    </div>
  );
};

export default MouseTrail;