import { useState, useEffect } from "react";
import "./Results.css";

const CATEGORY_KEYS = [
  "All",
  "Scholarships",
  "Certifications",
  "Internships",
  "Hackathons",
  "Training",
];

function Results({ onBack, onDetails, opportunities = {} }) {
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    setActiveFilter("All");
  }, [opportunities]);

  const categoryData = {
    All: opportunities?.overall || [],
    Scholarships: opportunities?.Scholarships || [],
    Certifications: opportunities?.Certifications || [],
    Internships: opportunities?.Internships || [],
    Hackathons: opportunities?.Hackathons || [],
    Training: opportunities?.Training || [],
  };

  const currentOpportunities = categoryData[activeFilter] || [];

  const totalOpportunities = currentOpportunities.length;

  const overallTotal = categoryData.All.length;

  const getEmptyMessage = () => {
    if (activeFilter === "All") {
      return "No opportunities found for your current profile.";
    }
    return `No ${activeFilter.toLowerCase()} found for your current profile.`;
  };

  const formattedOpportunities = currentOpportunities.map((opportunity) => ({
    ...opportunity,

    score: opportunity.match_score ?? opportunity.score ?? 0,

    status: opportunity.status || "Needs Verification",

    reasons:
      opportunity.why_match && opportunity.why_match.length > 0
        ? opportunity.why_match
        : opportunity.reasons && opportunity.reasons.length > 0
        ? opportunity.reasons
        : [],

    missingRequirements:
      opportunity.missing_requirements && opportunity.missing_requirements.length > 0
        ? opportunity.missing_requirements
        : [],

    documents:
      opportunity.required_documents && opportunity.required_documents.length > 0
        ? opportunity.required_documents
        : opportunity.documents && opportunity.documents.length > 0
        ? opportunity.documents
        : [],

    benefits:
      opportunity.benefits && opportunity.benefits.length > 0
        ? opportunity.benefits
        : [],

    description:
      opportunity.description ||
      "This opportunity was evaluated based on your profile criteria and eligibility guidelines.",

    provider:
      opportunity.provider ||
      "Official Provider",

    type:
      opportunity.type ||
      "Opportunity",

    deadline:
      opportunity.deadline ||
      null,

    sourceUrl:
      opportunity.source_url ||
      opportunity.official_url ||
      null,

    icon:
      opportunity.icon ||
      (opportunity.name?.toLowerCase().includes("scholarship")
        ? "🎓"
        : opportunity.name?.toLowerCase().includes("certification")
        ? "💻"
        : opportunity.name?.toLowerCase().includes("internship")
        ? "💼"
        : opportunity.name?.toLowerCase().includes("hackathon")
        ? "⚡"
        : "🚀"),
  }));

  const renderStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("likely eligible")) {
      return (
        <span className="eligibility-badge badge-eligible">
          <span className="badge-icon">✓</span> Likely Eligible
        </span>
      );
    }
    if (s.includes("needs verification") || s.includes("verification")) {
      return (
        <span className="eligibility-badge badge-verify">
          <span className="badge-icon">⚠️</span> Needs Verification
        </span>
      );
    }
    if (s.includes("not eligible")) {
      return (
        <span className="eligibility-badge badge-ineligible">
          <span className="badge-icon">✕</span> Not Eligible
        </span>
      );
    }
    return (
      <span className="eligibility-badge badge-neutral">
        <span className="badge-icon">ℹ</span> {status}
      </span>
    );
  };

  return (
    <div className="results-page">

      {/* Header / Navbar */}
      <header className="results-nav">
        <div className="results-logo" onClick={onBack}>
          <div className="logo-icon">🎯</div>
          <span className="logo-text">Opportunity <span>Mitra</span></span>
          <span className="logo-badge">AGENT RESULTS</span>
        </div>

        <button onClick={onBack} className="edit-profile-btn">
          ← Edit Profile
        </button>
      </header>

      <main className="results-container">

        {/* Results Hero */}
        <section className="results-hero">
          <div className="results-hero-content">
            <div className="ai-label">
              <span className="pulse-dot"></span>
              ✨ AI MATCHING & ELIGIBILITY COMPLETE
            </div>

            <h1>
              Opportunities
              <br />
              <span className="gradient-text">made for you.</span>
            </h1>

            <p className="results-hero-sub">
              Opportunity Mitra analyzed your profile and ranked opportunities based on your interests
              and available eligibility criteria.
            </p>
          </div>

          <div className="match-summary-card">
            <div className="summary-number">
              {totalOpportunities}
            </div>

            <div className="summary-text">
              <strong>Opportunities Found</strong>
              <span>AI-ranked for your profile</span>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="filter-bar">
          <div className="filter-title">
            <strong>Recommended for you</strong>
            <span>Ranked by agent eligibility score</span>
          </div>

          <div className="filters-list">
            {["All", "Scholarships", "Certifications", "Internships", "Hackathons", "Training"].map((category) => (
              <button
                key={category}
                className={`filter-chip ${activeFilter === category ? "active" : ""}`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Opportunity Cards List */}
        <section className="opportunity-list">
          {currentOpportunities.length === 0 ? (
            <div className="no-matches-card">
              <div className="no-matches-icon">🔍</div>
              <h3>{getEmptyMessage()}</h3>
              <p>Try selecting another category or update your profile to discover more opportunities.</p>
              <button
                className="reset-filter-btn"
                onClick={() => setActiveFilter("All")}
              >
                Show All Opportunities
              </button>
            </div>
          ) : (
            formattedOpportunities.map((opportunity, index) => {
              const isBestMatch = index === 0 && activeFilter === "All";

              return (
                <article
                  className={`opportunity-card ${isBestMatch ? "featured-card" : ""}`}
                  key={opportunity.name || index}
                >
                  {isBestMatch && (
                    <div className="best-match-ribbon">
                      ⭐ BEST MATCH
                    </div>
                  )}

                  <div className="card-top">
                    <div className="card-identity">
                      <div className="opportunity-icon">
                        {opportunity.icon}
                      </div>

                      <div className="opportunity-title-group">
                        <div className="opportunity-meta-row">
                          <span className="type-tag">{opportunity.type}</span>
                          {renderStatusBadge(opportunity.status)}
                        </div>

                        <h2>{opportunity.name}</h2>
                        <p className="provider-name">Offered by <strong>{opportunity.provider}</strong></p>
                      </div>
                    </div>

                    {/* Circular radial score */}
                    <div className="match-score-widget">
                      <div
                        className="score-ring"
                        style={{
                          "--score": `${opportunity.score * 3.6}deg`,
                        }}
                      >
                        <div className="score-ring-cutout">
                          <strong>{opportunity.score}%</strong>
                        </div>
                      </div>
                      <span className="score-widget-label">AI MATCH</span>
                    </div>
                  </div>

                  <p className="opportunity-description">
                    {opportunity.description}
                  </p>

                  {opportunity.benefits.length > 0 && (
                    <div className="opportunity-benefits">
                    <strong>Benefits:</strong>{" "}
{Array.isArray(opportunity.benefits)
  ? opportunity.benefits.join(", ")
  : opportunity.benefits || "Benefits information not available"}
                    </div>
                  )}

                  <div className="card-details-grid">
                    {/* Why you match */}
                    <div className="grid-column">
                      <h3>
                        <span className="col-icon">✨</span> Why you match
                      </h3>
                      <ul className="reason-checklist">
                        {opportunity.reasons.length > 0 ? (
                          opportunity.reasons.map((reason, rIdx) => (
                            <li key={`${reason}-${rIdx}`}>
                              <span className="check-bullet">✓</span>
                              <span>{reason}</span>
                            </li>
                          ))
                        ) : (
                          <li className="fallback-item">
                            <span className="check-bullet">✓</span>
                            <span>Matched successfully against demographic and academic eligibility rules.</span>
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Missing requirements / verification conditions */}
                    <div className="grid-column">
                      <h3>
                        <span className="col-icon">⚠️</span> Eligibility conditions to verify
                      </h3>
                      <ul className="missing-checklist">
                        {opportunity.missingRequirements.length > 0 ? (
                          opportunity.missingRequirements.map((req, mIdx) => (
                            <li key={`${req}-${mIdx}`}>
                              <span className="warn-bullet">•</span>
                              <span>{req}</span>
                            </li>
                          ))
                        ) : (
                          <li className="neutral-item">
                            <span className="info-bullet">✓</span>
                            <span>No missing eligibility conditions noted</span>
                          </li>
                        )}
                      </ul>

                      {opportunity.deadline && (
                        <div className="card-deadline-pill">
                          <span className="deadline-icon">📅</span>
                          <span>Deadline: <strong>{opportunity.deadline}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer">
                    <div className="card-footer-notice">
                      <span className="ai-agent-mark">🤖 Opportunity Mitra</span>
                      <span className="separator">•</span>
                      <span>Verify requirements with official provider</span>
                    </div>

                    <div className="card-footer-actions">
                      {opportunity.sourceUrl && (
                        <a
                          className="apply-link"
                          href={opportunity.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Apply ↗
                        </a>
                      )}
                      <button
                        onClick={() => onDetails(opportunity)}
                        className="details-button"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* Trust & Safety Verification Note */}
        <div className="results-trust-notice">
          <div className="trust-shield-icon">🛡️</div>
          <div className="trust-text-block">
            <strong>AI-generated recommendation</strong>
            <p>
              Match scores and eligibility assessments are computed from your submitted profile information.
              Final eligibility, deadlines, and application requirements should always be verified directly
              with the official opportunity provider.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Results;