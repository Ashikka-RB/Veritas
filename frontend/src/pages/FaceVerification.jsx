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
  const [aadhaarImage,setAadhaarImage] = useState(null);
  const [aadhaarLoaded,setAadhaarLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadFaceImage = async (base64Image, score) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setUploading(true);
    setInstruction("Saving face biometric image...");

    try {
      // Convert base64 to Blob
      const base64Parts = base64Image.split(',');
      const mime = base64Parts[0].match(/:(.*?);/)[1];
      const byteString = atob(base64Parts[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([arrayBuffer], { type: mime });
      const file = new File([blob], 'face.jpg', { type: mime });

      const formData = new FormData();
      formData.append('face', file);
      formData.append('faceMatchScore', score);

      const response = await fetch('http://localhost:8000/api/verification/face', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || errData.message || 'Failed to persist face verification image');
      }

      console.log('Face verification image uploaded successfully.');
      setInstruction("Verification complete!");
      setDone(true);
    } catch (err) {
      console.error(err);
      alert("Error saving webcam biometric: " + err.message);
      setInstruction("Failed to save webcam scan");
    } finally {
      setUploading(false);
      setRunning(false);
    }
  };

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

useEffect(() => {

  const fetchUser =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );
          console.log(
            "TOKEN:",
            token
          );

        if (!token) {

          console.log(
            "No token found"
          );

          return;

        }

        const res =
          await fetch(
            "http://localhost:8000/api/auth/profile",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

          console.log("STATUS:", res.status);

        const data =
          await res.json();

          console.log("DATA:", data);

        console.log(
          "PROFILE DATA:",
          data
        );

        if (
          data.aadhaarFile
        ) {

          const imageUrl = data.aadhaarFile.startsWith('http://') || data.aadhaarFile.startsWith('https://')
            ? data.aadhaarFile
            : `http://localhost:8000/${data.aadhaarFile}`;

          console.log(
            "AADHAAR URL:",
            imageUrl
          );

          setAadhaarImage(
            imageUrl
          );
          setAadhaarLoaded(true);

        }

      } catch (err) {

        console.log(err);

      }

    };

  fetchUser();

}, []);

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
    .withFaceExpressions()
    .withFaceDescriptor();

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
      if (happyScore > 0.35) {
        setProgress(4);
        setInstruction("Smile detected");
        
        // capture selfie
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        stepRef.current = "done";
        
        let similarity = 0;
        try {
          // LOAD AADHAAR IMAGE
          const aadhaarImg = await faceapi.fetchImage(aadhaarImage);

          // DETECT FACE IN AADHAAR
          const aadhaarDetection = await faceapi
            .detectSingleFace(
              aadhaarImg,
              new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (!aadhaarDetection) {
            alert("No face found in Aadhaar image");
            setRunning(false);
            return;
          }

          // COMPARE
          const selfieDescriptor = detection.descriptor;
          const aadhaarDescriptor = aadhaarDetection.descriptor;
          const distance = faceapi.euclideanDistance(
            selfieDescriptor,
            aadhaarDescriptor
          );

          similarity = Math.max(0, Math.round((1 - distance) * 100));
          setMatchScore(similarity);
          localStorage.setItem("faceMatchScore", similarity);
        } catch (err) {
          console.log("Error matching face descriptor:", err);
        }
        
        await uploadFaceImage(imageSrc, similarity);
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
   if (!aadhaarLoaded) {

    alert(
      "Aadhaar image not loaded yet"
    );

    return;

  }
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

        {!done ? (
          <div style={{ display: 'flex', gap: '12px' }}>

<button
  className="btn btn-gold"
  style={{ flex: 1 }}
  onClick={startVerification}
  disabled={running || uploading}
>

  {

    running || uploading
      ? (uploading ? 'Saving Scan...' : 'Verifying...')
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
