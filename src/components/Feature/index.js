import React from "react";
import clsx from "clsx";
import PropTypes from 'prop-types'

import SVGIcon from "../SVGIcon";
import styles from "./styles.module.css";

const iconComponents = {
  rocket: SVGIcon.rocketSVG,
  console: SVGIcon.consoleSVG,
  globe: SVGIcon.globeSVG,
  learn: SVGIcon.learnSVG,
  new: SVGIcon.newSVG,
  video: SVGIcon.videoSVG,
  releaseNotes: SVGIcon.releaseNotesSVG,
};

const getContent=(icon, title, description,links) => {
  const IconComponent = iconComponents[icon];
  
  return (  
    <>
      <div>
        <IconComponent className={styles.svgIcon} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div>
        {
          links.map((link, idx) => {
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
          })
        }
      </div>
    </>
  )
}

function Feature(props) {
  const {links = []}=props
  const {icon, title, description,toUrl}=props

  return (
    <div className={clsx("col col--6", styles.feature)}>
      {
        toUrl ? (<a className={styles.featureLink} href={toUrl}>{getContent(icon, title, description,links)}</a>) : (getContent(icon, title, description,links))
      }
    </div>
  )
}

Feature.propTypes = {
  description: PropTypes.string.isRequired,
  icon: PropTypes.oneOf(Object.keys(iconComponents)).isRequired,
  links: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string,
    href: PropTypes.string,
    target: PropTypes.string,
    label: PropTypes.string
  })),
  title: PropTypes.string.isRequired,
  toUrl: PropTypes.string
}

export default Feature;
