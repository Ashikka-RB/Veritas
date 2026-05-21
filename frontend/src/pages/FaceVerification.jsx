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
  const [capturedImage,setCapturedImage] = useState(null);
  const [modelsLoaded,setModelsLoaded] =useState(false);
  const [instruction, setInstruction] =useState("Align your face inside the circle");
  const [matchScore,setMatchScore] = useState(null);

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

      console.log(
        "AI Models Loaded"
      );

      setModelsLoaded(true);

    };

  loadModels();

}, []);



const getWidth = () => {

  if (!matchScore) {

    return 0;

  }

  return matchScore;

};

const startVerification = async () => {

  if (running || done)
    return;

  // RESET STATES
  setProgress(0);
  setDone(false);
  setCapturedImage(null);
  setMatchScore(null);

  setRunning(true);

  // Blink
  setInstruction(
    "Blink your eyes"
  );

  await new Promise(
    resolve =>
      setTimeout(resolve, 2000)
  );

  setProgress(1);

  // Left
  setInstruction(
    "Turn head left"
  );

  await new Promise(
    resolve =>
      setTimeout(resolve, 2000)
  );

  setProgress(2);

  // Right
  setInstruction(
    "Turn head right"
  );

  await new Promise(
    resolve =>
      setTimeout(resolve, 2000)
  );

  setProgress(3);

  // Smile
  setInstruction(
    "Smile"
  );

  await new Promise(
    resolve =>
      setTimeout(resolve, 2000)
  );

  setProgress(4);

  // Capture selfie automatically
  const imageSrc =
    webcamRef.current
      .getScreenshot();

  setCapturedImage(
    imageSrc
  );

  // Temporary fake AI score
  const score =
    Math.floor(
      Math.random() * 10
    ) + 90;

  setMatchScore(score);

  setInstruction(
    "Verification Complete"
  );

  setDone(true);

  setRunning(false);

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
