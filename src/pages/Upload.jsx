import { useState } from 'react';
import { uploadPDF } from '../services/api';

function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const response = await uploadPDF(file);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload">
      <h1>Upload Price Index PDF</h1>
      <p>Admin: Upload Department of Agriculture daily price index</p>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={!file || uploading}>
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </form>

      {error && (
        <div className="error">
          <p>Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="success">
          <h2>Upload Successful!</h2>
          <div className="summary">
            <p><strong>Date:</strong> {result.summary.date}</p>
            <p><strong>Total Commodities:</strong> {result.summary.totalCommodities}</p>
            <p><strong>Saved:</strong> {result.summary.saved}</p>
            <p><strong>Price Changes Detected:</strong> {result.summary.priceChanges.length}</p>
          </div>

          {result.summary.priceChanges.length > 0 && (
            <div className="changes">
              <h3>Price Changes:</h3>
              {result.summary.priceChanges.map((change, idx) => (
                <div key={idx} className="change-item">
                  <p><strong>{change.name}</strong></p>
                  <p>₱{change.oldPrice} → ₱{change.newPrice} ({change.changePercentage}%)</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Upload;