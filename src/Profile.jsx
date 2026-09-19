import { useState, useEffect } from "react";
import "./Profile.css";

function Profile({ onBack, onFind }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    education: "",
    year: "",
    course: "",
    cgpa: "",
    state: "",
    income: "",
    category: "",
    skills: "",
    goals: [],
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");

  // Cycle loading steps smoothly while waiting for the existing backend response
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, [loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoalChange = (goal) => {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((item) => item !== goal)
        : [...prev.goals, goal],
    }));
  };

  const [customSkill, setCustomSkill] = useState("");

  const popularSkills = [
    "Python",
    "C",
    "C++",
    "Java",
    "JavaScript",
    "HTML",
    "CSS",
    "React",
    "SQL",
    "Machine Learning",
    "Artificial Intelligence",
    "Data Science",
    "Git",
    "AWS",
    "Cloud Computing"
  ];

  // Derived array of selected skills synced with form.skills
  const selectedSkills = form.skills
    ? form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const handleAddSkill = (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    const exists = selectedSkills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );
    if (!exists) {
      const updated = [...selectedSkills, trimmed];
      setForm((prev) => ({ ...prev, skills: updated.join(", ") }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = selectedSkills.filter(
      (s) => s.toLowerCase() !== skillToRemove.toLowerCase()
    );
    setForm((prev) => ({ ...prev, skills: updated.join(", ") }));
  };

  const handleAddCustomSkill = (e) => {
    if (e) e.preventDefault();
    if (customSkill.trim()) {
      handleAddSkill(customSkill);
      setCustomSkill("");
    }
  };

  const handleFind = async () => {
    setError("");

    // Lightweight Frontend Input Validation
    if (form.age !== "" && form.age !== undefined) {
      const ageNum = Number(form.age);
      if (isNaN(ageNum) || ageNum < 1) {
        setError("Please enter a valid positive age.");
        return;
      }
    }

    if (form.cgpa !== "" && form.cgpa !== undefined) {
      const cgpaNum = Number(form.cgpa);
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        setError("Please enter a valid CGPA between 0 and 10.");
        return;
      }
    }

    if (form.income !== "" && form.income !== undefined) {
      const incomeNum = Number(form.income);
      if (isNaN(incomeNum) || incomeNum < 0) {
        setError("Annual family income cannot be negative.");
        return;
      }
    }

    setLoading(true);
    setLoadingStep(0);

    const message = `
I am ${form.name || "a student"}.
Age: ${form.age || "not provided"}.
Education level: ${form.education || "not provided"}.
Year of study: ${form.year || "not provided"}.
Course/Field: ${form.course || "not provided"}.
CGPA: ${form.cgpa || "not provided"}.
State: ${form.state || "not provided"}.
Annual family income: ${form.income || "not provided"}.
Social Category: ${form.category || "not provided"}.
Skills: ${form.skills || "not provided"}.
I am looking for: ${form.goals.length > 0 ? form.goals.join(", ") : "opportunities"}.
`;
    console.log("PROFILE FORM STATE:", {
      name: form.name,
      age: form.age,
      educationLevel: form.education,
      yearOfStudy: form.year,
      course: form.course,
      cgpa: form.cgpa,
      state: form.state,
      income: form.income,
      socialCategory: form.category,
      skills: form.skills,
      selectedCategories: form.goals,
    });
    console.log("PROFILE MESSAGE SENT TO N8N:", message);
    console.log("FRONTEND ORIGIN:", window.location.origin);
    try {
      const response = await fetch(
        "https://nijeswinlbm10.app.n8n.cloud/webhook/opportunity-mitra",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
          }),
        }
      );

      console.log("N8N RESPONSE STATUS:", response.status);
      console.log("N8N RESPONSE OK:", response.ok);

      if (!response.ok) {
        throw new Error(`n8n request failed: ${response.status}`);
      }

      const raw = await response.json();
      console.log("N8N RAW RESPONSE:", raw);

      if (!raw || (typeof raw === "object" && Array.isArray(raw) && raw.length === 0)) {
        throw new Error("n8n returned an empty response.");
      }

      const data = Array.isArray(raw) ? raw[0] : raw;
      console.log("N8N NORMALIZED RESPONSE:", data);

      if (Array.isArray(data.opportunities)) {
        console.log("SETTING OPPORTUNITIES (legacy format):", data);
        onFind({
          overall: data.opportunities,
          Scholarships: [],
          Certifications: [],
          Internships: [],
          Hackathons: [],
          Training: [],
        });
        return;
      }

      if (data && typeof data === "object") {
        console.log("SETTING OPPORTUNITIES (categorized format):", data);
        onFind({
          overall: Array.isArray(data.overall) ? data.overall : [],
          Scholarships: Array.isArray(data.Scholarships) ? data.Scholarships : [],
          Certifications: Array.isArray(data.Certifications) ? data.Certifications : [],
          Internships: Array.isArray(data.Internships) ? data.Internships : [],
          Hackathons: Array.isArray(data.Hackathons) ? data.Hackathons : [],
          Training: Array.isArray(data.Training) ? data.Training : [],
        });
        return;
      }

      throw new Error("No opportunities were returned.");
    } catch (err) {
      console.error("N8N FETCH ERROR:", err);
      console.error("ERROR NAME:", err.name);
      console.error("ERROR MESSAGE:", err.message);
      console.error("ERROR STACK:", err.stack);
      setError(
        "Unable to find opportunities right now. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">

      {/* Polish Stepped Loading Modal Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-modal">
            <div className="loading-pulse-ring">
              <div className="loading-ai-icon">🧠</div>
            </div>

            <h2>Opportunity Mitra is analyzing your profile...</h2>
            <p className="loading-desc">
              Matching your academic metrics and background against available opportunity databases.
            </p>

            <div className="loading-steps">
              <div className={`loading-step-item ${loadingStep >= 0 ? "done" : ""}`}>
                <span className="step-check">{loadingStep >= 0 ? "✓" : "○"}</span>
                <span>Understanding your profile & criteria</span>
              </div>

              <div className={`loading-step-item ${loadingStep >= 1 ? "done" : loadingStep === 0 ? "active" : ""}`}>
                <span className="step-check">{loadingStep >= 1 ? "✓" : "○"}</span>
                <span>Checking opportunity criteria & eligibility</span>
              </div>

              <div className={`loading-step-item ${loadingStep >= 2 ? "done" : loadingStep === 1 ? "active" : ""}`}>
                <span className="step-check">{loadingStep >= 2 ? "✓" : "○"}</span>
                <span>Finding relevant opportunities</span>
              </div>

              <div className={`loading-step-item ${loadingStep >= 3 ? "done" : loadingStep === 2 ? "active" : ""}`}>
                <span className="step-check">{loadingStep >= 3 ? "✓" : "○"}</span>
                <span>Ranking your best matches</span>
              </div>
            </div>

            <div className="loading-progress-bar">
              <div
                className="loading-progress-fill"
                style={{ width: `${Math.min(95, (loadingStep + 1) * 25)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="profile-container">

        <button className="back-button" onClick={onBack}>
          ← Back to Overview
        </button>

        <div className="profile-heading">
          <div className="profile-badge">
            <span className="pulse-dot"></span> SMART AGENT ONBOARDING
          </div>
          <h1>Tell us about yourself</h1>
          <p>
            Opportunity Mitra uses your background to match eligibility rules and calculate personalized scores.
          </p>
        </div>

        <div className="profile-card">

          {/* Section 1: Basic Information */}
          <div className="form-section">
            <div className="section-title-row">
              <div className="section-num-badge">1</div>
              <div>
                <h2>Basic Information</h2>
                <p className="section-subtitle">Personal details to personalize your matches</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <div className="label-with-hint">
                  <label>Age</label>
                  <span className="input-hint">Must be 1 or older</span>
                </div>
                <input
                  name="age"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 20 (Ages 16–60)"
                  value={form.age}
                  onChange={handleChange}
                />
                <div className="quick-age-row">
                  <span className="quick-age-label">Quick select:</span>
                  {[18, 19, 20, 21, 22, 23, 24].map((a) => (
                    <button
                      type="button"
                      key={a}
                      className={`quick-age-btn ${form.age === String(a) ? "selected" : ""}`}
                      onClick={() => setForm((prev) => ({ ...prev, age: String(a) }))}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Academic Background */}
          <div className="form-section">
            <div className="section-title-row">
              <div className="section-num-badge">2</div>
              <div>
                <h2>Education & Academic Performance</h2>
                <p className="section-subtitle">Used to check degree and merit eligibility criteria</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Education Level</label>
                <select
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                >
                  <option value="">Select education level</option>
                  <option>Undergraduate</option>
                  <option>Postgraduate</option>
                  <option>Diploma</option>
                  <option>12th / Higher Secondary</option>
                </select>
              </div>

              <div className="form-group">
                <label>Year of Study</label>
                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                >
                  <option value="">Select current year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div className="form-group">
                <label>Field / Course</label>
                <input
                  name="course"
                  type="text"
                  placeholder="e.g. Computer Science, AI/ML, Electrical"
                  value={form.course}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <div className="label-with-hint">
                  <label>CGPA / Percentage</label>
                  <span className="input-hint">0.0 to 10.0</span>
                </div>
                <input
                  name="cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="e.g. 8.4"
                  value={form.cgpa}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Location & Financial Background */}
          <div className="form-section">
            <div className="section-title-row">
              <div className="section-num-badge">3</div>
              <div>
                <h2>Location & Income</h2>
                <p className="section-subtitle">Evaluated for domicile rules and need-based scholarship limits</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>State / Region</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                >
                  <option value="">Select state of domicile</option>
                  <option>Tamil Nadu</option>
                  <option>Kerala</option>
                  <option>Karnataka</option>
                  <option>Andhra Pradesh</option>
                  <option>Telangana</option>
                  <option>Maharashtra</option>
                  <option>Delhi</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <div className="label-with-hint">
                  <label>Annual Family Income (₹)</label>
                  <span className="input-hint">Non-negative</span>
                </div>
                <input
                  name="income"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="e.g. 250000"
                  value={form.income}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Social Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  <option>General</option>
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                  <option>EWS</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
                <span className="input-hint">Used for scholarship eligibility</span>
              </div>
            </div>
          </div>

          {/* Section 4: Skills */}
          <div className="form-section">
            <div className="section-title-row">
              <div className="section-num-badge">4</div>
              <div>
                <h2>Technical & Professional Skills</h2>
                <p className="section-subtitle">Click popular chips below or add custom skills</p>
              </div>
            </div>

            <div className="skills-block">
              {/* Selected Skills Chips with Remove button */}
              <div className="selected-skills-box">
                <div className="selected-skills-header">
                  <span className="selected-skills-title">
                    Active Skills ({selectedSkills.length})
                  </span>
                  {selectedSkills.length > 0 && (
                    <button
                      type="button"
                      className="clear-skills-btn"
                      onClick={() => setForm((prev) => ({ ...prev, skills: "" }))}
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {selectedSkills.length === 0 ? (
                  <p className="no-skills-msg">
                    No skills selected yet. Click any skill chip below or type custom ones.
                  </p>
                ) : (
                  <div className="selected-chips-wrap">
                    {selectedSkills.map((skill) => (
                      <span key={skill} className="selected-skill-pill">
                        <span className="pill-name">{skill}</span>
                        <button
                          type="button"
                          className="pill-close"
                          onClick={() => handleRemoveSkill(skill)}
                          aria-label={`Remove ${skill}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Skill Input */}
              <div className="custom-skill-row">
                <input
                  type="text"
                  placeholder="Add custom skill (e.g. Docker, Figma)..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomSkill();
                    }
                  }}
                />
                <button
                  type="button"
                  className="add-skill-button"
                  onClick={handleAddCustomSkill}
                >
                  + Add Skill
                </button>
              </div>

              {/* Popular Selectable Chips */}
              <div className="popular-skills-section">
                <span className="popular-skills-heading">Popular Skills (Click to toggle):</span>
                <div className="popular-chips-grid">
                  {popularSkills.map((s) => {
                    const isSelected = selectedSkills.some(
                      (item) => item.toLowerCase() === s.toLowerCase()
                    );
                    return (
                      <button
                        type="button"
                        key={s}
                        className={`popular-chip ${isSelected ? "active" : ""}`}
                        onClick={() => {
                          if (isSelected) {
                            handleRemoveSkill(s);
                          } else {
                            handleAddSkill(s);
                          }
                        }}
                      >
                        <span className="chip-icon">{isSelected ? "✓" : "+"}</span>
                        <span>{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Goals */}
          <div className="form-section">
            <div className="section-title-row">
              <div className="section-num-badge">5</div>
              <div>
                <h2>What are you looking for?</h2>
                <p className="section-subtitle">Select opportunity categories you want Opportunity Mitra to prioritize</p>
              </div>
            </div>

            <div className="goal-grid">
              <label className={`goal-card ${form.goals.includes("Scholarships") ? "active" : ""}`}>
                <input
                  type="checkbox"
                  checked={form.goals.includes("Scholarships")}
                  onChange={() => handleGoalChange("Scholarships")}
                />
                <div className="goal-content">
                  <div className="goal-icon">🎓</div>
                  <div className="goal-text">
                    <strong>Scholarships</strong>
                    <span>Tuition waivers & educational grants</span>
                  </div>
                </div>
              </label>

              <label className={`goal-card ${form.goals.includes("Certifications") ? "active" : ""}`}>
                <input
                  type="checkbox"
                  checked={form.goals.includes("Certifications")}
                  onChange={() => handleGoalChange("Certifications")}
                />
                <div className="goal-content">
                  <div className="goal-icon">💻</div>
                  <div className="goal-text">
                    <strong>Certifications</strong>
                    <span>Credentials & upskilling programs</span>
                  </div>
                </div>
              </label>

              <label className={`goal-card ${form.goals.includes("Internships") ? "active" : ""}`}>
                <input
                  type="checkbox"
                  checked={form.goals.includes("Internships")}
                  onChange={() => handleGoalChange("Internships")}
                />
                <div className="goal-content">
                  <div className="goal-icon">💼</div>
                  <div className="goal-text">
                    <strong>Internships</strong>
                    <span>Practical experience & stipends</span>
                  </div>
                </div>
              </label>

              <label className={`goal-card ${form.goals.includes("Hackathons") ? "active" : ""}`}>
                <input
                  type="checkbox"
                  checked={form.goals.includes("Hackathons")}
                  onChange={() => handleGoalChange("Hackathons")}
                />
                <div className="goal-content">
                  <div className="goal-icon">⚡</div>
                  <div className="goal-text">
                    <strong>Hackathons</strong>
                    <span>Innovation challenges, coding sprints, and prize contests.</span>
                  </div>
                </div>
              </label>

              <label className={`goal-card ${form.goals.includes("Training Programs") ? "active" : ""}`}>
                <input
                  type="checkbox"
                  checked={form.goals.includes("Training Programs")}
                  onChange={() => handleGoalChange("Training Programs")}
                />
                <div className="goal-content">
                  <div className="goal-icon">🛠️</div>
                  <div className="goal-text">
                    <strong>Training Programs</strong>
                    <span>Skill development and hands-on training</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="profile-error-box">
              <span className="error-icon">⚠️</span>
              <div>
                <p>{error}</p>
                <button
                  type="button"
                  className="profile-retry-btn"
                  onClick={handleFind}
                  disabled={loading}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          <div className="form-submit-row">
            <button
              className="find-button"
              onClick={handleFind}
              disabled={loading}
            >
              {loading
                ? "Analyzing Profile with Opportunity Mitra..."
                : "Find My Opportunities →"}
            </button>
            <p className="privacy-note">
              🔒 Your data is used exclusively to query eligibility rules via our AI matching agent.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
