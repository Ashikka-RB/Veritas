import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import './HeroAnimation.css';

gsap.registerPlugin(ScrollTrigger);

export default function HeroAnimation() {
  const containerRef = useRef(null);
  const aadhaarRef = useRef(null);
  const panRef = useRef(null);
  const aadhaarEnhancedRef = useRef(null);
  const panEnhancedRef = useRef(null);
  const glassGsapRef = useRef(null);

  useLayoutEffect(() => {
    const updateMask = () => {
      if (aadhaarRef.current && glassGsapRef.current) {
        const x = gsap.getProperty(glassGsapRef.current, "x");
        const y = gsap.getProperty(glassGsapRef.current, "y");
        
        const cardW = aadhaarRef.current.offsetWidth || 480;
        const cardH = aadhaarRef.current.offsetHeight || 300;
        
        // Lens center relative to the card container
        const cx = (cardW / 2) + x - 15; // Adjusted offset for smaller glass
        const cy = (cardH / 2) + y - 15;
        
        const clipStr = `circle(85px at ${cx}px ${cy}px)`; // Reduced from 120px
        const originStr = `${cx}px ${cy}px`;
        
        if (aadhaarEnhancedRef.current) {
          aadhaarEnhancedRef.current.style.clipPath = clipStr;
          aadhaarEnhancedRef.current.style.transformOrigin = originStr;
        }
        if (panEnhancedRef.current) {
          panEnhancedRef.current.style.clipPath = clipStr;
          panEnhancedRef.current.style.transformOrigin = originStr;
        }
      }
    };

    const ctx = gsap.context(() => {
      // Setup initial states (visible immediately without scrolling)
      gsap.set(aadhaarRef.current, { y: 0, opacity: 1, rotationX: 0, rotationY: 0, rotationZ: 0 });
      gsap.set(panRef.current, { y: 60, opacity: 0, rotationX: 10, rotationY: -15, rotationZ: -2 });
      
      // Glass starts in position over the Aadhaar card
      gsap.set(glassGsapRef.current, { x: -200, y: 10, rotationZ: -5, rotationY: -10 });
      
      gsap.ticker.add(updateMask);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector('.hero-pin-container'),
          start: 'top top',
          end: '+=400%', // Scrubs over 4x viewport height
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // Phase 1: Scanning Aadhaar
      tl.to(glassGsapRef.current, { x: 300, y: 30, rotationZ: 10, rotationY: 15, duration: 4, ease: "power1.inOut" }, 0);
      
      // Phase 2: Transition (Aadhaar out, PAN in, Glass loops back elegantly)
      tl.to(aadhaarRef.current, { y: -60, opacity: 0, rotationX: 15, duration: 3, ease: "power2.inOut" }, 4)
        .to(panRef.current, { y: 0, opacity: 1, rotationX: 0, rotationY: 0, rotationZ: 0, duration: 3, ease: "power2.inOut" }, 4.5)
        .to(glassGsapRef.current, { x: -200, y: 40, rotationZ: -10, rotationY: -15, duration: 3.5, ease: "sine.inOut" }, 4);

      // Phase 3: Scanning PAN
      tl.to(glassGsapRef.current, { x: 280, y: -20, rotationZ: 5, rotationX: 10, duration: 4, ease: "power1.inOut" }, 7.5);

      // Phase 4: End animation - Both cards fade elegantly into the next section
      tl.to(glassGsapRef.current, { opacity: 0, y: -50, duration: 2, ease: "power2.inOut" }, 11.5)
        .to(panRef.current, { opacity: 0, y: -50, duration: 2, ease: "power2.inOut" }, 11.5);

    }, containerRef);
    return () => {
      gsap.ticker.remove(updateMask);
      ctx.revert();
    };
  }, []);

  return (
    <div className="hero-animation-scene" ref={containerRef}>
      
      {/* Aadhaar Card Wrapper */}
      <div ref={aadhaarRef} className="anim-card-wrapper">
        <img src="/assets/aadhaar.png" alt="Aadhaar Card" className="anim-card-base" />
        
        {/* The truly magnified inner layer */}
        <div ref={aadhaarEnhancedRef} className="anim-card-enhanced">
          <img src="/assets/aadhaar.png" alt="Aadhaar Card Zoomed" />
          <div className="scanline"></div>
        </div>
      </div>

      {/* PAN Card Wrapper */}
      <div ref={panRef} className="anim-card-wrapper">
        <img src="/assets/pan.png" alt="PAN Card" className="anim-card-base" />
        
        {/* The truly magnified inner layer */}
        <div ref={panEnhancedRef} className="anim-card-enhanced">
          <img src="/assets/pan.png" alt="PAN Card Zoomed" />
          <div className="scanline"></div>
        </div>
      </div>

      {/* Top Layer: Magnifying Glass */}
      <div ref={glassGsapRef} className="anim-glass-gsap-wrapper">
        <motion.div 
          className="anim-glass-container"
          animate={{ y: ["-1.5%", "1.5%"], rotateZ: [-1, 1] }}
          transition={{ repeat: Infinity, duration: 4, repeatType: "reverse", ease: "easeInOut" }}
        >
          <img src="/assets/glass.png" alt="Magnifying Glass" className="anim-glass" />
        </motion.div>
      </div>
    </div>
  );
}
