import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AadhaarUpload() {
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (selectedFile) => {

  try {

    setLoading(true);

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("aadhaar", selectedFile);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/upload/aadhaar`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    const data = await response.json();

    console.log(data);

    if (response.ok) {

  setUploaded(true);

  setFile(selectedFile);

  // OCR API call
  const ocrFormData = new FormData();

  ocrFormData.append(
    "aadhaar",
    selectedFile
  );

const ocrResponse =
  await fetch(
    `${import.meta.env.VITE_API_URL}/api/ocr/aadhaar`,
    {
      method: "POST",
      headers: {
        Authorization:
          `Bearer ${token}`
      },
      body: formData
    }
  );

  const ocrData =
    await ocrResponse.json();

  console.log(ocrData);

  // store OCR data
  localStorage.setItem(
    "ocrData",
    JSON.stringify(
      ocrData.extractedData
    )
  );

  // navigate after OCR
  setTimeout(() => {
    navigate('/verify/ocr');
  }, 2000);

    } else {
      alert(data.error || data.message || "Upload Failed");
    }

  } catch (error) {
    console.log(error);
    alert(error.message || "Upload Failed");
  } finally {

    setLoading(false);

  }

};

  return (
    <div className="page active" id="p-aadhaar">
      <Navbar type="step" stepText="Step 1 of 4" />
      <div className="container-md pt-nav" style={{ paddingTop: '96px', paddingBottom: '60px' }}>
        <div className="page-header">
          <div className="eyebrow">Document Upload</div>
          <h1>Upload Aadhaar Card</h1>
          <p>Front side only. Ensure the full card is visible and clear.</p>
        </div>

        {!uploaded ? (
          <label className="upload-zone" id="aadhaar-zone">

            <i className="ti ti-cloud-upload"></i>

            <div
              style={{
                fontSize: '14px',
                color: 'var(--text2)',
                marginBottom: '4px'
              }}
            >
              {loading ? "Uploading..." : "Drag & drop or click to upload"}
            </div>

            <div
              style={{
                fontSize: '12px',
                color: 'var(--text3)'
              }}
            >
              JPG, PNG, PDF · Max 5 MB
            </div>

            <input
              type="file"
              hidden
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => {

                const selectedFile = e.target.files[0];

                if (selectedFile) {
                  handleUpload(selectedFile);
                }

              }}
            />

          </label>
        ) : (
          <div className="upload-zone" style={{ borderColor: 'rgba(76,175,116,0.4)' }}>
            <i className="ti ti-circle-check" style={{ color: 'var(--green)', fontSize: '36px', display: 'block', marginBottom: '8px' }}></i>
            <div style={{ fontSize: '14px', color: 'var(--green)' }}>Uploaded successfully</div>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>aadhaar_front.jpg · 2.4 MB</div>
          </div>
        )}

        {uploaded && (
          <div id="upload-preview" style={{ marginTop: '16px' }}>
            <div className="card" style={{ background: 'var(--bg3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--gold-dim)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-file-text" style={{ color: 'var(--gold)' }}></i></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 500 }}>aadhaar_front.jpg</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>2.4 MB</div></div>
                <span className="badge badge-green"><i className="ti ti-check"></i> Uploaded</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>Quality Checks</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Image clarity</span><span className="badge badge-green">✓ Clear</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Brightness</span><span className="badge badge-green">✓ Good</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '12px', color: 'var(--text2)' }}>Crop detection</span><span className="badge badge-green">✓ Full card</span></div>
              </div>
            </div>
            <div className="card" style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)', animation: 'pulse 1.5s infinite' }}></div>
                <span style={{ fontSize: '12px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>OCR Processing...</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="shimmer-line" style={{ width: '70%' }}></div>
                <div className="shimmer-line" style={{ width: '50%' }}></div>
                <div className="shimmer-line" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button className="btn btn-outline" onClick={() => navigate('/verify/start')}>← Back</button>
          <button className="btn btn-gold" style={{ flex: 1, opacity: uploaded ? 1 : 0.5 }} disabled={!uploaded} onClick={() => navigate('/verify/ocr')}>Review OCR Details →</button>
        </div>
      </div>
    </div>
  );
}
