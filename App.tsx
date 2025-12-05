
import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { ArrowUpRight, Copy } from 'lucide-react';

import MouseTrail from './components/MouseTrail';
import ProjectAccordion from './components/ProjectAccordion';
import SkillsTicker from './components/SkillsTicker';
import CustomCursor from './components/CustomCursor';
import CaseStudySection from './components/CaseStudySection';

// Register plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Magnetic Button Component for internal use
const MagneticButton: React.FC<{ children: React.ReactNode; href: string }> = ({ children, href }) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  
  useGSAP(() => {
    const button = buttonRef.current;
    if (!button) return;

    const xTo = gsap.quickTo(button, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(button, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      xTo(x * 0.3); // Magnetic strength
      yTo(y * 0.3);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <a 
      ref={buttonRef}
      href={href}
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative flex items-center justify-center w-full md:w-80 h-24 md:h-32 bg-stone-50 text-black rounded-full overflow-hidden will-change-transform clickable"
    >
      <div className="absolute inset-0 bg-violet scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out"></div>
      <span className="relative z-10 font-serif italic text-3xl group-hover:text-white transition-colors duration-300 flex items-center gap-2 pointer-events-none">
        {children}
      </span>
    </a>
  );
};

// Component: Hand Drawn Circle Animation
const HandDrawnCircle: React.FC = () => {
  const pathRef = useRef<SVGPathElement>(null);
  
  useGSAP(() => {
    if (!pathRef.current) return;
    const length = pathRef.current.getTotalLength();
    
    gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
    
    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: pathRef.current,
        start: "top 60%", 
        end: "bottom 40%",
        toggleActions: "play none none reverse"
      }
    });
  }, []);

  return (
    <svg className="absolute -inset-4 w-[120%] h-[140%] pointer-events-none z-[-1] overflow-visible" viewBox="0 0 200 100" preserveAspectRatio="none">
      <path 
        ref={pathRef}
        d="M10,50 C30,10 170,10 190,50 C210,90 40,90 20,55" 
        fill="none" 
        stroke="#C4B5FD" 
        strokeWidth="4" 
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

// Component: Focus Text (Depth of Field Effect)
const FocusParagraph: React.FC<{ children: React.ReactNode; highlight?: boolean }> = ({ children, highlight }) => {
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    gsap.fromTo(textRef.current, 
      { opacity: 0.1, filter: "blur(8px)", y: 20 },
      { 
        opacity: 1, 
        filter: "blur(0px)", 
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 75%",
          end: "bottom 55%",
          scrub: 1,
          toggleActions: "play reverse play reverse"
        }
      }
    );
  }, []);

  return (
    <p ref={textRef} className={`font-serif text-3xl md:text-5xl lg:text-6xl leading-tight transition-colors duration-500 ${highlight ? 'text-black' : 'text-black/80'}`}>
      {children}
    </p>
  );
};

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Global Animations
  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    // 1. Hero Reveal
    tl.from(".hero-line-inner", {
      yPercent: 120,
      duration: 1.5,
      ease: "power4.out",
      stagger: 0.1,
      clearProps: "all" 
    })
    .from(".hero-meta", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1
    }, "-=1.0")
    .from(".scroll-indicator", {
      scaleY: 0,
      transformOrigin: "top",
      duration: 1,
      ease: "power2.out"
    }, "-=0.5");

    // 2. Parallax Text
    if (parallaxRef.current) {
      gsap.to(parallaxRef.current, {
        y: 100,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    // 3. Section Headers Reveal (Global)
    const sectionHeaders = gsap.utils.toArray(".section-reveal");
    sectionHeaders.forEach((header: any) => {
      gsap.from(header, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: header,
          start: "top 90%",
          end: "bottom 60%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // 4. Footer Reveal
    const footerLines = gsap.utils.toArray(".footer-line");
    gsap.from(footerLines, {
      yPercent: 100,
      duration: 1,
      stagger: 0.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".footer-container",
        start: "top 70%",
      }
    });

    // 5. Background Rotation
    gsap.to(".arch-spinner", {
      rotation: 360,
      duration: 60,
      repeat: -1,
      ease: "none"
    });

  }, { scope: containerRef });

  const copyEmail = () => {
    navigator.clipboard.writeText("tharshini161000@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={containerRef} className="bg-stone-50 min-h-screen relative selection:bg-black selection:text-stone-50 blueprint-grid overflow-x-hidden cursor-none">
      <CustomCursor />
      <MouseTrail />

      {/* SECTION A: HERO */}
      <section ref={heroRef} className="h-screen w-full relative flex flex-col justify-between p-6 md:p-12 overflow-hidden">
        <div className="flex justify-between items-start font-mono text-xs uppercase tracking-widest text-black/60 z-10 hero-meta w-full">
          <div className="flex flex-col gap-1">
            <span>Portfolio 2024—25</span>
            <span>Est. India</span>
          </div>
          <div className="text-right flex flex-col gap-1">
            <span>Product Designer</span>
            <span>& Architect</span>
          </div>
        </div>

        <div ref={parallaxRef} className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none w-full mix-blend-multiply will-change-transform">
          <div className="clip-text-container block overflow-hidden px-4 mb-4">
            <h1 className="hero-line-inner font-serif italic text-[10vw] leading-[0.85] text-center text-black whitespace-nowrap will-change-transform">
              PRIYATHARSHINI
            </h1>
          </div>
          <div className="overflow-hidden w-full flex justify-center">
            <div className="hero-line-inner text-center">
              <p className="font-mono text-sm md:text-base leading-relaxed text-black/80 max-w-lg mx-auto px-4">
                Crafting digital ecosystems with architectural precision.
                <br className="hidden md:block"/> Transforming complex data into intuitive, scalable products.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end z-10 hero-meta w-full relative">
           <div className="hidden md:block font-mono text-xs text-black/40">
             SCROLL FOR SPECS
           </div>
           <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center">
             <div className="scroll-indicator w-[1px] h-16 md:h-24 bg-black/30 origin-top"></div>
           </div>
           <div className="font-mono text-xs text-black/40">
             [ 10°55'N, 78°06'E ]
           </div>
        </div>
      </section>

      {/* SECTION B: THE HUMAN NARRATIVE */}
      <section className="min-h-[150vh] w-full py-32 px-6 md:px-12 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          
          {/* Sticky ID Card */}
          <div className="md:col-span-4 relative">
             <div className="sticky top-32">
                <div className="w-full md:w-64 border border-black p-6 bg-stone-50 rotate-[-2deg] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] transition-transform duration-500 hover:rotate-0">
                   <div className="aspect-[3/4] bg-black/5 mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-black/20 font-serif italic">
                         Img. 01
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-violet"></div>
                   </div>
                   <div className="font-mono text-xs space-y-2">
                      <div className="flex justify-between border-b border-black/10 pb-1">
                         <span className="text-black/50">NAME</span>
                         <span className="uppercase">Priyatharshini</span>
                      </div>
                      <div className="flex justify-between border-b border-black/10 pb-1">
                         <span className="text-black/50">ROLE</span>
                         <span className="uppercase">Architect / PD</span>
                      </div>
                      <div className="flex justify-between border-b border-black/10 pb-1">
                         <span className="text-black/50">EDU</span>
                         <span className="uppercase">B.Arch '23</span>
                      </div>
                   </div>
                </div>
                <div className="mt-12 hidden md:block opacity-50">
                    <svg viewBox="0 0 100 100" className="w-24 h-24 animate-spin-slow arch-spinner">
                        <path id="curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent"/>
                        <text className="text-[10px] font-mono uppercase tracking-widest fill-black">
                            <textPath xlinkHref="#curve">
                                Physical • Digital • Space • Form • 
                            </textPath>
                        </text>
                    </svg>
                </div>
             </div>
          </div>

          {/* Scrollytelling Content */}
          <div className="md:col-span-8 flex flex-col gap-32 pt-12 md:pt-32 pb-32">
             
             <div className="space-y-2">
                <FocusParagraph>
                  I don't just design interfaces.
                </FocusParagraph>
                <div className="relative inline-block">
                  <FocusParagraph highlight>
                    I architect <span className="text-violet">behavior</span>.
                  </FocusParagraph>
                  <HandDrawnCircle />
                </div>
             </div>

             <div className="space-y-6">
                <FocusParagraph>
                   Graduating with a B.Arch, I learned that every line on a blueprint bears weight.
                </FocusParagraph>
                <FocusParagraph>
                   If a wall is misplaced, the building falls. If a button is misplaced, the user fails.
                </FocusParagraph>
             </div>

             <div className="space-y-6">
                <FocusParagraph>
                   I pivoted from designing museums at <span className="italic">Oscar & Ponni</span> to building enterprise ecosystems.
                </FocusParagraph>
                <FocusParagraph>
                   The medium changed from concrete to pixels, but the obsession remains the same:
                </FocusParagraph>
                <FocusParagraph highlight>
                   Relentless, invisible precision.
                </FocusParagraph>
             </div>

          </div>
        </div>
      </section>

      {/* SECTION B.5: CASE STUDIES */}
      <CaseStudySection />

      {/* SECTION C: ARCHIVE */}
      <section className="py-32 px-6 md:px-12 relative z-20 bg-stone-50 border-t border-black/5">
        <ProjectAccordion />
      </section>

      {/* SECTION D: ARSENAL */}
      <section className="py-24 bg-stone-50 relative z-20 overflow-hidden">
        <div className="mb-12 px-6 md:px-12 flex items-center justify-between section-reveal">
            <h3 className="font-mono text-xs uppercase tracking-widest text-black/50">[ Tooling & Systems ]</h3>
            <div className="h-[1px] bg-black/10 w-full ml-6"></div>
        </div>
        <SkillsTicker />
      </section>

      {/* SECTION E: CONTACT */}
      <section className="min-h-screen flex flex-col justify-between px-6 md:px-12 py-12 bg-black text-stone-50 relative overflow-hidden footer-container">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-stone-50 via-stone-50 to-transparent h-12 z-10 pointer-events-none opacity-10"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[800px] h-[800px] bg-violet/20 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="flex justify-between items-start pt-12 md:pt-24 z-10">
          <div>
            <div className="overflow-hidden">
              <h2 className="font-serif italic text-7xl md:text-[10rem] leading-[0.8] mb-8 footer-line">
                Let's
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="font-serif italic text-7xl md:text-[10rem] leading-[0.8] mb-8 text-lavender pl-12 md:pl-32 footer-line">
                Build.
              </h2>
            </div>
          </div>
          <div className="hidden md:block text-right font-mono text-sm opacity-50 footer-line">
             <p>BASED IN INDIA</p>
             <p>AVAILABLE GLOBALLY</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end pb-12 z-10">
          <div className="space-y-12">
            <div className="group cursor-pointer footer-line clickable" onClick={copyEmail}>
               <label className="font-mono text-xs text-stone-50/40 uppercase tracking-widest mb-2 block">Drop a line</label>
               <div className="flex items-center gap-4">
                 <a href="mailto:tharshini161000@gmail.com" className="text-3xl md:text-5xl font-mono hover:text-lavender transition-colors duration-300">
                   tharshini161000@gmail.com
                 </a>
                 <button className="p-3 rounded-full border border-stone-50/20 hover:bg-stone-50 hover:text-black transition-all duration-300 clickable" title="Copy Email">
                   {copied ? <span className="font-bold text-sm">COPIED</span> : <Copy size={20} />}
                 </button>
               </div>
            </div>

            <div className="group footer-line">
               <label className="font-mono text-xs text-stone-50/40 uppercase tracking-widest mb-2 block">Call</label>
               <a href="tel:+919499929875" className="text-3xl md:text-5xl font-mono hover:text-lavender transition-colors duration-300 block">
                 +91 9499929875
               </a>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-12 footer-line">
            <MagneticButton href="https://www.behance.net/tharshini1610">
               Behance <ArrowUpRight />
            </MagneticButton>
            
            <div className="flex gap-8 font-mono text-xs md:text-sm text-stone-50/40">
              <span className="border border-stone-50/20 px-4 py-2 rounded-full">B.Arch (2018-2023)</span>
              <span className="border border-stone-50/20 px-4 py-2 rounded-full">Google UX Design</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
