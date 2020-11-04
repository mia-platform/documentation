/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useRef, useCallback, useState, useEffect} from "react";
import classnames from "classnames";
import PropTypes from 'prop-types'
import {useHistory, useLocation} from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useVersioning from "@theme/hooks/useVersioning";

const determineDocsVersionFromURL = (
  path,
  versionPathRegex
) => {
  if (versionPathRegex) {
    const matchedVersion = path.match(new RegExp(`^\\/${versionPathRegex}`));
    return !!matchedVersion && matchedVersion.length ? matchedVersion[1] : "current";
  }
};

const Search = props => {
  const initialized = useRef(false);
  const searchBarRef = useRef(null);
  const history = useHistory();
  const {siteConfig = {}} = useDocusaurusContext();
  const {versionPathRegex} = siteConfig.customFields;
  const {baseUrl} = siteConfig;
  const {versioningEnabled} = useVersioning();
  const [currentVersion, setCurrentVersion] = useState(null);
  const location = useLocation();

  // Update versionToSearch based on the URL
  useEffect(() => {
    if (!versioningEnabled) {
      return null;
    }
    // We cannot simply query for the meta tag that specifies the version,
    // because the tag is updated AFTER this effect runs and there is no
    // hook/callback available that runs after the meta tag changes.
    setCurrentVersion(determineDocsVersionFromURL(location.pathname, versionPathRegex));
  }, [location, baseUrl]);


  const initAlgolia = (searchDocs, searchIndex, DocSearch, versionWhereSearch) => {
    new DocSearch({
      searchDocs,
      searchIndex,
      inputSelector: "#search_input_react",
      // Override algolia's default selection event, allowing us to do client-side
      // navigation and avoiding a full page refresh.
      handleSelected: (_input, _event, suggestion) => {
        const url = baseUrl + suggestion.url;
        // Use an anchor tag to parse the absolute url into a relative url
        // Alternatively, we can use new URL(suggestion.url) but its not supported in IE
        const a = document.createElement("a");
        a.href = url;
        // Algolia use closest parent element id #__docusaurus when a h1 page title does not have an id
        // So, we can safely remove it. See https://github.com/facebook/docusaurus/issues/1828 for more details.

        history.push(url);
      },
      versionWhereSearch: versionWhereSearch ? [versionWhereSearch] : null,
    });
  };

  const getSearchDoc = () =>
    process.env.NODE_ENV === "production" ?
      fetch(`${baseUrl}search-doc.json`).then((content) => content.json()) :
      Promise.resolve([]);

  const getLunrIndex = () =>
    process.env.NODE_ENV === "production" ?
      fetch(`${baseUrl}lunr-index.json`).then((content) => content.json()) :
      Promise.resolve([]);

  const loadAlgolia = () => {
    if (!initialized.current) {
      Promise.all([
        getSearchDoc(),
        getLunrIndex(),
        import("./lib/DocSearch"),
        import("./algolia.css")
      ]).then(([searchDocs, searchIndex, {default: DocSearch}]) => {
        initAlgolia(searchDocs, searchIndex, DocSearch, currentVersion);
      });
      initialized.current = true;
    }
  };

  const toggleSearchIconClick = useCallback(
    e => {
      if (!searchBarRef.current.contains(e.target)) {
        searchBarRef.current.focus();
      }

      props.handleSearchBarToggle(!props.isSearchBarExpanded);
    },
    [props.isSearchBarExpanded]
  );

  return (
    <div
      className={classnames("navbar__search", {
        "navbar-search-home": props.searchBarInHome,
        "navbar-big": props.searchBarInHome,
      })}
      key="search-box"
    >
      <span
        aria-label="expand searchbar"
        className={classnames("search-icon", {
          "search-icon-hidden": props.isSearchBarExpanded
        })}
        onClick={toggleSearchIconClick}
        onKeyDown={toggleSearchIconClick}
        role="button"
        tabIndex={0}
      />
      <input
        aria-label="Search"
        className={classnames(
          "navbar__search-input",
          {"search-bar-expanded": props.isSearchBarExpanded},
          {"search-bar": !props.isSearchBarExpanded}
        )}
        id="search_input_react"
        onBlur={toggleSearchIconClick}
        onClick={loadAlgolia}
        onFocus={toggleSearchIconClick}
        onMouseOver={loadAlgolia}
        placeholder={props.placeholder || "Search"}
        ref={searchBarRef}
        type="search"
      />
    </div>
  );
};

Search.propTypes= {
  handleSearchBarToggle:PropTypes.func,
  isSearchBarExpanded:PropTypes.bool,
  placeholder:PropTypes.string,
  searchBarInHome:PropTypes.bool,
}

export default Search;
