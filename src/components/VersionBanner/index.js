import React, {useState, useEffect, useCallback, useMemo} from "react"
import PropTypes from 'prop-types'
import clsx from "clsx"
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment"
import {useWindowSize} from "@docusaurus/theme-common"

import styles from "./styles.module.css"
import {desktop} from "../../lib/constants"

const STORAGE_VERSION_BANNER_DISMISS_KEY = 'custom.versionBanner{{majorVersion}}.dismiss'

const BannerContent = ({isDesktop, title, subtitle}) => {
  return (
    <>
      {/* {
        isDesktop &&
          <div className={styles.imgBox}>
            <img src="/img/tuna-logo.png"/>
          </div>
      } */}
      <div className={styles.titlesBox}>
          <span className={styles.title}>{title}</span>
          <span className={styles.subTitle}>{subtitle}</span>
      </div>
    </>
  )
}
BannerContent.propTypes = {
  isDesktop: PropTypes.bool,
  subtitle: PropTypes.string,
  title: PropTypes.string,
}

function VersionBanner({title, subTitle, link, majorVersion}) {
  // Props version allows to read/set a new local storage key when a new version is release
  const dismissKey = STORAGE_VERSION_BANNER_DISMISS_KEY.replace('{{majorVersion}}', majorVersion)
  const dismissVersionBannerKeyValue = ExecutionEnvironment.canUseDOM ? !!localStorage.getItem(dismissKey) : false
  const [shown, setShown] = useState(!dismissVersionBannerKeyValue)

  const windowSize = useWindowSize()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => setIsDesktop(windowSize === desktop), [windowSize])

  const onDismissClick = useCallback(() => {
    localStorage.setItem(dismissKey, 'true')
    setShown(false)
  }, [dismissKey, setShown])

  const bannerContent = useMemo(() => <BannerContent isDesktop={isDesktop} subtitle={subTitle} title={title}/>, [isDesktop, subTitle, title])

  return !shown ? null : (
    <div className={clsx("col col--12", styles.versionBanner)}>
      {
        link ? (
          <a className={styles.versionBannerLink} href={link}>
            <div className={styles.mainBox}> {bannerContent} </div>
          </a>
        ) : bannerContent
      }
      <div className={styles.closeBtnBox}>
        <div className={styles.closeBtn} onClick={onDismissClick}>
          <span aria-hidden="true">{'x'}</span>
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

export default VersionBanner
