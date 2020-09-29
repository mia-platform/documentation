import React from "react";
import clsx from "clsx";
import PropTypes from 'prop-types'

import SVGIcon from "../SVGIcon";
import styles from "./styles.module.css";

const iconComponents = {
  rocket: SVGIcon.rocketSVG,
  console: SVGIcon.consoleSVG,
  learn: SVGIcon.learnSVG,
  new: SVGIcon.newSVG,
  video: SVGIcon.videoSVG,
  releaseNotes: SVGIcon.releaseNotesSVG,
};

function Feature({toUrl, icon, title, description, links}) {
  const IconComponent = iconComponents[icon];
  links = links || [];

  return (
    <div className={clsx("col col--4", styles.feature)}>
      <a className={styles.featureLink} href={toUrl}>
        <div>
          <IconComponent className={styles.svgIcon} />
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <div>
          {links.map((link, idx) => {
            const LinkIconconComponent = iconComponents[link.icon];

            return (
              <a
                className={styles.linkBox}
                href={link.href}
                key={idx}
                target={link.target}
              >
                <LinkIconconComponent
                  className={clsx(styles.svgIcon, styles.small)}
                />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      </a>
    </div>
  );
}

Feature.propTypes = {
  description: PropTypes.string.isRequired,
  icon: PropTypes.oneOf(Object.keys(iconComponents)).isRequired,
  links: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })),
  title: PropTypes.string.isRequired,
  toUrl: PropTypes.string.isRequired
}

export default Feature;
