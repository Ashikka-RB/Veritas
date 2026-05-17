import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroAnimation from '../components/HeroAnimation';
import { motion, useScroll, useTransform } from 'framer-motion';

// Standard reveal for sections
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

// Orchestrated Hero Reveal Variants
const lineReveal = {
  hidden: { y: "110%", opacity: 0 },
  visible: (custom) => ({
    y: "0%", 
    opacity: 1, 
    transition: { delay: custom * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  })
};

const fadeUpDelayed = (delay) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { delay, duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
  }
});

const scaleInDelayed = (delay) => ({
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: { 
    opacity: 1, scale: 1, y: 0, 
    transition: { delay, duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
  }
});

const glowUpDelayed = (delay) => ({
  hidden: { opacity: 0, y: 20, filter: "brightness(1) blur(4px)" },
  visible: { 
    opacity: 1, y: 0, filter: "brightness(1.2) blur(0px)", 
    transition: { delay, duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
  }
});

export default function Landing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 200]);

  return (
    <div className="page active" id="p-landing">
      <Navbar type="public" />

      <div className="hero-pin-container">
        <div className="hero-wrap pt-nav container">
          {/* Subtle parallax on the background glow */}
          <motion.div className="hero-glow" style={{ y: yParallax }}></motion.div>
          
          <div className="hero-content" style={{ position: 'relative', zIndex: 1, padding: '60px 0 40px' }}>
            
            <motion.div variants={fadeUpDelayed(0.1)} initial="hidden" animate="visible" className="hero-eyebrow">
              <i className="ti ti-shield-lock"></i> AI-Powered Identity Verification
            </motion.div>
            
            {/* 1. Line-by-line heading reveal */}
            <h1 className="hero-title" style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
              <span style={{ overflow: 'hidden' }}>
                <motion.span custom={1} variants={lineReveal} initial="hidden" animate="visible" style={{ display: 'block' }}>Banking-grade</motion.span>
              </span>
              <span style={{ overflow: 'hidden' }}>
                <motion.span custom={2} variants={lineReveal} initial="hidden" animate="visible" style={{ display: 'block' }}><em>eKYC</em> for the</motion.span>
              </span>
              <span style={{ overflow: 'hidden' }}>
                <motion.span custom={3} variants={lineReveal} initial="hidden" animate="visible" style={{ display: 'block' }}>modern era</motion.span>
              </span>
            </h1>

            {/* 2. Sub-paragraph slight delay */}
            <motion.p variants={fadeUpDelayed(0.7)} initial="hidden" animate="visible" className="hero-sub">
              Automated Aadhaar & PAN verification, live face matching, fraud detection — complete digital onboarding in under 5 minutes.
            </motion.p>
            
            {/* 3. Staggered scale-in buttons */}
            <div className="hero-actions">
              <motion.button variants={scaleInDelayed(1.0)} initial="hidden" animate="visible" className="btn btn-gold btn-lg" onClick={() => navigate('/register')}>Start Verification <i className="ti ti-arrow-right"></i></motion.button>
              <motion.button variants={scaleInDelayed(1.15)} initial="hidden" animate="visible" className="btn btn-outline btn-lg" onClick={() => navigate('/admin/login')}>Admin Portal</motion.button>
            </div>
            
            {/* 4. Staggered glowing stats */}
            <div style={{ display: 'flex', gap: '32px', marginTop: '48px' }}>
              <motion.div variants={glowUpDelayed(1.4)} initial="hidden" animate="visible">
                <div style={{ fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--gold)' }}>99.2%</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>OCR Accuracy</div>
              </motion.div>
              
              <motion.div variants={fadeUpDelayed(1.5)} initial="hidden" animate="visible" style={{ width: '0.5px', background: 'var(--border)' }}></motion.div>
              
              <motion.div variants={glowUpDelayed(1.55)} initial="hidden" animate="visible">
                <div style={{ fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--gold)' }}>&lt;5min</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Avg. Verification</div>
              </motion.div>
              
              <motion.div variants={fadeUpDelayed(1.65)} initial="hidden" animate="visible" style={{ width: '0.5px', background: 'var(--border)' }}></motion.div>
              
              <motion.div variants={glowUpDelayed(1.7)} initial="hidden" animate="visible">
                <div style={{ fontFamily: 'var(--display)', fontSize: '28px', color: 'var(--gold)' }}>0.1%</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>False Positive Rate</div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="hero-animation-wrapper"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          >
            <HeroAnimation />
          </motion.div>
        </div>
      </div>

      <div className="container">
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '48px' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="hero-eyebrow" style={{ justifyContent: 'center' }}>Platform Features</motion.div>
          <motion.h2 variants={fadeInUp} className="section-title">Everything you need for<br/>compliant onboarding</motion.h2>
        </motion.div>
        
        <motion.div 
          className="features-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="feat-card"><i className="ti ti-scan feat-icon"></i><div className="feat-title">Smart OCR Extraction</div><div className="feat-desc">Tesseract-powered OCR auto-fills KYC forms from Aadhaar and PAN cards with 99%+ accuracy.</div></motion.div>
          <motion.div variants={fadeInUp} className="feat-card"><i className="ti ti-face-id feat-icon"></i><div className="feat-title">Liveness Detection</div><div className="feat-desc">Real-time face verification with blink and head-movement liveness checks to prevent spoofing.</div></motion.div>
          <motion.div variants={fadeInUp} className="feat-card"><i className="ti ti-brain feat-icon"></i><div className="feat-title">ML Fraud Analysis</div><div className="feat-desc">Scikit-learn models generate fraud scores based on face match confidence, OCR certainty, and behavioral signals.</div></motion.div>
          <motion.div variants={fadeInUp} className="feat-card"><i className="ti ti-cloud-upload feat-icon"></i><div className="feat-title">Cloud Storage</div><div className="feat-desc">All documents and face captures stored securely on Cloudinary with encrypted access controls.</div></motion.div>
          <motion.div variants={fadeInUp} className="feat-card"><i className="ti ti-report-analytics feat-icon"></i><div className="feat-title">Admin Workflow</div><div className="feat-desc">Enterprise-grade admin dashboard for human-in-the-loop review, approval, and audit trail management.</div></motion.div>
          <motion.div variants={fadeInUp} className="feat-card"><i className="ti ti-bell feat-icon"></i><div className="feat-title">Real-Time Alerts</div><div className="feat-desc">SendGrid-powered email notifications for OTPs, verification status, fraud alerts, and lock warnings.</div></motion.div>
        </motion.div>
      </div>

      <div className="security-strip">
        <div className="container">
          <motion.div 
            style={{ textAlign: 'center', marginBottom: '40px' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="section-title">Built on enterprise security</h2>
          </motion.div>
          <motion.div 
            className="security-items"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="sec-item"><i className="ti ti-lock sec-icon"></i><div className="sec-title">JWT Auth</div><div className="sec-desc">Session-based token security with auto-expiry</div></motion.div>
            <motion.div variants={fadeInUp} className="sec-item"><i className="ti ti-key sec-icon"></i><div className="sec-title">Bcrypt Hashing</div><div className="sec-desc">Industry-standard password encryption</div></motion.div>
            <motion.div variants={fadeInUp} className="sec-item"><i className="ti ti-shield-check sec-icon"></i><div className="sec-title">Account Locking</div><div className="sec-desc">Auto-lock after 3 failed attempts for 30 min</div></motion.div>
            <motion.div variants={fadeInUp} className="sec-item"><i className="ti ti-clipboard-list sec-icon"></i><div className="sec-title">Audit Logs</div><div className="sec-desc">Complete IP, device, and activity logging</div></motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="cta-strip container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="hero-eyebrow" style={{ justifyContent: 'center' }}>Get Started Today</motion.div>
        <motion.h2 variants={fadeInUp} className="section-title" style={{ marginBottom: '20px' }}>Ready to onboard smarter?</motion.h2>
        <motion.p variants={fadeInUp} className="section-sub" style={{ maxWidth: '400px', margin: '0 auto 32px' }}>Join thousands of customers verified securely through Veritas eKYC.</motion.p>
        <motion.div variants={fadeInUp}>
          <button className="btn btn-gold btn-lg" onClick={() => navigate('/register')}>Create Your Account <i className="ti ti-arrow-right"></i></button>
        </motion.div>
      </motion.div>
    </div>
  );
}
