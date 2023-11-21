import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types"

import styles from "./styles.module.css";
import featureStyle from "../Feature/styles.module.css";

// link video: https://vimeo.com/452199686

function HowToLink({label, href}) {
  return (
    <div className={clsx("col col--6", "howToLink")}>
      <a href={href}> {label}</a>
    </div>
  );
}

HowToLink.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

function HowToBox({title, description, links}) {
  links = links || [];

  return (
    <div className={clsx("col col--12", featureStyle.feature, styles.howToBox)}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={styles.howToLinkBox}>
        {links.map((props, idx) => (
          <HowToLink key={idx} {...props} />
        ))}
      </div>
    </div>
  );
}

HowToBox.propTypes = {
  description: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  title: PropTypes.string.isRequired,
}


export default HowToBox;
