import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types"

import styles from "./styles.module.css";
import featureStyle from "../Feature/styles.module.css";
import links from "./links.json";

function LastPagesLink({title, url}) {
    return (
        <div className={clsx("col col--12", "howToLink", styles.howToLink)}>
            {'-'} <a href={`/docs/preview${url}`}>{title}</a>
        </div>
    );
}

LastPagesLink.propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
}

function LastPages({title, description}) {
    const pagesToShow = links.pages.slice(0, 23);
    const others = pagesToShow
            .filter(({url}) => !links.categories.some(({prefix}) => url.startsWith(prefix)))
            .map((props, idx) => (<LastPagesLink key={idx} {...props} />))
    return (
        <div className={clsx("col col--12", featureStyle.feature, styles.howToBox)}>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className={styles.howToLinkBox}>
                {
                    links.categories.map(({title, prefix}, categoryId) => {
                        const linksComponents = pagesToShow
                            .filter((({url}) => url.startsWith(prefix)))
                            .map((props, idx) => (<LastPagesLink key={idx} {...props} />))
                        return linksComponents.length > 0 ? (
                            <div className={clsx("row", styles.howToCategoryBox)} key={categoryId}>
                                <h4>{title}</h4>
                                {linksComponents}
                            </div>
                        ): undefined
                    }).concat(
                            <div className={clsx("row", styles.howToCategoryBox)} key={links.categories.length}>
                                <h4>{"Others"}</h4>
                                {others}
                            </div>
                    )
                }
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
