import React, {useState, useMemo} from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";

const FAQ_DATA = [
  {
    category: "Platform & Positioning",
    items: [
      {
        q: "Is P4SaMD an eQMS?",
        a: "No. P4SaMD is not an Electronic Quality Management System (eQMS). It integrates with your eQMS, giving you access from the platform interface to the documents stored there, and it enforces the policies defined in your QMS. It does not replace your eQMS.",
      },
      {
        q: "Is P4SaMD an ALM tool?",
        a: "No. P4SaMD is not an Application Lifecycle Management tool. Version 3 does include native work-item management: requirements, risks, tests, and changes are managed inside the platform. External ALM tools such as Jira are supported as optional integrations with bidirectional synchronization, but they are no longer a prerequisite. P4SaMD works without an existing ALM setup.",
      },
      {
        q: "Does P4SaMD v3 require Mia-Platform Console or any other specific platform?",
        a: "No. P4SaMD version 3 is a standalone platform and does not require Mia-Platform Console to be deployed or in use by your organization. Authentication uses a federated OIDC identity provider that is part of the P4SaMD installation, independent of any third-party platform. This is a change from version 2, which was integrated with Mia-Platform Console.",
      },
    ],
  },
  {
    category: "Compliance & Certification",
    items: [
      {
        q: "Is P4SaMD certified as SaMD?",
        a: "No. P4SaMD has no specific intended medical use, so it cannot be certified as Software as a Medical Device. It is validated for use in developing SaMD solutions: the validation confirms that the platform meets the reliability and quality requirements for regulated software development.",
      },
      {
        q: "Is P4SaMD validated for SaMD development?",
        a: "Yes. P4SaMD is validated for use in the development of solutions intended to be certified as SaMD. Validation follows industry guidelines such as GAMP 5 (Good Automated Manufacturing Practice) and GMP Annex 11. For validation documentation, contact Mia-Care.",
      },
      {
        q: "Does using P4SaMD automatically grant regulatory certification?",
        a: "No. P4SaMD does not provide automatic certification for the software developed with it, and Mia-Care is not a notified body. Mia-Care has a network of partners, including notified bodies, who can assist you in obtaining certification. P4SaMD simplifies the preparation by keeping your development activities aligned with regulatory expectations and by generating the required compliance documentation.",
      },
    ],
  },
  {
    category: "Integrations",
    items: [
      {
        q: "Can I integrate tools that P4SaMD does not natively support?",
        a: "Yes. P4SaMD exposes APIs you can use to connect it to any tool or technology stack. Your team can build the integrations, or Mia-Care can build them with you.",
      },
    ],
  },
  {
    category: "Artificial Intelligence",
    items: [
      {
        q: "How does P4SaMD support Artificial Intelligence features in medical software?",
        a: "P4SaMD includes an AI Validation module for medical software that incorporates machine learning and AI components. The module addresses requirements under the EU AI Act, FDA Good Machine Learning Practices (GMLP), and Predetermined Change Control Plans (PCCP). It manages training datasets, model versions, and performance metrics, and automates assessments of substantial modifications when AI models are updated. The Smart Insight (Whisper) module uses AI to evaluate project artifacts against regulatory rules, identify quality issues in requirements, and highlight gaps in test coverage. An administrator can enable or disable AI-powered features per organization.",
      },
      {
        q: "How does Mia-Care P4SaMD handle my data when using AI features?",
        a: "Mia-Care does not provide any AI foundation models. You connect your own models to P4SaMD, so your data is processed only by the AI provider you choose and under the terms you have agreed with that provider.",
      },
      {
        q: "Does P4SaMD mask sensitive data before sending it to my LLM?",
        a: "No. At the moment there is no masking step that prevents sensitive data from being sent to your LLM. Since the LLM is yours and Mia-Care does not supply any LLM as part of the subscription, data privacy is governed by your own provider agreements and configuration.",
      },
      {
        q: "Does Mia-Care P4SaMD provide any control over AI costs?",
        a: "Not by default. P4SaMD can, however, leverage an AI Gateway that gates requests to AI models, so you can enforce guardrails and manage costs. This is a custom configuration available for Dedicated SaaS and self-hosted deployments. The most secure way to control costs is to set appropriate limits on your AI provider account.",
      },
      {
        q: "How are the AI agents and capabilities provided by Mia-Care validated?",
        a: "Validation datasets are executed at every release, and the results must meet a defined performance level. Regulatory experts contribute both to the definition of the validation sets and to the judgement of the validation results. For further information about AI documentation, please contact Mia-Care.",
      },
    ],
  },
  {
    category: "Deployment & Architecture",
    items: [
      {
        q: "What deployment models are available?",
        a: "P4SaMD v3 supports three deployment models. Multi-Tenant SaaS is a shared cloud instance managed by Mia-Care, with logical data isolation. Dedicated SaaS gives each customer dedicated cloud infrastructure with physical database isolation. On-Premise is self-hosted by the customer, for complete data sovereignty and air-gapped network support. All three models provide the same feature set.",
      },
      {
        q: "Can multiple teams in my organization use P4SaMD simultaneously?",
        a: "Yes. P4SaMD v3 uses a multi-tenant architecture. Within your organization you can create and manage multiple independent projects, each with its own team, configuration, compliance context, and version history. Users can be assigned to specific projects with role-based access.",
      },
      {
        q: "What happens to my v2 configuration if I migrate to v3?",
        a: "P4SaMD v3 is a new platform with a different architecture, so direct in-place migration from v2 to v3 is not supported. To onboard your existing project, the recommended path is the Brownfield Import feature in v3: it performs a compliance gap analysis and generates a remediation plan. For migration support, contact Mia-Care.",
      },
    ],
  },
];

