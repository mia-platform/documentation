/* eslint-disable react/prop-types */

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import LayoutProviders from '@theme/LayoutProviders';
import LayoutHead from '@theme/LayoutHead';
import useKeyboardNavigation from '@theme/hooks/useKeyboardNavigation';
import CookieConsent, {Cookies} from "react-cookie-consent";
import TagManager from "react-gtm-module";

import {cookieBannerConf} from "./../../constants";

import './styles.css';

const tagManagerArgs = {
  gtmId: "GTM-WTGCJM6",
};

function Layout(props) {
  const {children, noFooter, wrapperClassName} = props;

  const isProd = process.env.NODE_ENV === "production";

  const initTagManager = () => {
    if (!isProd) return;
    TagManager.initialize(tagManagerArgs);
  };

  const authorizedCookie = Cookies.get(cookieBannerConf.cookie);

  if (authorizedCookie === "true") {
    initTagManager();
  }

  useKeyboardNavigation();
  return (
    <LayoutProviders>
      <LayoutHead {...props} />

      <SkipToContent />

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

      <div className={clsx('main-wrapper', wrapperClassName)}>{children}</div>

      {!noFooter && <Footer />}
    </LayoutProviders>
  );
}

export default Layout;
