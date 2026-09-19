import "./Details.css";

function Details({ opportunity, onBack }) {
  if (!opportunity) {
    return (
      <div className="details-page">
        <div className="details-empty">
          <div className="empty-icon">🎯</div>
          <h2>No opportunity selected</h2>
          <p>Please return to the results dashboard and select an opportunity to inspect.</p>
          <button onClick={onBack} className="empty-back-btn">← Back to Results</button>
        </div>
      </div>
    );
  }

  // Use the actual n8n match score
  const score =
    opportunity.match_score ??
    opportunity.score ??
    0;

  // Use the actual n8n reasons
  const reasons =
    opportunity.why_match && opportunity.why_match.length > 0
      ? opportunity.why_match
      : opportunity.reasons && opportunity.reasons.length > 0
      ? opportunity.reasons
      : [];

  // Missing eligibility requirements
  const missingRequirements =
    opportunity.missing_requirements && opportunity.missing_requirements.length > 0
      ? opportunity.missing_requirements
      : [];

  // Documents are separate from eligibility requirements
  const documents =
    opportunity.required_documents && opportunity.required_documents.length > 0
      ? opportunity.required_documents
      : opportunity.documents && opportunity.documents.length > 0
      ? opportunity.documents
      : [];

  const benefits =
    opportunity.benefits && opportunity.benefits.length > 0
      ? opportunity.benefits
      : [];

  const sourceUrl =
    opportunity.source_url ||
    opportunity.official_url ||
    null;

  const status =
    opportunity.status || "Needs Verification";

  const provider =
    opportunity.provider || "Official Provider";

  const type =
    opportunity.type || "Opportunity";

  const description =
    opportunity.description || "This opportunity was identified based on your profile and eligibility criteria.";

  const deadline =
    opportunity.deadline || "Check official provider portal";

  const icon =
    opportunity.icon ||
    (opportunity.name?.toLowerCase().includes("scholarship")
      ? "🎓"
      : opportunity.name?.toLowerCase().includes("certification")
      ? "💻"
      : opportunity.name?.toLowerCase().includes("internship")
      ? "💼"
      : opportunity.name?.toLowerCase().includes("hackathon")
      ? "⚡"
      : "🚀");

  const isEligible = status.toLowerCase().includes("likely eligible");
  const isNeedsVerification = status.toLowerCase().includes("needs verification") || status.toLowerCase().includes("verification");

  return (
    <div className="details-page">

      {/* NAVBAR */}
      <header className="details-nav">
        <div className="details-logo" onClick={onBack}>
          <div className="logo-icon">🎯</div>
          <span className="logo-text">Opportunity <span>Mitra</span></span>
          <span className="logo-badge">AGENT EVALUATION</span>
        </div>

        <button className="back-button" onClick={onBack}>
          ← Back to Results
        </button>
      </header>

      <main className="details-container">

        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <span className="bread-link" onClick={onBack}>Results</span>
          <span className="bread-sep">›</span>
          <span className="bread-current">{opportunity.name}</span>
        </div>

        {/* MAIN OPPORTUNITY HERO HEADER */}
        <section className="opportunity-hero">
          <div className="hero-left">
            <div className="opportunity-icon">
              {icon}
            </div>

            <div className="hero-titles">
              <div className="opportunity-type-tag">
                {type}
              </div>

              <h1>{opportunity.name}</h1>

              <p className="provider-sub">
                Offered by <strong>{provider}</strong>
              </p>
            </div>
          </div>

          <div className="match-box">
            <div className="match-label">
              AI MATCH
            </div>

            <div className="match-score">
              {score}%
            </div>

            <div className="match-text">
              Profile Alignment
            </div>
          </div>
        </section>

        {/* STATUS BANNER */}
        <section className={`status-banner ${isEligible ? "banner-eligible" : isNeedsVerification ? "banner-verify" : "banner-neutral"}`}>
          <div className="status-check-circle">
            {isEligible ? "✓" : isNeedsVerification ? "⚠️" : "ℹ"}
          </div>

          <div className="status-banner-text">
            <strong>{status}</strong>
            <p>
              {isEligible
                ? "Based on the information provided, you appear likely to meet the available eligibility criteria."
                : isNeedsVerification
                ? "Some eligibility conditions or category requirements must be confirmed with official documentation."
                : "Profile indicators do not fully align with the stated opportunity criteria."}
            </p>
          </div>
        </section>

        {/* 2-COLUMN DETAILS GRID */}
        <div className="details-grid">

          {/* MAIN COLUMN (LEFT) */}
          <div className="details-main">

            {/* 1. WHY OPPORTUNITY MITRA RECOMMENDS THIS */}
            <section className="details-card ai-recommend-card">
              <div className="card-heading">
                <div className="heading-icon">🤖</div>
                <div>
                  <h2>Why Opportunity Mitra recommends this</h2>
                  <p>Criteria matched directly from your profile data</p>
                </div>
              </div>

              <div className="reason-list">
                {reasons.length > 0 ? (
                  reasons.map((reason, index) => (
                    <div className="reason-item" key={index}>
                      <div className="reason-check">✓</div>
                      <span>{reason}</span>
                    </div>
                  ))
                ) : (
                  <div className="empty-reason-note">
                    <span>✓</span>
                    <span>General background and student level matched the criteria of this opportunity.</span>
                  </div>
                )}
              </div>
            </section>

            {/* 2. WHAT NEEDS VERIFICATION (MISSING REQUIREMENTS) */}
            {missingRequirements.length > 0 && (
              <section className="details-card warning-card">
                <div className="card-heading">
                  <div className="heading-icon warn-icon">⚠️</div>
                  <div>
                    <h2>What needs verification</h2>
                    <p>Eligibility conditions that may affect your qualification</p>
                  </div>
                </div>

                <div className="condition-list">
                  {missingRequirements.map((requirement, index) => (
                    <div className="condition-item" key={index}>
                      <span className="condition-bullet">•</span>
                      <span>{requirement}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. ABOUT THIS OPPORTUNITY */}
            <section className="details-card">
              <div className="card-heading">
                <div className="heading-icon">📖</div>
                <div>
                  <h2>About this opportunity</h2>
                  <p>Overview and background guidelines</p>
                </div>
              </div>

              <p className="description-text">
                {description}
              </p>
            </section>

            {/* 3.5 BENEFITS */}
            {benefits.length > 0 && (
              <section className="details-card">
                <div className="card-heading">
                  <div className="heading-icon">🎁</div>
                  <div>
                    <h2>Benefits</h2>
                    <p>What you gain from this opportunity</p>
                  </div>
                </div>

                <div className="benefit-list">
                  {benefits.map((benefit, index) => (
                    <div className="benefit-item" key={index}>
                      <span className="benefit-bullet">✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. REQUIRED DOCUMENTS */}
            <section className="details-card">
              <div className="card-heading">
                <div className="heading-icon">📋</div>
                <div>
                  <h2>Required documents</h2>
                  <p>Keep these prepared prior to application</p>
                </div>
              </div>

              <div className="document-list">
                {documents.length > 0 ? (
                  documents.map((document, index) => (
                    <div className="document-item" key={index}>
                      <span className="document-number">{index + 1}</span>
                      <span>{document}</span>
                    </div>
                  ))
                ) : (
                  <div className="document-empty-item">
                    <span className="document-number">✓</span>
                    <span>Standard identity, academic transcripts, and enrollment certificates are typically required. Consult the official portal for the definitive document checklist.</span>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* SIDEBAR COLUMN (RIGHT) */}
          <aside className="details-sidebar">

            {/* 5. QUICK INFORMATION */}
            <section className="sidebar-card">
              <h3>Quick information</h3>

              <div className="info-row">
                <span>Opportunity type</span>
                <strong>{type}</strong>
              </div>

              <div className="info-row">
                <span>Provider / Agency</span>
                <strong>{provider}</strong>
              </div>

              <div className="info-row">
                <span>AI match score</span>
                <strong className="green-accent">{score}%</strong>
              </div>

              <div className="info-row">
                <span>Eligibility status</span>
                <strong className={isEligible ? "green-accent" : "amber-accent"}>{status}</strong>
              </div>

              <div className="info-row">
                <span>Application deadline</span>
                <strong>{deadline}</strong>
              </div>
            </section>

            {/* 6. READY TO APPLY / OFFICIAL APPLICATION SOURCE */}
            <section className="sidebar-card action-card">
              <div className="action-icon">🚀</div>
              <h3>Ready to apply?</h3>
              <p>
                Visit the verified official portal to inspect full terms, fill the official application, and verify deadlines.
              </p>

              <button
                className="official-button"
                onClick={() => {
                  if (sourceUrl) {
                    window.open(
                      sourceUrl,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }
                }}
                disabled={!sourceUrl}
              >
                {sourceUrl ? "Visit Official Website ↗" : "Official link unavailable"}
              </button>
            </section>

            {/* AI AGENT TRUST NOTE */}
            <section className="sidebar-card ai-note-card">
              <div className="note-icon">✨</div>
              <div>
                <strong>AI-Generated Opportunity Match</strong>
                <p>
                  Evaluated using Opportunity Mitra's rule-based criteria agent against your student profile.
                </p>
              </div>
            </section>

          </aside>

        </div>

        {/* 7. VERIFICATION / SAFETY DISCLAIMER */}
        <section className="verification-warning-banner">
          <div className="warning-banner-icon">🛡️</div>
          <div>
            <strong>Important verification notice</strong>
            <p>
              Match scores represent an estimation based on provided student indicators. Final eligibility,
              selection quotas, dates, and documentation requirements remain under the sole authority of the
              official provider or scheme administrator. Always confirm your status directly on their portal.
            </p>
          </div>
        </section>

      </main>

    </div>
  );
}

export default Details;