function AccordionItem({q, a, isOpen, onToggle}) {
  return (
    <div className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
      <button
        aria-expanded={isOpen}
        className={styles.question}
        onClick={onToggle}
      >
        <span>{q}</span>
        <span className={styles.chevron}>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className={styles.answer}>
          <p>{a}</p>
        </div>
      )}
    </div>
  );
}
AccordionItem.propTypes = {
  a: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  q: PropTypes.string.isRequired,
};

export default function FAQ() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState({});

  const filtered = useMemo(() => {
    if (!search.trim()) return FAQ_DATA;
    const q = search.toLowerCase();
    return FAQ_DATA.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.q.toLowerCase().includes(q) ||
          item.a.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [search]);

  function toggleItem(catIdx, itemIdx) {
    const key = `${catIdx}-${itemIdx}`;
    setOpenItems((prev) => ({...prev, [key]: !prev[key]}));
  }

  function isOpen(catIdx, itemIdx) {
    return !!openItems[`${catIdx}-${itemIdx}`];
  }

  const totalResults = filtered.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className={styles.faqWrapper}>
      {/* Search bar */}
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>{'🔍'}</span>
        <input
          aria-label="Search FAQ"
          className={styles.searchInput}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions…"
          type="text"
          value={search}
        />
        {search && (
          <button
            aria-label="Clear search"
            className={styles.clearBtn}
            onClick={() => setSearch("")}
          >
            {'✕'}
          </button>
        )}
      </div>

      {/* Result count when searching */}
      {search && (
        <p className={styles.resultCount}>
          {totalResults === 0 ?
            "No matching questions found." :
            `${totalResults} question${totalResults !== 1 ? "s" : ""} found`}
        </p>
      )}

      {/* Categories */}
      {filtered.map((cat, catIdx) => (
        <div className={styles.category} key={catIdx}>
          <h3 className={styles.categoryTitle}>{cat.category}</h3>
          {cat.items.map((item, itemIdx) => (
            <AccordionItem
              a={item.a}
              isOpen={isOpen(catIdx, itemIdx)}
              key={itemIdx}
              onToggle={() => toggleItem(catIdx, itemIdx)}
              q={item.q}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
