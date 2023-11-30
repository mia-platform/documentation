import React, {Fragment, useState, useEffect} from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";

import Logo from "../components/Logo";
import Hexagons from "../components/Hexagons";
import Feature from "../components/Feature";
import VersionBanner from "../components/VersionBanner";
import HowToBox from "../components/HowToBox";
import LastPages from "../components/LastPages";
import {desktop} from "../lib/constants";

import SearchBar from "@theme/SearchBar";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {useWindowSize} from "@docusaurus/theme-common";

import styles from "./styles.module.css";
import PropTypes from "prop-types";

const features = [
  {
    type: "feature",
    title: "Getting Started",
    icon: "rocket",
    toUrl: "/docs/getting-started/mia-platform-overview",
    description: `Start to learn the main concepts of Mia-Platform and how to use to  develop your services`,
  },
  {
    type: "feature",
    title: "Console",
    icon: "console",
    toUrl: "/docs/development_suite/overview-dev-suite",
    description: `Start to use only one platform to design and manage the full-cycle of your DevOps`,
  },
  {
    type: "feature",
    title: "Learn to build what you want",
    icon: "learn",
    toUrl: "/docs/getting-started/videos/",
    description: `Read our tutorials, follow walkthroughs and learn how to decouple your
        IT systems from your channels and develop modern cloud-native
        applications.`,
  },
  {
    type: "feature",
    title: "What's new?",
    icon: "new",
    description: "Discover new cool features, updates and bug fixes",
    links: [
      {
        icon: "releaseNotes",
        href: "/docs/release-notes/versions",
        label: "Read the release notes",
      },
      {
        icon: "globe",
        target: "_blank",
        href: "https://mia-platform.eu/mia-platform-v12/",
        label: "Discover Mia-Platform v12 🎉",
      },
    ],
  },
  {
    type: "howTo",
    title: "How can I?",
    description:
        "Check out the following topics to learn how to build, deploy, debug and monitor your services with Mia-Platform",
    links: [
      {
        label: "Create services",
        href: "/docs/development_suite/api-console/api-design/services",
      },
      {
        label: "Expose services",
        href: "/docs/development_suite/api-console/api-design/endpoints",
      },
      {
        label: "Store data in a CRUD",
        href: "/docs/development_suite/api-console/api-design/crud_advanced",
      },
      {
        label: "Deploy my configurations",
        href: "/docs/development_suite/deploy/deploy",
      },
      {
        label: "Take advantage of a ready-to-use service",
        href: "/docs/marketplace/overview_marketplace",
      },
      {
        label: "Monitor infrastructure",
        href: "/docs/development_suite/monitoring/introduction",
      },
      {
        label: "Create Public Variables",
        href: "/docs/development_suite/api-console/api-design/public_variables",
      },
    ],
  }
];

const recentLinks = {
  title: "Latest Documentation Updates",
  description:
      "Do you wish to stay updated on the latest changes and additions to our documentation? Please refer to the links below."
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;

  const [showHexagons, setHexagonsShown] = useState(false);

  const windowSize = useWindowSize();

  useEffect(() => {
    setHexagonsShown(windowSize === desktop);
  }, [windowSize]);

  return (
    <Layout
      description="Mia-Platform provides the first end-to-end Digital Integration Hub on the market with a full DevOps Lifecycle Management: one unique Console to run Fast Data, Microservices and APIs."
      title={siteConfig.title}
    >
      <Fragment>
        <div className={styles.container}>
          {showHexagons && <Hexagons />}
          <header style={styles.header}>
            <div className={clsx("hero hero--primary", styles.heroBanner)}>
              <div className="container">
                <Logo />
                <p className="hero__subtitle">{siteConfig.tagline}</p>
              </div>
              <div className="searchBarBox home">
                <SearchBar avoidKeyboardShortcuts />
              </div>
            </div>
          </header>
        </div>
      </Fragment>

      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              {<div className="row">
              <VersionBanner
                link="/docs/preview/release-notes/v12-overview"
                majorVersion="12"
                subTitle="Click here and learn about the new features in this new v12."
                title="Mia-Platform v12 is now Generally Available"
              />
              </div>}

              <div className="row">
                <div className="col col--8">
                  <div className="row">
                    {features.map((props, idx) => {
                      if (props.type === 'feature') {
                        return <Feature key={idx} {...props} />
                      } else {
                        const {title, description, links} = props;
                        return (
                            <HowToBox
                              description={description}
                              key={idx}
                              links={links}
                              title={title}
                            />
                        );
                      }
                    })}
                  </div>

                </div>
                <div className="col col--4">
                  <div className="row">
                    TBC
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

Home.propTypes = {
  description: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  type: PropTypes.string
}

export default Home;
