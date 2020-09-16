import React, { Fragment, useState } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Hexagons from "../components/Hexagons";
import Feature from "../components/Feature";
import HowToBox from "../components/HowToBox";

import SearchBar from "@theme/SearchBar";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import CookieConsent from "react-cookie-consent";
import styles from "./styles.module.css";

const features = [
  {
    title: <>Getting Started</>,
    icon: "rocket",
    toUrl: "/docs/development_suite/api-console/api-design/quick_rest_api",
    description: (
      <>
        Start to learn the main concepts of Mia-Platform and how to use to
        develop your services
      </>
    ),
  },
  {
    title: <>DevOps Console</>,
    icon: "console",
    toUrl: "/docs/development_suite/overview-dev-suite",
    description: (
      <>
        Start to use only one platform to design and manage the full-cycle of
        your DevOps
      </>
    ),
  },
  {
    title: <>Learn to build what you want</>,
    icon: "learn",
    toUrl: "/docs/development_suite/api-console/api-design/plugin_baas_4",
    description: (
      <>
        Read our tutorials, follow walkthroughs and learn how to decouple your
        IT systems from your channels and develop modern cloud‑native
        applications.
      </>
    ),
  },
];

const secondRowFeatures = [
  {
    title: <>What's new?</>,
    icon: "new",
    description: <>Discover new cool features, updates and bug fixes</>,
    links: [
      {
        icon: "video",
        target: "_blank",
        href:
          "https://hs-5308597.t.hubspotstarter-ib.net/e2t/tc/VVTdHT5ZWwh6VPBVXw61RX-TW3trWRD4fhn-MN2H2jyV3lGmQV1-WJV7CgCSLW47Bdvt345Pn7W4gz7-B40yzydW3rgf7S8xNYPgW2PsKpL5nhQRqW5Y4wG632vhMWN7jKskGXCG91MWjDFpDcJBGW6Lk3yJ18k9jTVytMZp33jMRyW1X8sfL94K0CsN4lBH-bXhY-6N6G7FpTkmsmBW84zY1D7bCRpLW822fVs7KWpv1W5BDlx38y9LQFW26ZHz_71nm8vN1xvT_XqmtqkW7l-Msn6fPzcCW7xhwMz4qzz7fW5nX6Gm8fP09RW6j0JQJ1-w313W3BS3lc86F3SR3lf11",
        label: "Mia-Platform v6.0 new features",
      },
      {
        icon: "releaseNotes",
        href: "/docs/release_notes/release_notes",
        label: "Read the release notes",
      },
    ],
  },
];

const howToBoxProperties = {
  title: "How can I?",
  description:
    "Check out the following topics to learn how to build, deploy, debug and monitor your services with Mia-Platform",
  links: [
    {
      label: "Create services",
      href: "/docs/development_suite/api-console/api-design/services",
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
      label: "Debug a service",
      href: "/docs/development_suite/debugging/telepresence",
    },
    {
      label: "Take advantage of a ready-to-use service",
      href: "/docs/runtime_suite/overview-runtime-suite",
    },
    {
      label: "Monitor infrastructure",
      href: "/docs/development_suite/monitoring/monitoring",
    },
  ],
};

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  const [isSearchBarExpanded, setIsSearchBarExpanded] = useState(false);

  const { title, description, links } = howToBoxProperties;

  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />"
    >
      <Fragment>
        <div className={styles.container}>
          <Hexagons />
          <header style={styles.header}>
            <div className={clsx("hero hero--primary", styles.heroBanner)}>
              <div className="container">
                <p className="hero__subtitle">{siteConfig.tagline}</p>
              </div>
              <SearchBar
                placeholder="Search tutorials"
                searchBarInHome={true}
                searchBarId="search_input_home"
                handleSearchBarToggle={setIsSearchBarExpanded}
                isSearchBarExpanded={isSearchBarExpanded}
              />
            </div>
          </header>
        </div>
      </Fragment>

      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
              <div className={clsx("row", styles.secondRow)}>
                <HowToBox
                  title={title}
                  description={description}
                  links={links}
                />
                {secondRowFeatures.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
