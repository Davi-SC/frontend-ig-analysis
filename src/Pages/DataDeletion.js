import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslation } from "../translations";
import LanguageSelector from "../components/LanguageSelector";

export default function DataDeletion() {
  const { language } = useLanguage();
  const t = getTranslation(language).dataDeletion;

  const renderHTML = (html) => {
    return { __html: html };
  };

  return (
    <div className="page-container">
      <LanguageSelector />
      
      <div className="content-wrapper">
        <Link to="/" className="nav-link mb-lg" style={{ display: 'inline-block' }}>
          {t.backToHome}
        </Link>
        
        <h1 className="mb-md">{t.title}</h1>
        <p className="text-muted mb-xl">{t.lastUpdated}</p>

        <div className="mb-xl">
          <p className="mb-lg" style={{ fontSize: 'var(--font-size-lg)' }}>
            {t.intro}
          </p>
        </div>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section1.title}</h2>
          <p className="mb-md">{t.section1.description}</p>
          <ul>
            {t.section1.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section2.title}</h2>
          <p className="mb-md">{t.section2.description}</p>
          <ol>
            {t.section2.steps.map((step, index) => (
              <li key={index} dangerouslySetInnerHTML={renderHTML(step)} />
            ))}
          </ol>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section3.title}</h2>
          <p className="mb-md">{t.section3.description}</p>
          <ul>
            {t.section3.items.map((item, index) => (
              <li key={index} dangerouslySetInnerHTML={renderHTML(item)} />
            ))}
          </ul>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section4.title}</h2>
          <div style={{ 
            background: 'rgba(252, 70, 70, 0.1)', 
            border: '1px solid rgba(252, 70, 70, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-md)'
          }}>
            <p dangerouslySetInnerHTML={renderHTML(t.section4.warning)} />
          </div>
          <ul>
            {t.section4.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section5.title}</h2>
          <p className="mb-md">{t.section5.description}</p>
          <ol>
            {t.section5.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section6.title}</h2>
          <p className="mb-md">{t.section6.description}</p>
          <ul>
            {t.section6.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div style={{ 
            background: 'rgba(252, 175, 69, 0.1)', 
            border: '1px solid rgba(252, 175, 69, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
            marginTop: 'var(--spacing-md)'
          }}>
            <span dangerouslySetInnerHTML={renderHTML(t.section6.note)} />
          </div>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section7.title}</h2>
          <div style={{ 
            background: 'rgba(131, 58, 180, 0.1)', 
            border: '1px solid rgba(131, 58, 180, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)'
          }}>
            <p dangerouslySetInnerHTML={renderHTML(t.section7.description)} />
            <p className="text-muted" style={{ marginTop: 'var(--spacing-sm)', marginBottom: 0 }}>
              {t.section7.response}
            </p>
          </div>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section8.title}</h2>
          <p dangerouslySetInnerHTML={renderHTML(t.section8.description)} />
        </section>

        <div className="nav-links mt-xl">
          <Link to="/" className="nav-link">{t.homeLink}</Link>
          <Link to="/privacy" className="nav-link">{t.privacyLink}</Link>
          <Link to="/terms" className="nav-link">{t.termsLink}</Link>
        </div>
      </div>
    </div>
  );
}
