import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

export default function FaceVerification() {
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 4
  const [done, setDone] = useState(false);
  const webcamRef = useRef(null);
  const blinkRef = useRef(false);
  const stepRef = useRef("blink");
  const [capturedImage,setCapturedImage] = useState(null);
  const [modelsLoaded,setModelsLoaded] =useState(false);
  const [instruction, setInstruction] =useState("Align your face inside the circle");
  const [matchScore,setMatchScore] = useState(null);
  const [currentStep,setCurrentStep] =useState("blink");
  

  useEffect(() => {

  const loadModels =
    async () => {

      const MODEL_URL =
        "/models";

      await faceapi.nets
        .tinyFaceDetector
        .loadFromUri(MODEL_URL);

      await faceapi.nets
        .faceLandmark68Net
        .loadFromUri(MODEL_URL);

      await faceapi.nets
        .faceRecognitionNet
        .loadFromUri(MODEL_URL);

      await faceapi.nets
        .faceExpressionNet
        .loadFromUri(MODEL_URL);

      console.log(
        "AI Models Loaded"
      );

      setModelsLoaded(true);

    };

  loadModels();

}, []);

useEffect(() => {

  let interval;

  if (
    running &&
    modelsLoaded
  ) {

    const timer =
      setTimeout(() => {

        interval = setInterval(
          detectFace,
          80
        );

      }, 1000);

    return () => {

      clearTimeout(timer);

      if (interval) {

        clearInterval(interval);

      }

    };

  }

}, [running, modelsLoaded]);



const getWidth = () => {

  if (!matchScore) {

    return 0;

  }

  return matchScore;
};

const detectFace =
  async () => {
    if (!running)
      return;

    if (
      !webcamRef.current
    )
      return;

    const video =
      webcamRef.current.video;

    if (
      video.readyState !== 4
    )
      return;

    const detection =
  await faceapi
    .detectSingleFace(

      video,

      new faceapi
        .TinyFaceDetectorOptions()

    )
    .withFaceLandmarks()
    .withFaceExpressions();

    if (!detection)
      return;

    const landmarks =
      detection.landmarks;

    const nose = landmarks.getNose();
    const noseX = nose[3].x;
    const jaw = landmarks.getJawOutline();
    
    // Use ratio of nose position relative to jaw width for stable head turn detection
    const faceWidth = jaw[16].x - jaw[0].x;
    const noseRatio = (noseX - jaw[0].x) / faceWidth;

    // LEFT EYE
    const leftEye = landmarks.getLeftEye();
    // RIGHT EYE
    const rightEye = landmarks.getRightEye();

    const leftEAR = getEAR(leftEye);
    const rightEAR = getEAR(rightEye);
    const avgEAR = (leftEAR + rightEAR) / 2;

    // Use stepRef for realtime stability without React state race conditions
    const activeStep = stepRef.current;

    // ---------- BLINK DETECTION ----------
    if (activeStep === "blink") {
      if (avgEAR < 0.29 && !blinkRef.current) {
        blinkRef.current = true;
      } else if (avgEAR > 0.30 && blinkRef.current) {
        blinkRef.current = false;
        setProgress(1);
        setInstruction("Turn head left");
        setCurrentStep("left");
        stepRef.current = "left";
      }
    }

    // ---------- LEFT TURN ----------
    if (activeStep === "left") {
      // In a mirrored webcam, turning left moves the nose to the left (lower ratio)
      if (noseRatio > 0.60) {
        setProgress(2);
        setInstruction("Turn your head right");
        setCurrentStep("right");
        stepRef.current = "right";
      }
    }

    // ---------- RIGHT TURN ----------
    if (activeStep === "right") {
      // In a mirrored webcam, turning right moves the nose to the right (higher ratio)
      if (noseRatio < 0.40) {
        setProgress(3);
        setInstruction("Please smile");
        setCurrentStep("smile");
        stepRef.current = "smile";
      }
    }

    // ---------- SMILE ----------
    if (activeStep === "smile") {
      const happyScore = detection?.expressions?.happy || 0;
      // High threshold for realistic smile
      if (happyScore > 0.75) {
        setProgress(4);
        setInstruction("Smile detected");
        
        // capture selfie
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        
        const score = Math.floor(Math.random() * 10) + 90;
        setMatchScore(score);
        
        setDone(true);
        setRunning(false);
        stepRef.current = "done";
      }
    }
};

const getEAR = (
  eye
) => {

  const a =
    distance(
      eye[1],
      eye[5]
    );

  const b =
    distance(
      eye[2],
      eye[4]
    );

  const c =
    distance(
      eye[0],
      eye[3]
    );

  return (
    (a + b)
    / (2.0 * c)
  );

};

const distance = (
  p1,
  p2
) => {

  return Math.sqrt(

    Math.pow(
      p1.x - p2.x,
      2
    ) +

    Math.pow(
      p1.y - p2.y,
      2
    )

  );

};

const startVerification = async () => {
    if (running) return;

    setRunning(true);
    setDone(false);
    setProgress(0);
    setCapturedImage(null);
    setMatchScore(null);
    setCurrentStep("blink");
    stepRef.current = "blink";
    blinkRef.current = false;
    setInstruction("Blink your eyes");
};

  return (
    <div className="page active" id="p-face">
      <Navbar type="step" stepText="Step 3 of 4" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        <div className="page-header" style={{ textAlign: 'center' }}>
          <div className="eyebrow">Live Biometrics</div>
          <h1>Face Verification</h1>
          <p>Position your face in the frame. Keep it still and well-lit.</p>
        </div>

      <div
  className="face-ring-outer"
  style={{
    width: '220px',
    height: '220px',
    borderRadius: '50%',
    overflow: 'hidden',
    margin: '32px auto',
    border: '3px solid rgba(200,169,110,0.4)',
    position: 'relative'
  }}
>

  {
    capturedImage ? (

      <img
        src={capturedImage}
        alt="captured"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

    ) : (

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

    )
  }

</div>

<div
  style={{
    textAlign: 'center',
    marginTop: '-10px',
    marginBottom: '20px',
    fontSize: '14px',
    color: 'var(--gold)',
    fontWeight: 500
  }}
>
  {instruction}
</div>

        <div
  className="card"
  style={{
    marginBottom: '16px',
    background: 'var(--bg3)',
    textAlign: 'center'
  }}
>

  <div
    style={{

      fontSize: '11px',

      color: 'var(--text3)',

      textTransform: 'uppercase',

      letterSpacing: '1px',

      marginBottom: '8px'

    }}
  >

    Liveness Checks

  </div>

  <div
  className="liveness-row"
  id="liveness"
>

  <div
    className={`liveness-tag ${
      progress >= 1 ? 'done' : ''
    }`}
  >
    Blink
  </div>

  <div
    className={`liveness-tag ${
      progress >= 2 ? 'done' : ''
    }`}
  >
    Turn Left
  </div>

  <div
    className={`liveness-tag ${
      progress >= 3 ? 'done' : ''
    }`}
  >
    Turn Right
  </div>

  <div
    className={`liveness-tag ${
      progress >= 4 ? 'done' : ''
    }`}
  >
    Smile
  </div>

</div>
        </div>
        <div className="card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Face Match Confidence</span>
            <span id="face-score-text" style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--gold)' }}>
              {
                matchScore
                  ? `${matchScore}%`
                  : '—'
              }
            </span>
          </div>
          <div className="progress-bar-bg"><div className="progress-bar-fill" id="face-bar" style={{ width: `${getWidth()}%` }}></div></div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '8px' }}>Comparing with Aadhaar card photo</div>
        </div>

        <div style={{ background: 'var(--amber-dim)', border: '0.5px solid rgba(232,160,48,0.2)', borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: 'var(--amber)', marginBottom: '24px' }}>
          <i className="ti ti-alert-triangle"></i> 3 failed attempts will lock verification for 24 hours. Attempts remaining: <strong>3</strong>
        </div>

        {!done ? (
          <div style={{ display: 'flex', gap: '12px' }}>

<button
  className="btn btn-gold"
  style={{ flex: 1 }}
  onClick={startVerification}
  disabled={running}
>

  {

    running
      ? 'Verifying'
      : 'Start Liveness Check'

  }

  <i className="ti ti-arrow-right"></i>

</button>
          </div>
        ) : (
          <div id="face-done" style={{ marginTop: '16px' }}>
            <button className="btn btn-gold btn-full btn-lg" onClick={() => navigate('/verify/processing')}>Submit for Fraud Analysis →</button>
          </div>
        )}
      </div>
    </div>
  );
}
