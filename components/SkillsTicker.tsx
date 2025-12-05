import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SKILLS_ROW_1 = ["FIGMA", "DESIGN SYSTEMS", "PROTOTYPING", "USER RESEARCH", "WIREFRAMING"];
const SKILLS_ROW_2 = ["ADOBE XD", "B2B SAAS", "AI/ML INTERFACES", "VISILY", "UX STRATEGY", "ARCHITECTURE"];

const TickerBand: React.FC<{ skills: string[]; direction: 'left' | 'right'; outline?: boolean }> = ({ skills, direction, outline }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;
    
    // Duplicate content for seamless loop (triple it for safety on wide screens)
    const content = el.innerHTML;
    el.innerHTML = content + content + content;
    
    const distance = el.scrollWidth / 3;
    const duration = 20;

    // Infinite Scroll
    const tl = gsap.to(el, { 
      x: direction === 'left' ? -distance : 0, 
      duration: duration, 
      ease: "none", 
      repeat: -1,
      onRepeat: () => {
        gsap.set(el, { x: direction === 'left' ? 0 : -distance });
      }
    });

    if (direction === 'right') {
      gsap.set(el, { x: -distance });
      tl.vars.x = 0;
      tl.invalidate().restart();
    }

    // Velocity Skew Effect
    // We proxy the scroll velocity to the skew of the wrapper
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        // Limit the skew to reasonable amounts (-10 to 10 deg)
        // Direction 'right' rows should skew opposite for visual contrast
        const skewAmount = Math.max(-10, Math.min(10, velocity / 300));
        
        gsap.to(wrapperRef.current, {
          skewX: direction === 'left' ? skewAmount : -skewAmount,
          duration: 0.5,
          ease: "power3.out",
          overwrite: 'auto'
        });
      }
    });

  }, []);

  return (
    <div className="overflow-hidden py-4" ref={wrapperRef}>
      <div ref={containerRef} className="inline-block whitespace-nowrap will-change-transform">
        {skills.map((skill, i) => (
          <span key={i} className={`inline-block mx-8 text-5xl md:text-8xl font-serif italic ${outline ? 'text-transparent stroke-black stroke-1 opacity-40' : 'text-black'}`}
          style={outline ? { WebkitTextStroke: '1px #151515' } : {}}>
            {skill} <span className="text-violet mx-4 text-2xl">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const SkillsTicker: React.FC = () => {
  return (
    <div className="w-full py-12 flex flex-col gap-8">
      <TickerBand skills={SKILLS_ROW_1} direction="left" />
      <TickerBand skills={SKILLS_ROW_2} direction="right" outline={true} />
    </div>
  );
};

export default SkillsTicker;