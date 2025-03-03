import React, {Fragment, useState, useEffect} from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";

import Logo from "../components/Logo";
import Feature from "../components/Feature";
import HowToBox from "../components/HowToBox";
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
    toUrl: "/docs/p4samd/overview",
    description: `Start to learn the main concepts of Mia-Care P4SaMD and how to use to develop SaMD`,
  },
  {
    type: "feature",
    title: "Console",
    icon: "console",
    toUrl: "https://docs.mia-platform.eu/",
    description: `Start to use only one platform to design and manage the full-cycle of your DevOps`,
  },
  {
    type: "feature",
    title: "Frequently Asked Questions",
    icon: "learn",
    toUrl: "/docs/p4samd/faq",
    description: `Find answers to the most common questions about Mia-Care P4SaMD`,
  }
];

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
              <div className="row">
                <div className="col col--12">
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
