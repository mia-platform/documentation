import React,{useState,useEffect,} from "react";
import clsx from "clsx";
import PropTypes from 'prop-types'
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import useWindowSize from "@theme/hooks/useWindowSize";

import styles from "./styles.module.css";
import {desktop} from "../../lib/constants";

const STORAGE_VERSION_BANNER_DISMISS_KEY = 'custom.versionBanner{{majorVersion}}.dismiss';

const getContent=(isDesktop,title,subtitle) => {
  return (
    <>
      {isDesktop &&
      <div className={styles.imgBox}>
        <img src="/img/tuna-logo.png"/>
      </div>}
      <div className={styles.titlesBox}>
          <span className={styles.title}>{title}</span>
          <span className={styles.subTitle}>{subtitle}</span>
      </div>
    </>
  )
}

function VersionBanner(props) {
  const {title,subTitle,link,majorVersion}=props

  const windowSize = useWindowSize();

  // Props version allows to read/set a new local storage key when a new version is release
  const dismissKey=STORAGE_VERSION_BANNER_DISMISS_KEY.replace('{{majorVersion}}',majorVersion);

  const dismissVersionBannerKeyValue = ExecutionEnvironment.canUseDOM ? localStorage.getItem(dismissKey) : false;

  const [shown, setShown] = useState(!dismissVersionBannerKeyValue)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsDesktop(windowSize === desktop);
  }, [windowSize]);

  if(!shown)
   return null;

  const closeBtnSpanContent='x'

  return (
    <div className={clsx("col col--12", styles.versionBanner)}>
      {
        link ? (<a className={styles.versionBannerLink} href={link}><div className={styles.mainBox}>{getContent(isDesktop,title,subTitle)}</div></a>) : (getContent(isDesktop,title,subTitle))
      }
      <div className={styles.closeBtnBox}>
        <div
          className={styles.closeBtn}
          onClick={() => {
            localStorage.setItem(dismissKey, 'true')
            setShown(false)
          }}
        >
        <span aria-hidden="true">{closeBtnSpanContent}</span>
      </div>
      </div>
    </div>
  )
}

VersionBanner.propTypes = {
  link: PropTypes.string,
  // It's must be a string like 8,7,6...
  majorVersion: PropTypes.string,
  subTitle:PropTypes.string,
  title:PropTypes.string,
}

export default VersionBanner;
