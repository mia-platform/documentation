import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';
import {BadgeIcons, resolveAreaIcon} from './icons';

const BADGE_CONFIG = [
  {key: 'newFeatures', label: 'New Feature', heading: 'New Features', className: styles.badgeNewFeature, Icon: BadgeIcons.newFeature},
  {key: 'improvements', label: 'Improvement', heading: 'Improvements', className: styles.badgeImprovement, Icon: BadgeIcons.improvement},
  {key: 'bugFixes', label: 'Bug fix', heading: 'Bug fixes', className: styles.badgeBugFix, Icon: BadgeIcons.bugFix},
];

function Badge({count, label, className, Icon}) {
  if (!count) return null;
  return (
    <span className={`${styles.badge} ${className}`}>
      <Icon className={styles.badgeIcon} />
      {label}
      <span className={styles.badgeCount}>{count}</span>
    </span>
  );
}
Badge.propTypes = {
  Icon: PropTypes.elementType,
  className: PropTypes.string,
  count: PropTypes.number,
  label: PropTypes.string,
};

const areaShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  newFeatures: PropTypes.arrayOf(PropTypes.node),
  improvements: PropTypes.arrayOf(PropTypes.node),
  bugFixes: PropTypes.arrayOf(PropTypes.node),
});

function AreaRow({area}) {
  const [open, setOpen] = useState(false);
  const Icon = resolveAreaIcon(area.name);
  const groups = BADGE_CONFIG.map((cfg) => ({
    ...cfg,
    items: area[cfg.key] || [],
  })).filter((g) => g.items.length > 0);

  return (
    <div className={`${styles.areaRow} ${open ? styles.areaRowOpen : ''}`}>
      <button
        aria-expanded={open}
        className={styles.areaHeader}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span className={styles.areaIconWrap}>
          <Icon className={styles.areaIcon} />
        </span>
        <span className={styles.areaName}>{area.name}</span>
        <span className={styles.badgeRow}>
          {groups.map((g) => (
            <Badge Icon={g.Icon} className={g.className} count={g.items.length} key={g.key} label={g.label} />
          ))}
        </span>
        <span aria-hidden="true" className={styles.chevron}>
          <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24" width="14">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      {open && (
        <div className={styles.areaBody}>
          {groups.map((g) => (
            <div className={styles.group} key={g.key}>
              <h5 className={styles.groupHeading}>{g.heading}</h5>
              <ul className={styles.groupList}>
                {g.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
AreaRow.propTypes = {
  area: areaShape.isRequired,
};

/**
 * ReleaseNoteAccordion: groups a release's changes by functional area.
 * Each area is a collapsible row (collapsed by default) showing pill
 * badges with counts for New Feature / Improvement / Bug fix, and
 * expands to the underlying one-line change descriptions.
 *
 * Usage:
 * <ReleaseNoteAccordion areas={[
 *   { name: "System Design", newFeatures: ["..."], improvements: ["..."], bugFixes: ["..."] },
 * ]} />
 */
export default function ReleaseNoteAccordion({areas}) {
  if (!areas || areas.length === 0) return null;
  return (
    <div className={styles.wrapper}>
      {areas.map((area) => (
        <AreaRow area={area} key={area.name} />
      ))}
    </div>
  );
}
ReleaseNoteAccordion.propTypes = {
  areas: PropTypes.arrayOf(areaShape),
};

export {ReleaseNoteAccordion};
