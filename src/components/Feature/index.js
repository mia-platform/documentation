import React from "react";
import SVGIcon from "../SVGIcon";
import clsx from "clsx";

import styles from "./styles.module.css";

const iconComponents = {
  rocket: SVGIcon.rocketSVG,
  console: SVGIcon.consoleSVG,
  learn: SVGIcon.learnSVG,
  new: SVGIcon.newSVG,
  video: SVGIcon.videoSVG,
  releaseNotes: SVGIcon.releaseNotesSVG,
};

function Feature({ toUrl, icon, title, description, links }) {
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
          {links.map((link) => {
            const LinkIconconComponent = iconComponents[link.icon];

            return (
              <a
                href={link.href}
                className={styles.linkBox}
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

export default Feature;
