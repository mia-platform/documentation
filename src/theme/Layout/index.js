/* eslint-disable react/prop-types */
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
import CookieConsent, {Cookies} from "react-cookie-consent";

import TagManager from "react-gtm-module";

import {cookieBannerConf} from "./../../constants";

import "./styles.css";

const tagManagerArgs = {
  gtmId: "GTM-WTGCJM6",
};

function Providers({children}) {
  return (
    <ThemeProvider>
      <UserPreferencesProvider>{children}</UserPreferencesProvider>
    </ThemeProvider>
  );
}

function Layout(props) {
  const {siteConfig = {}} = useDocusaurusContext();
  const {
    favicon,
    title: siteTitle,
    themeConfig: {image: defaultImage},
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

  const metaTitle = title ? title : siteTitle;
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
        {metaTitle && <meta content={metaTitle} property="og:title" />}
        {favicon && <link href={faviconUrl} rel="shortcut icon" />}
        {description && <meta content={description} name="description" />}
        {description && (
          <meta content={description} property="og:description" />
        )}
        {keywords && keywords.length && (
          <meta content={keywords.join(",")} name="keywords" />
        )}
        {metaImage && <meta content={metaImageUrl} property="og:image" />}
        {metaImage && <meta content={metaImageUrl} property="twitter:image" />}
        {metaImage && (
          <meta content={`Image for ${metaTitle}`} name="twitter:image:alt" />
        )}
        {permalink && <meta content={siteUrl + permalink} property="og:url" />}
        {permalink && <link href={siteUrl + permalink} rel="canonical" />}
        <meta content="summary_large_image" name="twitter:card" />
      </Head>
      <AnnouncementBar />
      <Navbar />
      <div className="cookie-banner-box test">
        <CookieConsent
          buttonClasses="cookie-banner-buttons"
          buttonText="Accept"
          cookieName={cookieBannerConf.cookie}
          declineButtonClasses="cookie-banner-buttons"
          declineButtonText="Reject"
          disableButtonStyles
          enableDeclineButton
          location="bottom"
          onAccept={() => initTagManager()}
          onDecline={() => {}}
          setDeclineCookie
        >
          {cookieBannerConf.message}{" "}
          <a href={cookieBannerConf.moreInfoLink} target="a_blank">
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
