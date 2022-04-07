/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {useCallback, useState, useEffect} from 'react';
import clsx from 'clsx';
import SearchBar from '@theme/SearchBar';
import Toggle from '@theme/Toggle';
import useThemeContext from '@theme/hooks/useThemeContext';
import {useThemeConfig} from '@docusaurus/theme-common';
import useLockBodyScroll from '@theme/hooks/useLockBodyScroll';
import useWindowSize from '@theme/hooks/useWindowSize';
import NavbarItem from '@theme/NavbarItem';
import Logo from '@theme/Logo';
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

import styles from './styles.module.css'; // retrocompatible with v1
import {desktop} from "../../lib/constants";

const DefaultNavItemPosition = 'right'; // If split links by left/right
// if position is unspecified, fallback to right (as v1)

function splitNavItemsByPosition(items) {
  const leftItems = items.filter(
    (item) => (item.position ?? DefaultNavItemPosition) === 'left',
  );
  const rightItems = items.filter(
    (item) => (item.position ?? DefaultNavItemPosition) === 'right',
  );
  return {
    leftItems,
    rightItems,
  };
}

const getSearchBar = function (setIsSearchBarExpanded,isSearchBarExpanded) {
  const location = ExecutionEnvironment.canUseDOM ? window.location.href : null;

  // Hide Searchbar if we are in the homepage
  if (location && !location.match(/docs\//g)) return null;
  return (
    <SearchBar
      handleSearchBarToggle={setIsSearchBarExpanded}
      isSearchBarExpanded={isSearchBarExpanded}
    />
  );
};

function Navbar() {
  const {
    navbar: {items, hideOnScroll, style},
    colorMode: {disableSwitch: disableColorModeSwitch},
  } = useThemeConfig();

  const [sidebarShown, setSidebarShown] = useState(false);
  const [isSearchBarExpanded, setIsSearchBarExpanded] = useState(false);
  const {isDarkTheme, setLightTheme, setDarkTheme} = useThemeContext();
  
  useLockBodyScroll(sidebarShown);
  const showSidebar = useCallback(() => {
    setSidebarShown(true);
  }, [setSidebarShown]);
  const hideSidebar = useCallback(() => {
    setSidebarShown(false);
  }, [setSidebarShown]);
  const onToggleChange = useCallback(
    (e) => (e.target.checked ? setDarkTheme() : setLightTheme()),
    [setLightTheme, setDarkTheme],
  );
  const windowSize = useWindowSize();
  useEffect(() => {
    if (windowSize === desktop) {
      setSidebarShown(false);
    }
  }, [windowSize]);
  const {leftItems, rightItems} = splitNavItemsByPosition(items);

  return (
    <nav
      className={clsx('navbar', 'navbar--fixed-top', {
        'navbar--dark': style === 'dark',
        'navbar--primary': style === 'primary',
        'navbar-sidebar--show': sidebarShown,
        [styles.navbarHideable]: hideOnScroll
      })}
    >
      <div className="navbar__inner">
        <div className="navbar__items">
          {items != null && items.length !== 0 && (
            <div
              aria-label="Navigation bar toggle"
              className="navbar__toggle"
              onClick={showSidebar}
              onKeyDown={showSidebar}
              role="button"
              tabIndex={0}
            >
              <svg
                focusable="false"
                height="30"
                role="img"
                viewBox="0 0 30 30"
                width="30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>{'Menu'}</title>
                <path
                  d="M4 7h22M4 15h22M4 23h22"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                />
              </svg>
            </div>
          )}
          <Logo
            className="navbar__brand"
            imageClassName="navbar__logo"
            titleClassName={clsx('navbar__title', {
              [styles.hideLogoText]: true || isSearchBarExpanded,
            })}
          />
          {leftItems.map((item, i) => (
            <NavbarItem {...item} key={i} />
          ))}
        </div>
        <div className="navbar__items navbar__items--right">
          {rightItems.map((item, i) => (
            <NavbarItem {...item} key={i} />
          ))}
          {!disableColorModeSwitch && (
            <Toggle
              aria-label="Dark mode toggle"
              checked={isDarkTheme}
              className={styles.displayOnlyInLargeViewport}
              onChange={onToggleChange}
            />
          )}
          {getSearchBar(setIsSearchBarExpanded, isSearchBarExpanded)}
        </div>
      </div>
      <div
        className="navbar-sidebar__backdrop"
        onClick={hideSidebar}
        role="presentation"
      />
      <div className="navbar-sidebar">
        <div className="navbar-sidebar__brand">
          <Logo
            className="navbar__brand"
            imageClassName="navbar__logo"
            onClick={hideSidebar}
            titleClassName="navbar__title"
          />
          {!disableColorModeSwitch && sidebarShown && (
            <Toggle
              aria-label="Dark mode toggle in sidebar"
              checked={isDarkTheme}
              onChange={onToggleChange}
            />
          )}
        </div>
        <div className="navbar-sidebar__items">
          <div className="menu">
            <ul className="menu__list">
              {items.map((item, i) => (
                <NavbarItem mobile {...item} key={i} onClick={hideSidebar} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
