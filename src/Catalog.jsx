import { useEffect, useState } from "react";
import "./Catalog.css";
import { catalogCategories } from "./catalogData";

const CATALOG_WEBHOOK_URL = "https://nijeswinlbm10.app.n8n.cloud/webhook/opportunity-mitra-catalog";

function getCatalogOpportunities(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.opportunities)) return payload.opportunities;
  if (Array.isArray(payload?.output?.opportunities)) return payload.output.opportunities;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function Catalog({ selectedCategory, onSelectCategory, onBack, onDetails }) {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(CATALOG_WEBHOOK_URL, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load the catalog.");
        }

        const payload = await response.json();
        console.log("Catalog API response:", payload);
        const opportunities = getCatalogOpportunities(payload);
        console.log("Catalog opportunities:", opportunities);
        setOpportunities(opportunities);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Unable to load catalog opportunities:", err);
          setError("Unable to load opportunities right now. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadCatalog();
    return () => controller.abort();
  }, []);

  function getOpportunityCategory(opportunity) {
    const normalize = (value) => String(value || "").trim().toLowerCase();
    const type = normalize(opportunity.type);
    const category = normalize(opportunity.category);
    const name = normalize(opportunity.name);
    const description = normalize(opportunity.description);

    const categoryRules = [
      {
        name: "Scholarships",
        keywords: ["scholarship", "financial aid", "fellowship"],
      },
      {
        name: "Certifications",
        keywords: ["certification", "certificate", "course", "credential"],
      },
      {
        name: "Internships",
        keywords: ["internship", "intern"],
      },
      {
        name: "Hackathons",
        keywords: ["hackathon", "competition", "challenge", "contest"],
      },
      {
        name: "Training Programs",
        keywords: ["training", "skill development", "learning", "academy", "student program"],
      },
    ];

    const primaryFields = [type, category];
    for (const rule of categoryRules) {
      for (const field of primaryFields) {
        if (field && rule.keywords.some((kw) => field.includes(kw))) {
          return rule.name;
        }
      }
    }

    const secondaryFields = [name, description];
    for (const rule of categoryRules) {
      for (const field of secondaryFields) {
        if (field && rule.keywords.some((kw) => field.includes(kw))) {
          return rule.name;
        }
      }
    }

    return "Training Programs";
  }

  const category = catalogCategories.find((item) => item.name === selectedCategory);
  const classifiedOpportunities = opportunities.map((opportunity) => ({
    ...opportunity,
    __category: getOpportunityCategory(opportunity),
  }));
  const matchingOpportunities = category
    ? classifiedOpportunities.filter((opportunity) => opportunity.__category === category.name)
    : [];
  const categoryCounts = Object.fromEntries(
    catalogCategories.map((item) => [
      item.name,
      classifiedOpportunities.filter((opportunity) => opportunity.__category === item.name).length,
    ])
  );

  const totalClassified = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
  console.log("Catalog total opportunities:", opportunities.length);
  console.log("Scholarship count:", categoryCounts["Scholarships"]);
  console.log("Certification count:", categoryCounts["Certifications"]);
  console.log("Internship count:", categoryCounts["Internships"]);
  console.log("Hackathon count:", categoryCounts["Hackathons"]);
  console.log("Training count:", categoryCounts["Training Programs"]);
  console.log("Sum of all category counts:", totalClassified);

  console.log("Catalog API opportunities:", opportunities.length);
  console.log("Catalog category counts:", categoryCounts);

  if (!category) {
    return (
      <main className="catalog-page">
        <div className="catalog-container">
          <button type="button" className="catalog-back-button" onClick={onBack}>
            ← Back to Home
          </button>
          <div className="catalog-heading">
            <div className="section-tag">CATALOG</div>
            <h1>Explore opportunity categories</h1>
            <p>Browse the opportunity types currently available in Opportunity Mitra.</p>
          </div>
          {isLoading ? (
            <div className="catalog-empty-state">
              <h2>Loading opportunities...</h2>
              <p>Fetching the latest catalog opportunities.</p>
            </div>
          ) : error ? (
            <div className="catalog-empty-state">
              <h2>Unable to load the catalog.</h2>
              <p>{error}</p>
            </div>
          ) : (
            <div className="catalog-category-grid">
              {catalogCategories.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  className="catalog-category-card"
                  onClick={() => onSelectCategory(item.name)}
                >
                  <span className="catalog-category-icon">{item.icon}</span>
                  <span className="catalog-category-name">{item.name}</span>
                  <span className="catalog-category-description">{item.description}</span>
                  <span className="catalog-category-count">
                    {categoryCounts[item.name]} opportunities
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="catalog-page">
      <div className="catalog-container">
        <button type="button" className="catalog-back-button" onClick={() => onSelectCategory(null)}>
          ← All Categories
        </button>
        <div className="catalog-heading catalog-results-heading">
          <div className="catalog-title-row">
            <span className="catalog-category-icon">{category.icon}</span>
            <div>
              <div className="section-tag">CATALOG</div>
              <h1>
                {category.name} — {isLoading ? "Loading..." : `${matchingOpportunities.length} opportunities`}
              </h1>
            </div>
          </div>
          <p>{category.description}</p>
        </div>

        {isLoading ? (
          <div className="catalog-empty-state">
            <div>{category.icon}</div>
            <h2>Loading opportunities...</h2>
            <p>Fetching the latest catalog opportunities.</p>
          </div>
        ) : error ? (
          <div className="catalog-empty-state">
            <div>{category.icon}</div>
            <h2>Unable to load the catalog.</h2>
            <p>{error}</p>
          </div>
        ) : matchingOpportunities.length === 0 ? (
          <div className="catalog-empty-state">
            <div>{category.icon}</div>
            <h2>No opportunities available in this category yet.</h2>
            <p>Try another category or check back after opportunities are available in the frontend.</p>
          </div>
        ) : (
          <div className="catalog-opportunity-grid">
            {matchingOpportunities.map((opportunity, index) => {
              const benefits = Array.isArray(opportunity.benefits)
                ? opportunity.benefits.join(", ")
                : opportunity.benefits;

              return (
                <article className="catalog-opportunity-card" key={opportunity.id || opportunity.name || index}>
                  <div className="catalog-card-top">
                    <span className="catalog-type-pill">{opportunity.type || opportunity.category || category.name}</span>
                    {opportunity.deadline && <span className="catalog-deadline">Deadline: {opportunity.deadline}</span>}
                  </div>
                  <h2>{opportunity.name || "Untitled Opportunity"}</h2>
                  <p className="catalog-provider">{opportunity.provider || "Official Provider"}</p>
                  {opportunity.description && <p className="catalog-description">{opportunity.description}</p>}
                  {benefits && <p className="catalog-benefits"><strong>Benefits:</strong> {benefits}</p>}
                  <div className="catalog-card-actions">
                    <button type="button" className="catalog-details-button" onClick={() => onDetails(opportunity)}>
                      View Details →
                    </button>
                    {opportunity.official_url && (
                      <a className="catalog-apply-link" href={opportunity.official_url} target="_blank" rel="noreferrer">
                        Apply
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Catalog;
