import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types"

import styles from "./styles.module.css";
import featureStyle from "../Feature/styles.module.css";
import links from "./links.json";

function LastPagesLink({title, url}) {
    return (
        <div className={clsx("col col--12", "howToLink", styles.howToLink)}>
            -<a href={url}> {title}</a>
        </div>
    );
}

LastPagesLink.propTypes = {
    href: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
}

function LastPages({title, description}) {
    const linksToShow = links.slice(0,23);
    return (
        <div className={clsx("col col--12", featureStyle.feature, styles.howToBox)}>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className={styles.howToLinkBox}>
                {linksToShow.map((props, idx) => (
                    <LastPagesLink key={idx} {...props} />
                ))}
            </div>
        </div>
    );
}

LastPages.propTypes = {
    description: PropTypes.string.isRequired,
    links: PropTypes.arrayOf(PropTypes.shape({
        href: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })).isRequired,
    title: PropTypes.string.isRequired,
}


export default LastPages;
