import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { getTranslation } from "../translations";
import LanguageSelector from "../components/LanguageSelector";

export default function Terms() {
  const { language } = useLanguage();
  const t = getTranslation(language).terms;

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
          <div style={{ 
            background: 'rgba(253, 29, 29, 0.1)', 
            border: '1px solid rgba(253, 29, 29, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)'
          }}>
            <span dangerouslySetInnerHTML={renderHTML(t.section1.warning)} />
          </div>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section2.title}</h2>
          <p className="mb-md">{t.section2.description}</p>
          <ul>
            {t.section2.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section3.title}</h2>
          <p className="mb-md">{t.section3.description}</p>
          <ul>
            {t.section3.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section4.title}</h2>
          <p className="mb-md">{t.section4.description}</p>
          <ul>
            {t.section4.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="mt-md" dangerouslySetInnerHTML={renderHTML(t.section4.note)} />
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section5.title}</h2>
          <p className="mb-md">{t.section5.description}</p>
          <ul>
            {t.section5.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section6.title}</h2>
          <p className="mb-md">{t.section6.description}</p>
          <ul>
            {t.section6.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="mt-md">{t.section6.note}</p>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section7.title}</h2>
          <p className="mb-md" dangerouslySetInnerHTML={renderHTML(t.section7.yourData)} />
          <p className="mb-md" dangerouslySetInnerHTML={renderHTML(t.section7.ourService)} />
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section8.title}</h2>
          <p className="mb-md">{t.section8.description}</p>
          <ul>
            {t.section8.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div style={{ 
            background: 'rgba(253, 29, 29, 0.1)', 
            border: '1px solid rgba(253, 29, 29, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
            marginTop: 'var(--spacing-md)'
          }}>
            <span dangerouslySetInnerHTML={renderHTML(t.section8.warning)} />
          </div>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section9.title}</h2>
          <p className="mb-md">{t.section9.description}</p>
          <ul>
            {t.section9.items.map((item, index) => (
              <li key={index} dangerouslySetInnerHTML={renderHTML(item)} />
            ))}
          </ul>
          <p className="mt-md">{t.section9.note}</p>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section10.title}</h2>
          <p dangerouslySetInnerHTML={renderHTML(t.section10.description)} />
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section11.title}</h2>
          <p className="mb-md">{t.section11.description}</p>
          <ul>
            {t.section11.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section12.title}</h2>
          <p className="mb-md">{t.section12.description}</p>
          <ul>
            {t.section12.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="mt-md">{t.section12.note}</p>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section13.title}</h2>
          <p>{t.section13.description}</p>
        </section>

        <section className="mb-xl">
          <h2 className="mb-md">{t.section14.title}</h2>
          <p className="mb-md">{t.section14.description}</p>
          <div style={{ 
            background: 'rgba(131, 58, 180, 0.1)', 
            border: '1px solid rgba(131, 58, 180, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)'
          }}>
            <p dangerouslySetInnerHTML={renderHTML(t.section14.support)} />
            <p dangerouslySetInnerHTML={renderHTML(t.section14.legal)} />
          </div>
        </section>

        <div style={{ 
          background: 'rgba(252, 175, 69, 0.1)', 
          border: '1px solid rgba(252, 175, 69, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-lg)',
          marginTop: 'var(--spacing-xl)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          <p style={{ marginBottom: '0' }}>
            <span dangerouslySetInnerHTML={renderHTML(t.versionInfo.lastUpdate)} /><br/>
            <span dangerouslySetInnerHTML={renderHTML(t.versionInfo.version)} /><br/>
            <span dangerouslySetInnerHTML={renderHTML(t.versionInfo.effectiveDate)} />
          </p>
        </div>

        <div className="nav-links mt-xl">
          <Link to="/" className="nav-link">{t.homeLink}</Link>
          <Link to="/privacy" className="nav-link">{t.privacyLink}</Link>
        </div>
      </div>
    </div>
  );
}
