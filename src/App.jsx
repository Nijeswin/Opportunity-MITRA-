import { useState } from "react";
import "./App.css";
import Profile from "./Profile";
import Results from "./Results";
import Details from "./Details";
import Catalog from "./Catalog";
import { catalogCategories } from "./catalogData";

function App() {
  const [page, setPage] = useState("home");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState(null);
  const [detailsReturnPage, setDetailsReturnPage] = useState("results");

  // Store the categorized opportunities received from n8n
  const [categorizedResults, setCategorizedResults] = useState({
    overall: [],
    Scholarships: [],
    Certifications: [],
    Internships: [],
    Hackathons: [],
    Training: [],
  });

  const resetResults = () => {
    setCategorizedResults({
      overall: [],
      Scholarships: [],
      Certifications: [],
      Internships: [],
      Hackathons: [],
      Training: [],
    });
  };

  if (page === "profile") {
    return (
      <Profile
        onBack={() => {
          resetResults();
          setPage("home");
        }}
        onFind={(data) => {
          setCategorizedResults(data);
          setPage("results");
        }}
      />
    );
  }

  if (page === "results") {
    return (
      <Results
        opportunities={categorizedResults}
        onBack={() => {
          resetResults();
          setPage("profile");
        }}
        onDetails={(opportunity) => {
          setSelectedOpportunity(opportunity);
          setDetailsReturnPage("results");
          setPage("details");
        }}
      />
    );
  }

  if (page === "details") {
    return (
      <Details
        opportunity={selectedOpportunity}
        onBack={() => setPage(detailsReturnPage)}
      />
    );
  }

  if (page === "catalog") {
    return (
      <Catalog
        selectedCategory={selectedCatalogCategory}
        onSelectCategory={setSelectedCatalogCategory}
        onBack={() => setPage("home")}
        onDetails={(opportunity) => {
          setSelectedOpportunity(opportunity);
          setDetailsReturnPage("catalog");
          setPage("details");
        }}
      />
    );
  }

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo" onClick={() => setPage("home")}>
          <div className="logo-icon">🎯</div>
          <span className="logo-text">Opportunity <span>Mitra</span></span>
          <span className="logo-badge">AI AGENT</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#pipeline">AI Pipeline</a>
          <a href="#categories">Opportunities</a>
          <a href="#how">How It Works</a>
        </div>

        <button
          className="nav-button"
          onClick={() => setPage("profile")}
        >
          Find Opportunities →
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">

          <div className="badge">
            <span className="pulse-dot"></span>
            ✨ AI-POWERED OPPORTUNITY & ELIGIBILITY AGENT
          </div>

          <h1>
            Find opportunities
            <br />
            <span className="gradient-text">made for you.</span>
          </h1>

          <p className="hero-subtitle">
            An AI-powered opportunity and eligibility assistant that understands
            your profile, finds relevant opportunities, checks eligibility, and
            explains your best matches.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-button"
              onClick={() => setPage("profile")}
            >
              Find My Opportunities →
            </button>

            <a href="#how" className="secondary-button">
              How It Works
            </a>
          </div>

          <div className="trust-pills">
            <div className="trust-pill">
              <span className="trust-icon">✓</span> Personalized to Profile
            </div>
            <div className="trust-pill">
              <span className="trust-icon">✓</span> Multi-Factor Eligibility Check
            </div>
            <div className="trust-pill">
              <span className="trust-icon">✓</span> Transparent Match Reasons
            </div>
          </div>

        </div>

        {/* Hero Preview Card */}
        <div className="hero-card">
          <div className="card-top-bar">
            <span className="agent-status-tag">
              <span className="live-indicator"></span> Agent Recommendation
            </span>
            <span className="best-match-pill">⭐ BEST MATCH</span>
          </div>

          <div className="card-header">
            <div className="hero-card-title-group">
              <small>TOP MATCH DISCOVERED</small>
              <h3>Central Sector Scheme Scholarship</h3>
              <p className="hero-card-provider">Department of Higher Education</p>
            </div>

            <div className="hero-match-circle">
              <div className="circle-inner">
                <strong>94%</strong>
                <small>MATCH</small>
              </div>
            </div>
          </div>

          <div className="hero-status-pill">
            <span className="pill-dot">✓</span> Likely Eligible
          </div>

          <div className="match-info">
            <span className="match-info-title">Why Opportunity Mitra matched you:</span>
            <div className="hero-reason-list">
              <p><span>✓</span> Education level matches undergraduate criteria</p>
              <p><span>✓</span> CGPA exceeds minimum threshold (8.2 ≥ 7.5)</p>
              <p><span>✓</span> Annual family income within qualifying limit</p>
            </div>
          </div>

          <div className="hero-card-footer">
            <span className="action-hint">AI-ranked match ready for verification</span>
            <button
              className="hero-card-btn"
              onClick={() => setPage("profile")}
            >
              Try With Your Profile →
            </button>
          </div>
        </div>
      </section>

      {/* AI Pipeline Concept Section */}
      <section className="pipeline-section" id="pipeline">
        <div className="section-header">
          <div className="section-tag">AI ARCHITECTURE</div>
          <h2>How Opportunity Mitra reasons about you</h2>
          <p>
            Rather than generic search, Opportunity Mitra acts as a personal agent
            evaluating criteria against your individual profile.
          </p>
        </div>

        <div className="pipeline-container">
          <div className="pipeline-step">
            <div className="pipeline-icon-box">👤</div>
            <div className="pipeline-label">1. Profile</div>
            <p>Academics, income, state, skills & goals</p>
          </div>

          <div className="pipeline-connector">
            <div className="pipeline-arrow">➔</div>
          </div>

          <div className="pipeline-step active-pipeline">
            <div className="pipeline-icon-box">🧠</div>
            <div className="pipeline-label">2. AI Analysis</div>
            <p>Synthesizes context & requirements</p>
          </div>

          <div className="pipeline-connector">
            <div className="pipeline-arrow">➔</div>
          </div>

          <div className="pipeline-step">
            <div className="pipeline-icon-box">⚖️</div>
            <div className="pipeline-label">3. Eligibility</div>
            <p>Rules & constraints evaluation</p>
          </div>

          <div className="pipeline-connector">
            <div className="pipeline-arrow">➔</div>
          </div>

          <div className="pipeline-step">
            <div className="pipeline-icon-box">🎯</div>
            <div className="pipeline-label">4. Best Match</div>
            <p>Ranked score & missing requirements</p>
          </div>

          <div className="pipeline-connector">
            <div className="pipeline-arrow">➔</div>
          </div>

          <div className="pipeline-step">
            <div className="pipeline-icon-box">🚀</div>
            <div className="pipeline-label">5. Action</div>
            <p>Official verified portal links</p>
          </div>
        </div>
      </section>

      {/* Opportunity Categories */}
      <section className="categories" id="categories">
        <div className="section-header">
          <div className="section-tag">CATALOG</div>
          <h2>Explore opportunity categories</h2>
          <p>
            One profile opens doors across diverse student support programs.
          </p>
        </div>

        <div
          className="category-grid"
          onClick={(event) => {
            const categoryName = event.target.closest(".category-card")?.querySelector("h3")?.textContent;
            if (catalogCategories.some((category) => category.name === categoryName)) {
              setSelectedCatalogCategory(categoryName);
              setPage("catalog");
            }
          }}
        >
          <div className="category-card">
            <div className="category-icon">🎓</div>
            <h3>Scholarships</h3>
            <p>Merit and need-based financial awards for your education.</p>
          </div>

          <div className="category-card">
            <div className="category-icon">💻</div>
            <h3>Certifications</h3>
            <p>Industry-recognized courses and technical credentials.</p>
          </div>

          <div className="category-card">
            <div className="category-icon">💼</div>
            <h3>Internships</h3>
            <p>Practical industry training and early career openings.</p>
          </div>

          <div className="category-card">
            <div className="category-icon">⚡</div>
            <h3>Hackathons</h3>
            <p>Innovation challenges, coding sprints, and prize contests.</p>
          </div>

          <div className="category-card">
            <div className="category-icon">🛠️</div>
            <h3>Training Programs</h3>
            <p>Skill development tracks and hands-on bootcamps.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how" id="how">
        <div className="section-header">
          <div className="section-tag">WORKFLOW</div>
          <h2>How Opportunity Mitra works</h2>
          <p>
            From your raw background to official applications in 5 intelligent steps.
          </p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Tell us about yourself</h3>
            <p>
              Share your education level, branch, CGPA, state, family income,
              and skills.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h3>AI understands your profile</h3>
            <p>
              The agent builds a semantic profile model highlighting your strengths
              and constraints.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Eligibility is checked</h3>
            <p>
              Opportunity criteria are parsed and validated against your demographic
              and academic indicators.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>
            <h3>Opportunities are ranked</h3>
            <p>
              Matches are scored with clear explanations of why they fit and what
              documents are needed.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">05</div>
            <h3>Take direct action</h3>
            <p>
              Review full breakdowns and head directly to official application
              portals.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Safety Banner */}
      <section className="trust-banner-section">
        <div className="trust-banner-content">
          <div className="trust-shield">🛡️</div>
          <div>
            <h3>Trust & Official Verification</h3>
            <p>
              Recommendations are based on available opportunity criteria.
              Always verify final eligibility, deadlines, and application requirements
              with the official provider.
            </p>
          </div>
          <button
            className="trust-banner-btn"
            onClick={() => setPage("profile")}
          >
            Find My Opportunities →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="about">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">🎯</div>
              <span className="logo-text">Opportunity <span>Mitra</span></span>
            </div>
            <p className="footer-tagline">
              Your AI companion for finding the right opportunities.
            </p>
          </div>

          <div className="footer-info">
            <p>Built for students exploring scholarships, internships, and growth pathways.</p>
            <small>© 2026 Opportunity Mitra. All rights reserved.</small>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
