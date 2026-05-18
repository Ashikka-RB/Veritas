export default function StepTracker({ currentStep }) {
  return (
    <>
      <div className="step-track">
        <div className={`step-node ${currentStep > 1 ? 'done' : currentStep === 1 ? 'active' : 'pending'}`}>{currentStep > 1 ? '✓' : '1'}</div>
        <div className={`step-line ${currentStep > 1 ? 'done' : ''}`}></div>
        <div className={`step-node ${currentStep > 2 ? 'done' : currentStep === 2 ? 'active' : 'pending'}`}>{currentStep > 2 ? '✓' : '2'}</div>
        <div className={`step-line ${currentStep > 2 ? 'done' : ''}`}></div>
        <div className={`step-node ${currentStep > 3 ? 'done' : currentStep === 3 ? 'active' : 'pending'}`}>{currentStep > 3 ? '✓' : '3'}</div>
        <div className={`step-line ${currentStep > 3 ? 'done' : ''}`}></div>
        <div className={`step-node ${currentStep > 4 ? 'done' : currentStep === 4 ? 'active' : 'pending'}`}>{currentStep > 4 ? '✓' : '4'}</div>
        <div className={`step-line ${currentStep > 4 ? 'done' : ''}`}></div>
        <div className={`step-node ${currentStep > 5 ? 'done' : currentStep === 5 ? 'active' : 'pending'}`}>5</div>
        <div className={`step-line ${currentStep > 5 ? 'done' : ''}`}></div>
        <div className={`step-node ${currentStep > 6 ? 'done' : currentStep === 6 ? 'active' : 'pending'}`}>6</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text3)', marginTop: '-20px', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        <span style={{ color: currentStep >= 1 ? 'var(--gold)' : '' }}>Auth</span>
        <span style={{ color: currentStep >= 2 ? 'var(--gold)' : '' }}>Aadhaar</span>
        <span style={{ color: currentStep >= 3 ? 'var(--gold)' : '' }}>OCR</span>
        <span style={{ color: currentStep >= 4 ? 'var(--gold)' : '' }}>PAN</span>
        <span style={{ color: currentStep >= 5 ? 'var(--gold)' : '' }}>Face</span>
        <span style={{ color: currentStep >= 6 ? 'var(--gold)' : '' }}>Review</span>
      </div>
    </>
  );
}
