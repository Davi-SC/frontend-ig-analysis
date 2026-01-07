import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslation } from "../translations";
import LanguageSelector from "../components/LanguageSelector";

export default function Home() {
  const { language } = useLanguage();
  const t = getTranslation(language);

  return (
    <div className="page-container">
      <LanguageSelector />
      
      <div className="card text-center" style={{ maxWidth: '600px' }}>
        <div className="construction-icon">🚧</div>
        
        <span className="status-badge">{t.home.underConstruction}</span>
        
        <h1 className="mb-md">{t.home.title}</h1>
        
        <p className="mb-lg" style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>
          {t.home.description}
        </p>
        
        <div className="loading-dots mb-xl">
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div style={{ 
          background: 'rgba(131, 58, 180, 0.1)', 
          border: '1px solid rgba(131, 58, 180, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-sm)' }}>
            📊 {t.home.featuresTitle}
          </h3>
          <ul style={{ textAlign: 'left', marginLeft: 'var(--spacing-md)' }}>
            {t.home.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        
        <div className="nav-links">
          <Link to="/privacy" className="nav-link">
            {t.home.privacyLink}
          </Link>
          <Link to="/data-deletion" className="nav-link">
            🗑️ Data Deletion
          </Link>
          <Link to="/terms" className="nav-link">
            {t.home.termsLink}
          </Link>
        </div>
        
        <p className="text-muted mt-lg" style={{ fontSize: 'var(--font-size-sm)' }}>
          {t.home.footer}
        </p>
      </div>
    </div>
  );
}
