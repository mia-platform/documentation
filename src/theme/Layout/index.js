/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ThemeProvider from "@theme/ThemeProvider";
import UserPreferencesProvider from "@theme/UserPreferencesProvider";
import AnnouncementBar from "@theme/AnnouncementBar";
import Navbar from "@theme/Navbar";
import Footer from "@theme/Footer";
import CookieConsent, { Cookies } from "react-cookie-consent";

import TagManager from "react-gtm-module";

import { cookieBannerConf } from "./../../constants";

import "./styles.css";

const tagManagerArgs = {
  gtmId: "GTM-WTGCJM6",
};

function Providers({ children }) {
  return (
    <ThemeProvider>
      <UserPreferencesProvider>{children}</UserPreferencesProvider>
    </ThemeProvider>
  );
}

function Layout(props) {
  const { siteConfig = {} } = useDocusaurusContext();
  const {
    favicon,
    title: siteTitle,
    themeConfig: { image: defaultImage },
    url: siteUrl,
  } = siteConfig;
  const {
    children,
    title,
    noFooter,
    description,
    image,
    keywords,
    permalink,
  } = props;

  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaImage = image || defaultImage;
  const metaImageUrl = useBaseUrl(metaImage, {
    absolute: true,
  });
  const faviconUrl = useBaseUrl(favicon);

  const isProd = process.env.NODE_ENV === "production";

  const initTagManager = () => {
    if (!isProd) return;
    TagManager.initialize(tagManagerArgs);
  };

  const authorizedCookie = Cookies.get(cookieBannerConf.cookie);

  if (authorizedCookie === "true") {
    initTagManager();
  }

  return (
    <Providers>
      <Head>
        {/* TODO: Do not assume that it is in english language */}
        <html lang="en" />

        {metaTitle && <title>{metaTitle}</title>}
        {metaTitle && <meta property="og:title" content={metaTitle} />}
        {favicon && <link rel="shortcut icon" href={faviconUrl} />}
        {description && <meta name="description" content={description} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
        {keywords && keywords.length && (
          <meta name="keywords" content={keywords.join(",")} />
        )}
        {metaImage && <meta property="og:image" content={metaImageUrl} />}
        {metaImage && <meta property="twitter:image" content={metaImageUrl} />}
        {metaImage && (
          <meta name="twitter:image:alt" content={`Image for ${metaTitle}`} />
        )}
        {permalink && <meta property="og:url" content={siteUrl + permalink} />}
        {permalink && <link rel="canonical" href={siteUrl + permalink} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <AnnouncementBar />
      <Navbar />
      <div className="cookie-banner-box test">
        <CookieConsent
          location="bottom"
          buttonText="Accept"
          declineButtonText="Reject"
          cookieName={cookieBannerConf.cookie}
          disableButtonStyles
          buttonClasses="cookie-banner-buttons"
          enableDeclineButton
          declineButtonClasses="cookie-banner-buttons"
          onDecline={() => {}}
          setDeclineCookie
          onAccept={() => initTagManager()}
        >
          {cookieBannerConf.message}{" "}
          <a target="a_blank" href={cookieBannerConf.moreInfoLink}>
            {cookieBannerConf.moreInfoMessage}
          </a>
        </CookieConsent>
      </div>
      <div className="main-wrapper">{children}</div>
      {!noFooter && <Footer />}
    </Providers>
  );
}

export default Layout;
