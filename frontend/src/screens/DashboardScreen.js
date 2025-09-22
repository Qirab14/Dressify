import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import './DashboardScreen.css';

const DashboardScreen = ({ user, setRefreshFn }) => {
  const { getDashboardData } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    const result = await getDashboardData();
    if (result.success) {
      setData(result.data); // result.data should contain { user, recommendations }
    } else {
      console.error("Failed to load dashboard:", result.error);
      setData(null);
    }
    setLoading(false);
  }, [getDashboardData]);

  useEffect(() => {
    if (setRefreshFn) {
      setRefreshFn(fetchDashboard);
    }
  }, [setRefreshFn, fetchDashboard]);

  useEffect(() => {
    if (user) fetchDashboard();
  }, [user, fetchDashboard]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <h2>Loading your dashboard...</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error-state">
        <h2>Failed to load dashboard.</h2>
        <p>Please try logging in again.</p>
        <button className="retry-button" onClick={fetchDashboard}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="user-avatar">{data.user.username.charAt(0).toUpperCase()}</div>
          <div>
            <h2>👋 Hello, {data.user.username}</h2>
            <p>Welcome to your personal style hub.</p>
          </div>
        </header>

        <section className="user-info-card">
          <h3><i className="fas fa-user-circle"></i> Your Profile Details</h3>
          <p><strong>Email:</strong> {data.user.email}</p>
          <p><strong>Gender:</strong> {data.user.gender || "Not set"}</p>
          <p><strong>Body Type:</strong> {data.user.bodytype || "Not set"}</p>
          <p><strong>Skin Tone:</strong> {data.user.skintone || "Not set"}</p>
          <p><strong>Height:</strong> {data.user.height ? `${data.user.height} cm` : "Not set"}</p>
          <p><strong>Weight:</strong> {data.user.weight ? `${data.user.weight} kg` : "Not set"}</p>
          <p><strong>Ethnicity:</strong> {data.user.ethnicity || "Not set"}</p>
          <p><strong>Style:</strong> {data.user.style || "Not set"}</p>
        </section>

        <section>
          <h3 className="section-title"><i className="fas fa-star"></i> Your Recommendations</h3>
          {(!data.recommendations || data.recommendations.length === 0) ? (
            <div className="no-recommendations">
              <p>No recommendations yet. Go to the AI Style page to generate some!</p>
              <button className="action-button" onClick={() => window.location.href = '/ai-style'}>
                Generate Recommendations
              </button>
            </div>
          ) : (
            <div className="recommendations-wrapper">
              {data.recommendations.map((rec, index) => (
                <div key={rec._id || index} className="recommendation-card">
                  <img src={rec.image_url} alt="Generated outfit" loading="lazy" />
                  <div className="card-content">
                    <p>{rec.text}</p>
                    <small>{new Date(rec.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardScreen;
