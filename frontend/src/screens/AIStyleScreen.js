import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import styles from './AIStyleScreen.module.css';

export default function AIStyleScreen({ refreshDashboard }) {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    // Optimistically update the suggestions state with a placeholder
    setSuggestions([{ image_url: "loading-placeholder", text: "Generating..." }]);

    try {
      const resp = await axios.post('http://localhost:5000/api/recommendation', {
        prompt: prompt.trim(),
        userId: user?._id,
      });

      const suggestion = resp.data;
      //setSuggestions([suggestion]); //comment out to prevent setting suggestion immediately

      
      if (suggestion.image_url.includes("loading-placeholder")) {
        console.log("Model still loading. Polling for real image...");

        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          try {
            const retry = await axios.post('http://localhost:5000/api/recommendation', {
              prompt: prompt.trim(),
              userId: user?._id,
            });

            if (!retry.data.image_url.includes("loading-placeholder")) {
              clearInterval(interval);
              setSuggestions([retry.data]);

              
              await axios.post('http://localhost:5000/api/save-recommendation', {
                userId: user._id,
                prompt: prompt.trim(),
                image_url: retry.data.image_url,
                text: retry.data.text
              });

              if (refreshDashboard) refreshDashboard();
            }
          } catch (pollError) {
            console.error("Polling error:", pollError);
            clearInterval(interval);
             // If polling fails, remove the placeholder
            setSuggestions([]);
          }

          if (attempts > 5) { 
            clearInterval(interval);
             // If polling times out, remove the placeholder
            setSuggestions([]);
          }
        }, 10000); 
      } else {
          //setSuggestions([suggestion]); // Move inside the else block
        if (user) {
          await axios.post('http://localhost:5000/api/save-recommendation', {
            userId: user._id,
            prompt: prompt.trim(),
            image_url: suggestion.image_url,
            text: suggestion.text
          });
          if (refreshDashboard) refreshDashboard();
        }
         setSuggestions([suggestion]);//set suggestion when image is available
      }

    } catch (error) {
      console.error("Error generating style suggestion:", error);
      alert("Failed. Please try again. " + (error.response?.data?.error || ""));
       // If the request fails, remove the placeholder
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const Tag = ({ label }) => (
    <div className={styles.tag}>{label}</div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎨 AI Style Recommender</h1>

      <div className={styles.inputSection}>
        <input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe your style..."
          className={styles.input}
          onKeyDown={e => e.key === 'Enter' && generate()}
        />
        <button
          onClick={generate}
          disabled={loading}
          className={loading ? `${styles.button} ${styles.loading}` : styles.button}
        >
          {loading ? "Generating..." : "Get Suggestions"}
        </button>
      </div>

      {user && (
        <div className={styles.profileCard}>
          <h3 className={styles.profileTitle}>Your Style Profile</h3>
          <div className={styles.tagContainer}>
            {user.bodytype && <Tag label={`Body: ${user.bodytype}`} />}
            {user.skintone && <Tag label={`Skin: ${user.skintone}`} />}
            {user.height && <Tag label={`Height: ${user.height}cm`} />}
            {user.weight && <Tag label={`Weight: ${user.weight}kg`} />}
            {user.gender && <Tag label={`Gender: ${user.gender}`} />}
            {user.ethnicity && <Tag label={`Ethnicity: ${user.ethnicity}`} />}
          </div>
          <p className={styles.note}>These attributes will be included in style suggestions.</p>
          <p>Note: Sometimes the result can be unexpected.</p>
        </div>
      )}

      <div className={styles.suggestionsWrapper}>
        {suggestions.map((s, i) => (
          <div key={i} className={styles.card}>
            {s.image_url.includes("loading-placeholder") ? (
              <div className={styles.loadingCard}>
                <p>⏳ Generating your style...</p>
              </div>
            ) : (
              <>
                <img src={s.image_url} alt="Generated style" className={styles.image} />
                {user && <p className={styles.savedText}>✓ Saved to your profile</p>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}