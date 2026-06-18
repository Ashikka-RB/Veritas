import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState,useEffect} from 'react';

export default function Processing() {
  const navigate = useNavigate();
  const [currentStage,
  setCurrentStage] =
  useState(0);

const [fraudProbability,
  setFraudProbability] =
  useState(null);

const [riskScore,
  setRiskScore] =
  useState(null);

const [approvedProbability,
  setApprovedProbability] =
  useState(null);

const [manualReviewProbability,
  setManualReviewProbability] =
  useState(null);

const [rejectedProbability,
  setRejectedProbability] =
  useState(null);

const [finalStatus,
  setFinalStatus] =
  useState("PROCESSING");

 const [faceMatch,
  setFaceMatch] =
  useState(0);

  const [queueSubmitted,
  setQueueSubmitted] =
  useState(false);

  const [profileData, setProfileData] = useState(null);


  const delay = (ms) =>
  new Promise(resolve =>
    setTimeout(resolve, ms)
  );

const runFraudAnalysis =
async (score, profile) => {

  try {
    const isPanMatched = profile && profile.panName && profile.aadhaarName &&
      profile.panName.trim().toUpperCase() === profile.aadhaarName.trim().toUpperCase();
    const isLivenessPassed = (localStorage.getItem("livenessPassed") === "true") || (profile && profile.livenessPassed === true);
    const ocrConf = profile?.ocrConfidence || 0;

    const token = localStorage.getItem("token");
    const response =
      await fetch(
        "http://localhost:8000/api/verification/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },

          body: JSON.stringify({
            faceMatch: score,
            panMatched: !!isPanMatched,
            livenessPassed: !!isLivenessPassed,
            ocrConfidence: ocrConf
          })
        }
      );

    const data =
      await response.json();

      console.log("ML RESPONSE:", data);

      setApprovedProbability(
  data.approvedProbability
);

setManualReviewProbability(
  data.manualReviewProbability
);

setRejectedProbability(
  data.rejectedProbability
);

setRiskScore(
  data.rejectedProbability
);

setFinalStatus(
  data.status
);

return data;
  } 
  
  catch (error) {

    console.log(error);
    return null;
  }

};

const submitToAdminQueue =
async (
  status,
  approved,
  review,
  rejected,
  score
) => {

  try {
    let actualUserId = localStorage.getItem("userId");
    let fullName = null;
    let email = null;
    let phone = null;
    let ocrConf = 0;
    const token = localStorage.getItem("token");

    if (token) {
      const res = await fetch("http://localhost:8000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const profile = await res.json();
        console.log("PROFILE OBJECT RETRIEVED IN PROCESSING.JSX:", profile);
        actualUserId = profile._id;
        fullName = profile.fullName;
        email = profile.email;
        phone = profile.phone;
        ocrConf = profile.ocrConfidence || 0;
        localStorage.setItem("userId", profile._id);
      }
    }

    const payload = {
      userId: actualUserId || "guest",
      fullName: fullName || "Guest User",
      email: email || "guest@example.com",
      phone: phone || "N/A",
      faceMatchScore: score,
      ocrConfidence: ocrConf,
      finalStatus: status,
      approvedProbability: approved,
      manualReviewProbability: review,
      rejectedProbability: rejected
    };
    console.log("REQUEST BODY SENT TO /api/admin/submit:", payload);

    await fetch(
      "http://localhost:8000/api/admin/submit",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify(payload)

      }
    );

    setQueueSubmitted(true);

  } catch (error) {

    console.log(error);

  }

};


