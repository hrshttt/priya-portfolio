import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { Experience } from '../types';

gsap.registerPlugin(ScrollTrigger);

const RESUME_DATA: Experience[] = [
  {
    id: "apxor",
    role: "Product Designer",
    company: "Apxor",
    period: "Dec 2024 - Present",
    highlights: [
      { name: "Hearzap Platform", description: "End-to-end custom hearing aid order management & headless CMS." },
      { name: "Learn Online", description: "Integrated e-learning platform with course management tools." },
      { name: "USDC AMS", description: "Scalable academic operations & student application modules." },
      { name: "Vincere Partners", description: "Investor portfolio website development." },
      { name: "QA Automation", description: "Automated QA workflow platform to reduce manual testing." }
    ]
  },
  {
    id: "hiringhood",
    role: "UX UI Designer",
    company: "Hiringhood",
    period: "Jun 2024 - Nov 2024",
    highlights: [
      { name: "TalentXchange", description: "Corp-to-Corp Marketplace with AI/ML Smart Matching." },
      { name: "Nano Tools", description: "15+ tools including Vital Bot & AI Resume Parser." },
      { name: "Core Flows", description: "CV-to-requisition matching & vendor management." }
    ]
  },
  {
    id: "selorg",
    role: "UX UI Designer",
    company: "Selorg Tech",
    period: "May 2023 - May 2024",
    highlights: [
      { name: "Logistics", description: "B2B/B2C grocery delivery & warehouse systems." },
      { name: "Design Systems", description: "Comprehensive style guides for scalable products." },
      { name: "Branding", description: "Identity design & marketing collateral." }
    ]
  },
  {
    id: "oscar",
    role: "Architecture Intern",
    company: "Oscar & Ponni Architects",
    period: "2022 - 2023",
    highlights: [
      { name: "State Secretariat", description: "Schematic research & architectural design." },
      { name: "Museum Design", description: "User research on visitor behavior & play areas." }
    ]
  },
  {
    id: "freelance",
    role: "Visual Designer",
    company: "Freelance",
    period: "2020 - Present",
    highlights: [
      { name: "Packaging", description: "Pet subscription service & product booklets." },
      { name: "Editorial", description: "Book covers & layout design." }
    ]
  }
];

const AccordionItem: React.FC<{ 
  item: Experience; 
  isOpen: boolean; 
  index: number;
  onClick: () => void 
}> = ({ item, isOpen, index, onClick }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (isOpen) {
      gsap.to(contentRef.current, { height: "auto", duration: 0.7, ease: "expo.out" });
      gsap.fromTo(contentRef.current?.querySelectorAll(".highlight-row"), 
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.1, ease: "power2.out" }
      );
    } else {
      gsap.to(contentRef.current, { height: 0, duration: 0.5, ease: "power3.inOut" });
    }
  }, [isOpen]);

  return (
    <div className="accordion-item border-b border-black group opacity-0 translate-y-8">
      <button 
        onClick={onClick}
        className="w-full py-8 md:py-12 flex flex-col md:flex-row md:items-start justify-between text-left outline-none transition-all duration-500"
      >
        <div className="flex gap-6 md:gap-12 items-baseline">
          <span className="font-mono text-xs md:text-sm text-black/40 w-8 group-hover:text-violet transition-colors duration-300">
            0{index + 1}
          </span>
          <div className="flex flex-col">
            <h3 className={`text-3xl md:text-6xl font-serif italic transition-all duration-500 ${isOpen ? 'text-violet translate-x-4' : 'text-black group-hover:translate-x-4'}`}>
              {item.role}
            </h3>
            <span className={`font-mono text-xs md:text-sm uppercase tracking-widest mt-2 transition-all duration-500 ${isOpen ? 'text-black translate-x-4' : 'text-black/50 group-hover:translate-x-4'}`}>
              {item.company}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 mt-6 md:mt-2 pl-14 md:pl-0">
          <span className="font-mono text-xs text-black/40 hidden md:block">
            {item.period}
          </span>
          <div className={`transition-transform duration-500 text-black ${isOpen ? 'rotate-45' : 'group-hover:-translate-y-1 group-hover:translate-x-1'}`}>
             <ArrowUpRight size={24} />
          </div>
        </div>
      </button>

      <div ref={contentRef} className="h-0 overflow-hidden">
        <div className="pb-12 pl-0 md:pl-32 pr-0 md:pr-12">
          <div className="grid grid-cols-1 gap-4 border-l border-black/10 pl-6 md:pl-12">
            {item.highlights.map((highlight, idx) => (
              <div key={idx} className="highlight-row grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 items-baseline py-2">
                <div className="md:col-span-4 font-mono text-sm text-violet font-medium">
                   {highlight.name}
                </div>
                <div className="md:col-span-8 font-sans text-black/70 text-sm md:text-base leading-relaxed">
                   {highlight.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(".accordion-item", {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto">
      <div className="mb-20 flex flex-col md:flex-row justify-between items-end border-b border-black pb-6">
        <h2 className="font-serif text-5xl md:text-8xl text-black">
          Selected<span className="italic text-black/30 ml-4">Work</span>
        </h2>
        <span className="font-mono text-xs uppercase tracking-widest mb-2">[ Archive 2020-2025 ]</span>
      </div>
      
      <div className="border-t border-black">
        {RESUME_DATA.map((item, index) => (
          <AccordionItem 
            key={item.id} 
            index={index}
            item={item} 
            isOpen={openIndex === index} 
            onClick={() => setOpenIndex(openIndex === index ? null : index)} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectAccordion;