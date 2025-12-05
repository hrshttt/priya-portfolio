
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  link: string;
}

const CASES: CaseStudy[] = [
  {
    id: '01',
    title: 'Hearzap Experience',
    category: 'Healthcare Ecosystem',
    description: 'Redefining auditory care with a seamless connection between patients and audiologists.',
    image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=2670&auto=format&fit=crop',
    link: 'https://www.figma.com'
  },
  {
    id: '02',
    title: 'TalentXchange AI',
    category: 'B2B Recruitment',
    description: 'Visualizing complex AI matching algorithms for high-volume corporate hiring dashboards.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop',
    link: 'https://www.figma.com'
  },
  {
    id: '03',
    title: 'Vincere Partners',
    category: 'FinTech Portfolio',
    description: 'A monolithic investor platform built to showcase partner companies with data-driven aesthetics.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop',
    link: 'https://www.figma.com'
  },
  {
    id: '04',
    title: 'Nano Tools Suite',
    category: 'Micro-SaaS Tools',
    description: 'A suite of 15+ lightweight automated tools optimizing recruitment workflows.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    link: 'https://www.figma.com'
  },
  {
    id: '05',
    title: 'Design Systems',
    category: 'Internal Tooling',
    description: 'Building the atomic foundations for scalable enterprise applications.',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e0b7a8?q=80&w=2670&auto=format&fit=crop',
    link: 'https://www.figma.com'
  }
];

const CaseStudySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Responsive Cylinder Math
    const isMobile = window.innerWidth < 768;
    const radius = isMobile ? 350 : 650; // Reduced from 1000px to fit screen
    const angleIncrement = 360 / CASES.length;

    // 1. Initial Setup: Position cards in a circle
    cardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.set(card, {
          rotationY: i * angleIncrement,
          z: radius,
          transformOrigin: `50% 50% -${radius}px` // Matches negative radius
        });
      }
    });

    // 2. Rotate the entire carousel based on scroll
    gsap.to(carousel, {
      rotationY: -360, // One full rotation
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=2000",
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="h-screen bg-black overflow-hidden relative perspective-container flex items-center justify-center">
       {/* 3D Scene Container */}
       <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '2000px' }}>
          
          {/* Rotating Carousel Wrapper */}
          <div 
            ref={carouselRef}
            className="w-[260px] md:w-[400px] h-[380px] md:h-[550px] relative will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
             {CASES.map((item, index) => (
               <a 
                 key={item.id}
                 ref={(el) => { cardsRef.current[index] = el; }}
                 href={item.link}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="absolute top-0 left-0 w-full h-full bg-stone-50 p-2 md:p-4 group clickable block border border-stone-50/10 backface-hidden"
                 style={{ backfaceVisibility: 'hidden' }} // Prevents flickering
               >
                 {/* Image Container */}
                 <div className="w-full h-[55%] overflow-hidden bg-black/5 relative mb-4 md:mb-6">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-violet/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-multiply"></div>
                 </div>

                 {/* Content - Translated Z to avoid glitching with background */}
                 <div className="flex flex-col h-[40%] justify-between transform translate-z-[1px]" style={{ transform: 'translateZ(20px)' }}>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                         <span className="font-mono text-[10px] md:text-xs text-black/50 uppercase tracking-widest">{item.category}</span>
                         <span className="font-mono text-[10px] md:text-xs text-black/50">0{index + 1}</span>
                      </div>
                      <h3 className="font-serif italic text-2xl md:text-4xl text-black leading-none group-hover:text-violet transition-colors duration-300">
                        {item.title}
                      </h3>
                    </div>
                    
                    <div className="flex justify-between items-end">
                       <p className="font-sans text-xs md:text-sm text-black/60 max-w-[80%] line-clamp-2">
                         {item.description}
                       </p>
                       <div className="bg-black text-stone-50 p-2 rounded-full transform group-hover:rotate-45 transition-transform duration-300">
                          <ArrowUpRight size={16} />
                       </div>
                    </div>
                 </div>
               </a>
             ))}
          </div>

          <div className="absolute bottom-12 left-0 w-full text-center z-10 pointer-events-none mix-blend-difference text-white">
             <span className="font-mono text-xs uppercase tracking-[0.5em] animate-pulse">
                Scroll to Rotate
             </span>
          </div>

       </div>
    </section>
  );
};

export default CaseStudySection;
