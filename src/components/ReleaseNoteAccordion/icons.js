import React from 'react';

/**
 * Generic line icons used by ReleaseNoteAccordion.
 * These are original, minimal glyphs (not sourced from any third-party
 * icon set or brand) so each functional area gets a recognizable but
 * neutral pictogram.
 */

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const AreaIcons = {
  systemDesign: (props) => (
    <svg {...base} {...props}>
      <rect height="7" rx="1.2" width="7" x="3" y="3" />
      <rect height="7" rx="1.2" width="7" x="14" y="3" />
      <rect height="7" rx="1.2" width="7" x="3" y="14" />
      <rect height="7" rx="1.2" width="7" x="14" y="14" />
    </svg>
  ),
  sbom: (props) => (
    <svg {...base} {...props}>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  ),
  riskManagement: (props) => (
    <svg {...base} {...props}>
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      <path d="M12 8v5" />
      <path d="M12 16.5v.01" />
    </svg>
  ),
  requirements: (props) => (
    <svg {...base} {...props}>
      <rect height="18" rx="1.5" width="12" x="6" y="3" />
      <path d="M9 3V2h6v1" />
      <path d="M9 9h6" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  ),
  verification: (props) => (
    <svg {...base} {...props}>
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  brownfieldImport: (props) => (
    <svg {...base} {...props}>
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
    </svg>
  ),
  whisper: (props) => (
    <svg {...base} {...props}>
      <path d="M12 3l1.2 2.9L16 7l-2.8 1.1L12 11l-1.2-2.9L8 7l2.8-1.1L12 3z" />
      <path d="M5 13l.7 1.6L7.3 15l-1.6.7L5 17.3l-.7-1.6L2.7 15l1.6-.7L5 13z" />
      <path d="M18 14l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9.9-2z" />
    </svg>
  ),
  aiConfiguration: (props) => (
    <svg {...base} {...props}>
      <path d="M4 6h10" />
      <path d="M4 12h5" />
      <path d="M4 18h10" />
      <circle cx="17" cy="6" r="2.2" />
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="17" cy="18" r="2.2" />
    </svg>
  ),
  organization: (props) => (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17.5" cy="8.5" r="2.3" />
      <path d="M15.5 14.2a5 5 0 015.5 5.8" />
    </svg>
  ),
  security: (props) => (
    <svg {...base} {...props}>
      <rect height="9" rx="1.5" width="14" x="5" y="11" />
      <path d="M8 11V7a4 4 0 018 0v4" />
      <path d="M12 15v2" />
    </svg>
  ),
  productConfiguration: (props) => (
    <svg {...base} {...props}>
      <path d="M20.6 12.9a8.6 8.6 0 000-1.8l1.9-1.5-2-3.4-2.2.9a8.5 8.5 0 00-1.6-.9L16.4 4h-4l-.3 2.2a8.5 8.5 0 00-1.6.9l-2.2-.9-2 3.4L8.2 11a8.6 8.6 0 000 1.8l-1.9 1.5 2 3.4 2.2-.9c.5.4 1 .7 1.6.9l.3 2.2h4l.3-2.2c.6-.2 1.1-.5 1.6-.9l2.2.9 2-3.4-1.9-1.5z" />
      <circle cx="14" cy="12" r="2.6" />
    </svg>
  ),
  systemOverview: (props) => (
    <svg {...base} {...props}>
      <path d="M4 13a8 8 0 0116 0" />
      <path d="M12 13l3.5-4" />
      <path d="M4 13h1" />
      <path d="M19 13h1" />
      <path d="M12 5v1" />
    </svg>
  ),
  platformInfrastructure: (props) => (
    <svg {...base} {...props}>
      <rect height="5" rx="1.2" width="16" x="4" y="4" />
      <rect height="5" rx="1.2" width="16" x="4" y="10.5" />
      <rect height="3.5" rx="1.2" width="16" x="4" y="17" />
      <path d="M7.5 6.5h.01" />
      <path d="M7.5 13h.01" />
    </svg>
  ),
  versionManagement: (props) => (
    <svg {...base} {...props}>
      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  ),
  aiEvaluations: (props) => (
    <svg {...base} {...props}>
      <rect height="8" rx="1.2" width="8" x="8" y="8" />
      <rect height="18" rx="2" width="18" x="3" y="3" />
      <path d="M9 3V1M15 3V1M9 23v-2M15 23v-2M3 9H1M3 15H1M23 9h-2M23 15h-2" />
    </svg>
  ),
  default: (props) => (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8" />
    </svg>
  ),
};

// Badge-type icons (New Feature / Improvement / Bug fix), small and monochrome
// via currentColor so they inherit each badge's text color.
export const BadgeIcons = {
  newFeature: (props) => (
    <svg fill="currentColor" height="12" viewBox="0 0 24 24" width="12" {...props}>
      <path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4L12 2z" />
    </svg>
  ),
  improvement: (props) => (
    <svg
      fill="none"
      height="12"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      viewBox="0 0 24 24"
      width="12"
      {...props}
    >
      <path d="M4 17l6-6 4 4 6-8" />
      <path d="M15 6h5v5" />
    </svg>
  ),
  bugFix: (props) => (
    <svg
      fill="none"
      height="12"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="12"
      {...props}
    >
      <rect height="10" rx="4" width="8" x="8" y="8" />
      <path d="M12 8V6" />
      <path d="M9 10L6 8M15 10l3-2M9 14H5M19 14h-4M9 17l-2.5 2M15 17l2.5 2" />
    </svg>
  ),
};

/**
 * Resolve an icon renderer for a given area name. Falls back to a generic
 * dot icon when the name isn't in the explicit map, so new functional
 * areas never break rendering.
 */
const NAME_TO_ICON_KEY = {
  'system design': 'systemDesign',
  'sbom': 'sbom',
  'risk management': 'riskManagement',
  'requirements': 'requirements',
  'verification': 'verification',
  'brownfield import': 'brownfieldImport',
  'whisper ai assistant': 'whisper',
  'ai configuration': 'aiConfiguration',
  'organization & members': 'organization',
  'authentication & security': 'security',
  'product configuration': 'productConfiguration',
  'system overview': 'systemOverview',
  'platform & infrastructure': 'platformInfrastructure',
  'version management': 'versionManagement',
  'ai evaluations': 'aiEvaluations',
};

export function resolveAreaIcon(name) {
  const key = NAME_TO_ICON_KEY[(name || '').trim().toLowerCase()];
  return AreaIcons[key] || AreaIcons.default;
}
