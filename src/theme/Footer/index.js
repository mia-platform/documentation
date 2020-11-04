/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import PropTypes from 'prop-types'
import {useActiveVersion} from "@theme/hooks/useDocs";

// const determineDocsVersionFromURL = (
//   path,
//   versionPathRegex
// ) => {
//   if (versionPathRegex) {
//     const matchedVersion = path.match(new RegExp(`^\\/${versionPathRegex}`));
//     return !!matchedVersion && matchedVersion.length ? matchedVersion[1] : "current";
//   }
// };


function FooterLink({to, href, label, prependBaseUrlToHref, ...props}) {
  const activeVersion = useActiveVersion();
  let calculatedToUrl=to;
  
  // If footer item link to a docs page replace the URL to go to current version page
  if(activeVersion && to) {
    calculatedToUrl = to.replace("docs",activeVersion.path.slice(1));
  }

  const toUrl = useBaseUrl(calculatedToUrl);
  const normalizedHref = useBaseUrl(href, {
    forcePrependBaseUrl: true,
  });
  return (
    <Link
      className="footer__link-item"
      {...(href ?
        {
            target: '_blank',
            rel: 'noopener noreferrer',
            href: prependBaseUrlToHref ? normalizedHref : href,
          } :
        {
            to: toUrl,
          })}
      {...props}
    >
      {label}
    </Link>
  );
}

const FooterLogo = ({url, alt}) => (
  <img alt={alt} className="footer__logo" src={url} />
);

function Footer() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const {themeConfig = {}} = siteConfig;
  const {footer} = themeConfig;
  const {copyright, links = [], logo = {}} = footer || {};
  const logoUrl = useBaseUrl(logo.src);

  if (!footer) {
    return null;
  }

  return (
    <footer
      className={clsx('footer', {
        'footer--dark': footer.style === 'dark',
      })}
    >
      <div className="container">
        {links && links.length > 0 && (
          <div className="row footer__links">
            {links.map((linkItem, i) => (
              <div className="col footer__col" key={i}>
                {linkItem.title != null ? (
                  <h4 className="footer__title">{linkItem.title}</h4>
                ) : null}
                {linkItem.items != null &&
                Array.isArray(linkItem.items) &&
                linkItem.items.length > 0 ? (
                  <ul className="footer__items">
                    {linkItem.items.map((item, key) =>
                      item.html ? (
                        <li
                          className="footer__item"
                          dangerouslySetInnerHTML={{
                            __html: item.html,
                          }} // Developer provided the HTML, so assume it's safe.
                          // eslint-disable-next-line react/no-danger
                          key={key}
                        />
                      ) : (
                        <li className="footer__item" key={item.href || item.to}>
                          <FooterLink {...item} />
                        </li>
                      ),
                    )}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        )}
        {(logo || copyright) && (
          <div className="text--center">
            {logo && logo.src && (
              <div className="margin-bottom--sm">
                {logo.href ? (
                  <a
                    className={styles.footerLogoLink}
                    href={logo.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <FooterLogo alt={logo.alt} url={logoUrl} />
                  </a>
                ) : (
                  <FooterLogo alt={logo.alt} url={logoUrl} />
                )}
              </div>
            )}

            <div // Developer provided the HTML, so assume it's safe.
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: copyright,
              }}
            />
          </div>
        )}
      </div>
    </footer>
  );
}

FooterLink.propTypes= {
  alt:PropTypes.string,
  href:PropTypes.string,
  label:PropTypes.string,
  prependBaseUrlToHref:PropTypes.string,
  to:PropTypes.string,
  url:PropTypes.string,
}

FooterLogo.propTypes= {
  alt:PropTypes.string,
  url:PropTypes.string,
}

export default Footer;