useEffect(() => {
  let isCancelled = false;

  const startPipeline =
    async () => {
      let fetchedProfile = null;
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await fetch("http://localhost:8000/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (res.ok && !isCancelled) {
            const profile = await res.json();
            localStorage.setItem("userId", profile._id);
            setProfileData(profile);
            fetchedProfile = profile;
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile on mount:", err);
      }

      const score =
        Number(
          localStorage.getItem(
            "faceMatchScore"
          )
        );

      if (isCancelled) return;
      setFaceMatch(score);

      await delay(1000);
      if (isCancelled) return;
      setCurrentStage(1);

      await delay(1000);
      if (isCancelled) return;
      setCurrentStage(2);

      await delay(1000);
      if (isCancelled) return;
      setCurrentStage(3);
      
      const mlResult =
      await runFraudAnalysis(score, fetchedProfile);

      if (!mlResult || isCancelled) {
        return;
      }

      await delay(1500);
      if (isCancelled) return;
      setCurrentStage(4);

      await delay(1500);
      if (isCancelled) return;
      setCurrentStage(5);

      await submitToAdminQueue(

        mlResult.status,

        mlResult.approvedProbability,

        mlResult.manualReviewProbability,

        mlResult.rejectedProbability,

        score

      );

    };


  startPipeline();

  return () => {
    isCancelled = true;
  };

}, []);

  const isNameMatched = profileData && profileData.panName && profileData.aadhaarName &&
    profileData.panName.trim().toUpperCase() === profileData.aadhaarName.trim().toUpperCase();

  const isDobMatched = profileData && profileData.panDOB && profileData.aadhaarDOB &&
    profileData.panDOB.trim() === profileData.aadhaarDOB.trim();

  const isGenderMatched = !!profileData?.aadhaarGender;

  const appProb = approvedProbability || 0;
  const revProb = manualReviewProbability || 0;
  const rejProb = rejectedProbability || 0;

  let maxProb = appProb;
  let riskCategory = "Low Risk";
  if (revProb > maxProb) {
    maxProb = revProb;
    riskCategory = "Medium Risk";
  }
  if (rejProb > maxProb) {
    maxProb = rejProb;
    riskCategory = "High Risk";
  }

  return (
    <div className="page active" id="p-processing">
      <Navbar type="processing" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px', textAlign: 'center' }}>
        <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="eyebrow">AI Analysis</div>
          <h1>Analysing your identity</h1>
          <p>Our ML models are running fraud detection and verification checks.</p>
        </div>

        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gold-dim)', border: '1.5px solid rgba(200,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', animation: 'spin 3s linear infinite' }}>
          <i className="ti ti-brain" style={{ fontSize: '28px', color: 'var(--gold)' }}></i>
        </div>

        <div className="processing-grid" style={{ textAlign: 'left', marginBottom: '32px' }}>
          <div className="ai-step">
            <div className="ai-step-icon" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}><i className="ti ti-check"></i></div>
            <div><div style={{ fontSize: '13px', fontWeight: 500 }}>OCR Data Verified</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>{profileData?.ocrConfidence ? `${profileData.ocrConfidence}% confidence` : 'Loading confidence...'} · Complete</div></div>
          </div>
          <div className="ai-step">
            <div 
              className="ai-step-icon" 
              style={{ 
                background: (isNameMatched && isDobMatched && isGenderMatched) ? 'var(--green-dim)' : 'var(--red-dim)', 
                color: (isNameMatched && isDobMatched && isGenderMatched) ? 'var(--green)' : 'var(--red)' 
              }}
            >
              <i className={(isNameMatched && isDobMatched && isGenderMatched) ? "ti ti-check" : "ti ti-alert-circle"}></i>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>PAN-Aadhaar Match</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: isNameMatched ? 'var(--green)' : 'var(--red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {isNameMatched ? "✓ Name Match" : "✗ Name Mismatch Detected"}
                </span>
                <span style={{ color: isDobMatched ? 'var(--green)' : 'var(--red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {isDobMatched ? "✓ DOB Match" : "✗ DOB Mismatch Detected"}
                </span>
                <span style={{ color: isGenderMatched ? 'var(--green)' : 'var(--red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {isGenderMatched ? "✓ Gender Match" : "✗ Gender Mismatch Detected"}
                </span>
              </div>
            </div>
          </div>
          <div className="ai-step">
            <div className="ai-step-icon" style={{ background: 'var(--green-dim)', color: 'var(--green)' }}><i className="ti ti-check"></i></div>
            <div><div style={{ fontSize: '13px', fontWeight: 500 }}>Face Match Score</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}> {faceMatch}% confidence · Complete</div></div>
          </div>
          <div
  className="ai-step"
  style={{
    opacity: currentStage >= 4 ? 1 : 0.6
  }}
>
  <div
    className="ai-step-icon"
    style={{
      background:
        currentStage >= 4
          ? 'var(--green-dim)'
          : 'var(--gold-dim)',

      color:
        currentStage >= 4
          ? 'var(--green)'
          : 'var(--gold)'
    }}
  >
    {
      currentStage >= 4
        ? <i className="ti ti-check"></i>
        : <i className="ti ti-loader spin"></i>
    }
  </div>

  <div>
    <div style={{ fontSize: '13px', fontWeight: 500 }}>
      Fraud ML Analysis
    </div>

    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
      {
        currentStage >= 4
          ? `Approved: ${approvedProbability}% | Review: ${manualReviewProbability}% | Rejected: ${rejectedProbability}%`
          : 'Running scikit-learn model...'
      }
    </div>
  </div>
</div>

<div
  className="ai-step"
  style={{
    opacity:
      currentStage >= 5
        ? 1
        : 0.4
  }}
>
  <div
    className="ai-step-icon"
    style={{
      background:
        currentStage >= 5
          ? 'var(--green-dim)'
          : 'var(--bg4)',

      color:
        currentStage >= 5
          ? 'var(--green)'
          : 'var(--text4)'
    }}
  >
    {
      currentStage >= 5
        ? <i className="ti ti-check"></i>
        : <i className="ti ti-clock"></i>
    }
  </div>

  <div>
    <div style={{ fontSize: '13px', fontWeight: 500 }}>
      Risk Scoring
    </div>

    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
      {
        currentStage >= 5
          ? `Overall Risk: ${riskCategory}`
          : 'Pending...'
      }
    </div>
  </div>
</div>

<div
  className="ai-step"
  style={{
    opacity:
      queueSubmitted
        ? 1
        : 0.4
  }}
>
  <div
    className="ai-step-icon"
    style={{
  background:
    queueSubmitted
      ? 'var(--green-dim)'
      : 'var(--bg4)',

  color:
    queueSubmitted
      ? 'var(--green)'
      : 'var(--text4)'
}}
  >
    {
  queueSubmitted
    ? <i className="ti ti-check"></i>
    : <i className="ti ti-clock"></i>
}
  </div>

  <div>
    <div
      style={{
        fontSize: '13px',
        fontWeight: 500
      }}
    >
      Submit to Admin Queue
    </div>

    <div
      style={{
        fontSize: '11px',
        color: 'var(--text3)'
      }}
    >
      {
  queueSubmitted
    ? "Submitted Successfully"
    : "Pending..."
}
    </div>
  </div>
</div>

</div>

<div
  className="card"
  style={{
    marginBottom: '24px',
    textAlign: 'left'
  }}
>
  <div
    style={{
      fontSize: '13px',
      fontWeight: 500,
      marginBottom: '12px'
    }}
  >
    Overall Progress
  </div>

  <div
    className="progress-bar-bg"
    style={{ height: '6px' }}
  >
    <div
      className="progress-bar-fill"
      style={{
        width: `${currentStage * 20}%`
      }}
    ></div>
  </div>

  <div
    style={{
      fontSize: '12px',
      color: 'var(--text3)',
      marginTop: '8px'
    }}
  >
    {
      finalStatus === "PROCESSING"
        ? "Running fraud analysis..."
        : (
  <span
    style={{
      color:
        finalStatus === "APPROVED"
          ? "green"
          : finalStatus === "MANUAL_REVIEW"
          ? "orange"
          : "red",
      fontWeight: "bold"
    }}
  >
    Final Status: {finalStatus}
  </span>
)
    }
  </div>
</div>
<button
  className="btn btn-gold btn-lg"
  onClick={() => navigate('/verify/status')}
  style={{ marginTop: '8px' }}
>
  View Verification Status →
</button>

</div>
</div>
  );
}
