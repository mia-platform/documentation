import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types"

import styles from "./styles.module.css";
import featureStyle from "../Feature/styles.module.css";
import links from "./links.json";

function buildSortBy(order) {
    return (a, b) => {
        if (order.indexOf(a) < 0 && order.indexOf(b) < 0) { return 0 }
        if (order.indexOf(a) < 0) { return 1 }
        if (order.indexOf(b) < 0) { return -1 }
        return order.indexOf(a) - order.indexOf(b)
    }
}

function buildFindMatchingCategory() {
    return ({url}) => {
        const matchingCategory = links.categories.find(({prefix}) => url.startsWith(prefix))
        return matchingCategory?.title || 'Others'
    }
}
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
    const categoriesOrder = links.categories.map(({title}) => title)
    const pagesByCategory = Object.groupBy(pagesToShow, buildFindMatchingCategory())
    return (
        <div className={clsx("col col--12", featureStyle.feature, styles.howToBox)}>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className={styles.howToLinkBox}>
                {
                    Object.keys(pagesByCategory)
                        .sort(buildSortBy(categoriesOrder))
                        .map((title, categoryId)=> {
                            const linksComponents =  pagesByCategory[title].map((props, idx) => (<LastPagesLink key={idx} {...props} />))
                            return linksComponents.length > 0 ? (
                                <div className={clsx("row", styles.howToCategoryBox)} key={categoryId}>
                                    <h4>{title}</h4>
                                    {linksComponents}
                                </div>
                            ): undefined
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
