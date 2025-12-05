import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    
    if (!cursor || !ring) return;

    // Center alignment offsets
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
    
    // Ring follows slower for fluid feel
    const ringXTo = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const ringYTo = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      ringXTo(e.clientX);
      ringYTo(e.clientY);
    };

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);

    // Attach listeners to all clickable elements
    const clickables = document.querySelectorAll('a, button, .clickable');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    // Mutation observer to handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const newClickables = document.querySelectorAll('a, button, .clickable');
          newClickables.forEach(el => {
            el.removeEventListener('mouseenter', handleHoverStart); // Avoid duplicates
            el.removeEventListener('mouseleave', handleHoverEnd);
            el.addEventListener('mouseenter', handleHoverStart);
            el.addEventListener('mouseleave', handleHoverEnd);
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clickables.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    const cursor = cursorRef.current;
    if (!ring || !cursor) return;

    if (isHovering) {
      gsap.to(ring, { 
        scale: 4, 
        opacity: 0.1, 
        backgroundColor: '#7C3AED', 
        borderColor: 'transparent',
        duration: 0.3 
      });
      gsap.to(cursor, {
        scale: 0.5,
        backgroundColor: '#7C3AED',
        duration: 0.3
      });
    } else {
      gsap.to(ring, { 
        scale: 1, 
        opacity: 0.5, 
        backgroundColor: 'transparent', 
        borderColor: '#151515',
        borderWidth: '1px',
        duration: 0.3 
      });
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: '#151515',
        duration: 0.3
      });
    }
  }, [isHovering]);

  return (
    <>
      <div 
        ref={ringRef} 
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-black pointer-events-none z-[9998] hidden md:block"
      />
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-black rounded-full pointer-events-none z-[9999] hidden md:block"
      />
    </>
  );
};

export default CustomCursor;