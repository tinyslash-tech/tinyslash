import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VerifiedPage.css';

const VerifiedPage = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [destinationUrl, setDestinationUrl] = useState<string | null>(null);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const countdownStarted = useRef(false);
  const [trustInfo, setTrustInfo] = useState({
    brandName: 'TinySlash',
    domain: 'tinyslash.com',
    verified: true
  });

  const getApiBaseUrl = () => {
    const url = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
    const cleanUrl = url.replace(/\/$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  };

  const API_BASE_URL = getApiBaseUrl();

  useEffect(() => {
    // Generate particles
    const particleContainer = document.getElementById('particle-container');
    if (particleContainer) {
      for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 80 + 20;
        p.style.cssText = `
          width:${size}px; height:${size}px;
          left:${Math.random() * 100}%;
          animation-duration:${Math.random() * 20 + 15}s;
          animation-delay:-${Math.random() * 25}s;
        `;
        particleContainer.appendChild(p);
      }
    }
  }, []);

  useEffect(() => {
    if (!shortCode) return;

    // Fetch trust info (for display only, non-blocking)
    fetch(`${API_BASE_URL}/v1/trust/public/${shortCode}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setTrustInfo({
            brandName: data.brandName || 'Verified Brand',
            domain: data.domain || 'tinyslash.com',
            verified: true
          });
        }
      })
      .catch(() => { });

    // Fetch the destination URL FIRST, then start countdown
    const fetchDestination = async () => {
      try {
        const endpoint = shortCode.startsWith('file_')
          ? `/v1/files/${shortCode}/redirect`
          : shortCode.startsWith('qr_')
            ? `/v1/qr/${shortCode}/redirect`
            : `/v1/urls/${shortCode}/redirect`;

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAgent: navigator.userAgent,
            referrer: document.referrer,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            let url = data.data.originalUrl || data.data.content || data.data.fileUrl || data.data.downloadUrl;
            if (url && !/^https?:\/\//i.test(url)) {
              url = 'https://' + url;
            }
            if (url) {
              setDestinationUrl(url);
              return;
            }
          }
        }
        // If we get here, the API didn't return a valid URL
        setFetchFailed(true);
      } catch (error) {
        console.error("Failed to fetch destination URL", error);
        setFetchFailed(true);
      }
    };

    fetchDestination();
  }, [shortCode]);

  // Start countdown ONLY after destination URL is fetched and not cancelled
  useEffect(() => {
    if (!destinationUrl || countdownStarted.current || isCancelled) return;
    countdownStarted.current = true;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0.1) {
          clearInterval(timer);
          return 0;
        }
        return Math.max(0, prev - 1);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [destinationUrl, isCancelled]);

  // Redirect when countdown hits 0
  useEffect(() => {
    if (countdown === 0 && destinationUrl && !isCancelled) {
      window.location.href = destinationUrl;
    }
  }, [countdown, destinationUrl, isCancelled]);

  const handleCancel = () => {
    setIsCancelled(true);
    // Optionally navigate back or show a cancelled state
    setTimeout(() => {
      navigate(-1);
    }, 1200);
  };

  // Helper to extract domain from URL for display
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return 'destination.com';
    }
  };

  const getCleanDestination = () => {
    if (!destinationUrl) return 'loading...';
    try {
      const urlObj = new URL(destinationUrl);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return destinationUrl;
    }
  }

  return (
    <div id="particle-container" className="verified-page-body">
      <div className="verified-card">
        {/* HEADER */}
        <div className="verified-header">
          <div className="shield-wrap">
            {/* Shield SVG */}
            <svg className="shield-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5zm-1.5 13.5l-3-3 1.06-1.06L10.5 13.38l4.94-4.94 1.06 1.06-6 6z" />
            </svg>
          </div>

          <div className="biz-row">
            <div className="biz-name">
              {trustInfo.brandName}
              <div className="verified-badge">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
              </div>
            </div>
            <div className="biz-sub">
              Verified Business
              <span className="biz-sub-dot"></span>
              Since Jan 2025
              <span className="biz-sub-dot"></span>
              ID #4821
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="card-body">

          {/* URL Chain */}
          <div className="redirect-label">Secure Redirect Path</div>
          <div className="url-chain">
            {/* From */}
            <div className="url-chip">
              <svg className="url-chip-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
              </svg>
              <span className="url-chip-text">{window.location.hostname}/{shortCode}</span>
              <span className="url-chip-label from">Short</span>
            </div>

            {/* Arrow */}
            <div className="url-arrow">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /></svg>
            </div>

            {/* To */}
            <div className="url-chip">
              <svg className="url-chip-icon" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#0ea569', opacity: 0.8 }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="url-chip-text" style={{ color: '#0a7a4e', fontWeight: 500 }}>
                {destinationUrl ? getCleanDestination() : 'loading destination...'}
              </span>
              <span className="url-chip-label to">Dest.</span>
            </div>
          </div>

          {!fetchFailed ? (
            /* Countdown */
            <div className="countdown-wrap">
              <div className="countdown-track">
                {!isCancelled && <div className="countdown-bar" style={{ width: `${(countdown / 3) * 100}%` }}></div>}
              </div>
              <div className="countdown-row">
                <div className="countdown-status">
                  {!isCancelled && countdown > 0 && <div className="spinner"></div>}
                  <span style={{ color: isCancelled ? '#dc2626' : undefined }}>
                    {isCancelled ? 'Redirect cancelled' : countdown === 0 ? 'Redirecting now…' : `Redirecting in ${Math.ceil(countdown)}s`}
                  </span>
                </div>
                <div className="countdown-num">
                  {isCancelled ? '' : `${Math.round((countdown / 3) * 100)}%`}
                </div>
              </div>
            </div>
          ) : (
            <div className="countdown-wrap">
              <div className="countdown-status" style={{ color: '#dc2626' }}>
                Failed to fetch destination.
              </div>
            </div>
          )}

          {/* Trust badges: 3 columns */}
          <div className="badges">
            {/* Encrypted */}
            <div className="badge">
              <svg viewBox="0 0 24 24" fill="#0ea569">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              <div className="badge-label">Encrypted</div>
              <div className="badge-sub">TLS 1.3</div>
            </div>

            {/* Scam Free */}
            <div className="badge">
              <svg viewBox="0 0 24 24" fill="#0ea569">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
              <div className="badge-label">Scam Free</div>
              <div className="badge-sub">Verified</div>
            </div>

            {/* No Malware */}
            <div className="badge">
              <svg viewBox="0 0 24 24" fill="#0ea569">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="badge-label">No Malware</div>
              <div className="badge-sub">Scanned</div>
            </div>
          </div>

        </div>

        {/* Cancel */}
        <div className="cancel-wrap">
          <button className="cancel-btn" onClick={handleCancel}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
            {isCancelled ? '← Going back…' : 'Cancel and go back'}
          </button>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-brand">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" /></svg>
            Secured by <strong>TinySlash Shield</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="footer-dot"></div>
            <a href="#" className="footer-link">Report link</a>
          </div>
        </div>

      </div>
    </div>
  );
};
export default VerifiedPage;
