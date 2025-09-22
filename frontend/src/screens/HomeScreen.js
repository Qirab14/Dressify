import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HomeScreen.css';

const trendingLinks = {
  "Business Casual": "https://www.gq.com/story/white-socks-and-loafers-trend",
  "Summer Dresses": "https://www.refinery29.com/en-gb/summer-dress-trends-2025",
  "Streetwear": "https://thefashioncentre.co.uk/the-rise-and-rule-of-streetwear-fashion-trend-2025.html",
  "Winter Coats": "https://people.com/fall-boots-fashion-stylist-recommended-august-2025-11794377"
};

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signup');
  };

  const handleTrendClick = (styleName) => {
    const url = trendingLinks[styleName];
    if (url) {
      window.open(url, "_blank");
    }
  };

  const capitalizeFirstLetter = (string) => {
        if (!string) return 'Not set';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
  return (
    <div className="home-background">
      <div className="home-container">
        <div className="header-section">
          <h1>👋 Welcome, {user?.username || user?.name || 'User'}!</h1>
          <p>Your AI-powered style assistant</p>
        </div>

        <div className="actions-section">
          <h2>🎯 Quick Actions</h2>
          <div className="buttons">
            <Link to="/virtual-tryon" className="btn primary">📸 Virtual Try-On</Link>
            <Link to="/ai-style" className="btn secondary">🤖 AI Style Suggestions</Link>
          </div>
        </div>

        <div className="profile-section">
          <h2>📊 Your Profile</h2>
          <div className="profile-cards">
            
            <div className="profile-card">
              <div className="profile-icon">👤</div>
              <div className="profile-details">
                <p className="profile-label">Body Type</p>
                <p className="profile-value">{capitalizeFirstLetter(user?.bodytype)}</p>
              </div>
            </div>

            <div className="profile-card">
              <div className="profile-icon">📏</div>
              <div className="profile-details">
                <p className="profile-label">Height</p>
                <p className="profile-value">{user?.height ? `${user.height} cm` : 'Not set'}</p>
              </div>
            </div>

            <div className="profile-card">
              <div className="profile-icon">⚖️</div>
              <div className="profile-details">
                <p className="profile-label">Weight</p>
                <p className="profile-value">{user?.weight ? `${user.weight} kg` : 'Not set'}</p>
              </div>
            </div>

            <div className="profile-card">
              <div className="profile-icon">🎨</div>
              <div className="profile-details">
                <p className="profile-label">Style</p>
                <p className="profile-value">{capitalizeFirstLetter(user?.style)}</p>
              </div>
            </div>

            <div className="profile-card">
              <div className="profile-icon">🌞</div>
              <div className="profile-details">
                <p className="profile-label">Skin Tone</p>
                <p className="profile-value">{capitalizeFirstLetter(user?.skintone)}</p>
              </div>
            </div>

            <div className="profile-card">
              <div className="profile-icon">🌍</div>
              <div className="profile-details">
                <p className="profile-label">Ethnicity</p>
                <p className="profile-value">{capitalizeFirstLetter(user?.ethnicity)}</p>
              </div>
            </div>

          </div>
        </div>

        <div className="trending-section">
          <h2>🔥 Trending Styles</h2>
          <div className="trend-grid">
            {["Business Casual", "Summer Dresses", "Streetwear", "Winter Coats"].map((style, i) => (
              <div
                key={i}
                className="trend-card"
                onClick={() => handleTrendClick(style)}
                style={{ cursor: 'pointer' }}
                title={`See trending ${style}`}
              >
                <div className="emoji">
                  {{
                    "Business Casual": "👔",
                    "Summer Dresses": "👗",
                    "Streetwear": "👟",
                    "Winter Coats": "🧥"
                  }[style]}
                </div>
                <div>{style}</div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
