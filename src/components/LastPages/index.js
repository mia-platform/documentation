import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types"

import styles from "./styles.module.css";
import featureStyle from "../Feature/styles.module.css";
import links from "./links.json";

function buildFindMatchingCategory(defaultCategory) {
    return ({url}) => {
        const matchingCategory = links.categories.find(({prefixes}) => prefixes.some(prefix => url.startsWith(prefix)))
        return matchingCategory?.title || defaultCategory
    }
}
function LastPagesLink({title, url}) {
    return (
        <div className={clsx("col col--12", "howToLink", styles.howToLink)}>
            {'-'} <a href={`/docs${url}`}>{title}</a>
        </div>
    );
}

// TODO remove and use Object.groupBy after updating build pipeline to use a newer node version
function groupBy(xs, matchingFunction) {
    return xs.reduce(function (rv, x) {
        (rv[matchingFunction(x)] = rv[matchingFunction(x)] || []).push(x);
        return rv;
    }, {});
}

LastPagesLink.propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
}

function LastPages({title, description}) {
    const pagesToShow = links.pages.slice(0, 23);
    const defaultCategory = 'Others'
    const categoriesOrder = links.categories.map(({title}) => title).concat(defaultCategory)
    const pagesByCategory = groupBy(pagesToShow, buildFindMatchingCategory(defaultCategory))
    return (
        <div className={clsx("col col--12", featureStyle.feature, styles.howToBox)}>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className={styles.howToLinkBox}>
                {
                    categoriesOrder
                        .map((title, categoryId) => {
                            const pagesOfCurrentCategory = pagesByCategory[title]
                            if (!pagesOfCurrentCategory) {
                                return
                            }
                            const linksComponents = pagesOfCurrentCategory.map((props, idx) => (<LastPagesLink key={idx} {...props} />))
                            return (
                                <div className={clsx("row", styles.howToCategoryBox)} key={categoryId}>
                                    <h4>{title}</h4>
                                    {linksComponents}
                                </div>
                            )
                        })
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
