import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PanUpload() {
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState(false);
  const [panData, setPanData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {

  const fetchProfile =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(

            `${import.meta.env.VITE_API_URL}/api/auth/profile`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }

          );

        const data =
          await response.json();

        console.log(data);

        setUserData(data);

      } catch (error) {

        console.log(error);

      }

    };

  fetchProfile();

}, []);

const handlePanUpload =
  async (selectedFile) => {

    try {

      const token =
        localStorage.getItem("token");

      const formData =
        new FormData();

      formData.append(
        "pan",
        selectedFile
      );

      // upload PAN
      const uploadResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/upload/pan`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!uploadResponse.ok) {
        const uploadErrData = await uploadResponse.json();
        throw new Error(uploadErrData.error || uploadErrData.message || "Upload Failed");
      }

      // OCR request
      const ocrResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ocr/pan`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!ocrResponse.ok) {
        const ocrErrData = await ocrResponse.json();
        throw new Error(ocrErrData.error || ocrErrData.message || "OCR Extraction Failed");
      }

      const ocrData = await ocrResponse.json();

      console.log(ocrData);

      setPanData(
        ocrData.extractedData
      );

      setUploaded(true);

    } catch (error) {
      console.log(error);
      alert(error.message || "PAN Verification Failed");
    }

};

  return (
    <div className="page active" id="p-pan">
      <Navbar type="step" stepText="Step 2 of 4" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        <div className="page-header">
          <div className="eyebrow">Document Upload</div>
          <h1>Upload PAN Card</h1>
          <p>PAN name will be cross-verified against your Aadhaar name.</p>
        </div>
        <div className="card" style={{ marginBottom: '16px', background: 'var(--bg3)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Aadhaar Name (Reference)</div>
          <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--gold)', fontFamily: 'var(--mono)' }}>{userData?.aadhaarName}</div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>PAN name must match this exactly</div>
        </div>

        <label
  className="upload-zone"
  style={
    uploaded
      ? {
          borderColor:
            'rgba(200,169,110,0.4)',
          background:
            'var(--bg2)'
        }
      : {}
  }
>

  <i className="ti ti-credit-card"></i>

  <div
    style={{
      fontSize: '14px',
      color: 'var(--text2)',
      marginBottom: '4px'
    }}
  >
    {
      uploaded
        ? 'Uploaded successfully'
        : 'Upload PAN card image'
    }
  </div>

  <div
    style={{
      fontSize: '12px',
      color: 'var(--text3)'
    }}
  >
    {
      uploaded
        ? 'pan_card.jpg'
        : 'JPG, PNG · Max 3 MB'
    }
  </div>

  <input
    type="file"
    hidden
    accept=".jpg,.jpeg,.png"

    onChange={(e) => {

      const selectedFile =
        e.target.files[0];

      if (selectedFile) {

        handlePanUpload(
          selectedFile
        );

      }

    }}
  />

</label>

        {uploaded && (
          <div id="pan-result" style={{ marginTop: '16px' }}>
            <div className="card" style={{ background: 'var(--bg3)' }}>
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px', color: 'var(--gold)' }}><i className="ti ti-sparkles"></i> PAN Extracted</div>
              <div style={{ background: 'var(--bg2)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
                <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">PAN Number</span><span className="ocr-val">{panData?.panNumber}</span></div>
                <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">PAN Name</span><span className="ocr-val">{panData?.name}</span></div>
                <div className="ocr-field-row" style={{ padding: '12px 14px' }}><span className="ocr-key">Name Match</span>{
  panData?.name ===
  userData?.aadhaarName

  ? (

    <span className="badge badge-green">
      ✓ Names Match
    </span>

  ) : (

    <span className="badge badge-amber">
      ⚠ Name Mismatch
    </span>

  )
}</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button className="btn btn-outline" onClick={() => navigate('/verify/ocr')}>← Back</button>
          <button className="btn btn-gold" style={{ flex: 1, opacity: uploaded ? 1 : 0.5 }} disabled={!uploaded} onClick={() => navigate('/verify/face')}>Proceed to Face Verify →</button>
        </div>
      </div>
    </div>
  );
}
