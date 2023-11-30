import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types"

import styles from "./styles.module.css";
import featureStyle from "../Feature/styles.module.css";
//import links from "./links.json";

const links = {
    "comparisonDetails": {
        "doneOn": "2023-11-30",
        "sourceCommitSha": "a83127c4ed67812de918b04bf5e371b2f713fc71",
        "targetVersion": "v12.0.0"
    },
    "categories": [
        {
            "title": "Getting Started",
            "prefixes": ["/getting-started"]
        },
        {
            "title": "Console",
            "prefixes": ["/runtime_suite", "/development_suite", "/console"]
        },
        {
            "title": "Composability",
            "prefixes": ["/marketplace", "/microfrontend-composer"]
        },
        {
            "title": "Fast Data",
            "prefixes": ["/fast_data"]
        }
    ],
    "pages": [
        {
            "url": "/cli/miactl/overview",
            "title": "miactl CLI"
        },
        {
            "url": "/cli/miactl/setup",
            "title": "miactl CLI Setup"
        },
        {
            "url": "/cli/miactl/commands",
            "title": "miactl CLI Commands"
        },
        {
            "url": "/cli/miactl/examples",
            "title": "miactl CLI Examples"
        },
        {
            "url": "/console/project-configuration/manage-environment-variables/manage-environment-variables-with-akv",
            "title": "Manage Environment Variables with Azure Key Vault"
        },
        {
            "url": "/development_suite/api-console/advanced-section/api-gateway-envoy/jwt-authn",
            "title": "Envoy Use Case: JWT Authentication"
        },
        {
            "url": "/fast_data/configuration/config_maps/projection_changes_schema",
            "title": "Projection Changes Schema Configuration"
        },
        {
            "url": "/fast_data/configuration/realtime_updater",
            "title": "Real-Time Updater Configuration"
        },
        {
            "url": "/fast_data/configuration/single_view_trigger_generator",
            "title": "Single View Trigger Generator"
        },
        {
            "url": "/fast_data/connectors/overview_connectors",
            "title": "Fast Data Connectors Overview"
        },
        {
            "url": "/fast_data/faq/bootstrapping_fast_data",
            "title": "Bootstrapping Fast Data"
        },
        {
            "url": "/getting-started/tutorials/architecture/auth/external-idp",
            "title": "Tutorial: Integrate an external Identity Provider"
        },
        {
            "url": "/getting-started/tutorials/architecture/auth/intro",
            "title": "Tutorial: Auth Architecture Introduction"
        },
        {
            "url": "/getting-started/tutorials/architecture/auth/multiple-projects",
            "title": "Tutorial: Centralize the authentication in a multi-projects architecture"
        },
        {
            "url": "/getting-started/tutorials/microfrontend-composer/basics",
            "title": "Microfrontend Composer Tutorial Basics"
        },
        {
            "url": "/getting-started/videos/microfrontend-composer",
            "title": "Microfrontend Composer Video"
        },
        {
            "url": "/marketplace/add_to_marketplace/contributing_overview",
            "title": " Contributing to the Marketplace"
        },
        {
            "url": "/marketplace/compatibility_matrices/mongo_compatibility_matrix",
            "title": "MongoDB Compatibility Matrix"
        },
        {
            "url": "/microfrontend-composer/overview",
            "title": " Microfrontend Composer overview"
        },
        {
            "url": "/release-notes/v12-overview",
            "title": "Mia-Platform v12 Overview"
        },
        {
            "url": "/runtime_suite/acl-service/overview",
            "title": "ACL Service"
        },
        {
            "url": "/runtime_suite/adaptive-approval-service/overview",
            "title": "Rules Service Overview"
        },
        {
            "url": "/runtime_suite/api-gateway/overview",
            "title": "API Gateway Overview"
        },
        {
            "url": "/runtime_suite/api-gateway/configuration",
            "title": "Api Gateway Configuration"
        },
        {
            "url": "/runtime_suite/api-portal/overview",
            "title": "API Portal Overview"
        },
        {
            "url": "/self_hosted/installation-chart/how_to_upgrade",
            "title": "How to Upgrade your self-hosed Console"
        },
        {
            "url": "/self_hosted/installation-chart/overview",
            "title": "Installation Chart Overview"
        },
        {
            "url": "/self_hosted/installation-chart/general_settings",
            "title": "Installation Chart General Settings"
        },
        {
            "url": "/self_hosted/installation-chart/installation_chart_example",
            "title": "Installation Chart Example"
        }
    ]
};
function buildFindMatchingCategory(defaultCategory) {
    return ({url}) => {
        const matchingCategory = links.categories.find(({prefixes}) => prefixes.some(prefix => url.startsWith(prefix)))
        return matchingCategory?.title || defaultCategory
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
    const defaultCategory = 'Others'
    const categoriesOrder = links.categories.map(({title}) => title).concat(defaultCategory)
    const pagesByCategory = Object.groupBy(pagesToShow, buildFindMatchingCategory(defaultCategory))
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
