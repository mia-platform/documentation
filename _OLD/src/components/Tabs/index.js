/* eslint-disable react/prop-types */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {useState, Children, useEffect} from 'react';
import {useUserPreferencesContext} from '@docusaurus/theme-common';
import clsx from 'clsx';
import styles from './styles.module.css';
const keys = {
  left: 37,
  right: 39,
  tab: 9,
};

function Tabs(props) {
  const {block, children, defaultValue, values, groupId} = props;
  const {tabGroupChoices, setTabGroupChoices} = useUserPreferencesContext();
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [keyboardPress, setKeyboardPress] = useState(false);

  if (groupId != null) {
    const relevantTabGroupChoice = tabGroupChoices[groupId];

    if (
      relevantTabGroupChoice != null &&
      relevantTabGroupChoice !== selectedValue &&
      values.some((value) => value.value === relevantTabGroupChoice)
    ) {
      setSelectedValue(relevantTabGroupChoice);
    }
  }

  const changeSelectedValue = (newValue) => {
    setSelectedValue(newValue);

    if (groupId != null) {
      setTabGroupChoices(groupId, newValue);
    }
  };

  const tabRefs = [];

  const focusNextTab = (tabs, target) => {
    const next = tabs.indexOf(target) + 1;

    if (!tabs[next]) {
      tabs[0].focus();
    } else {
      tabs[next].focus();
    }
  };

  const focusPreviousTab = (tabs, target) => {
    const prev = tabs.indexOf(target) - 1;

    if (!tabs[prev]) {
      tabs[tabs.length - 1].focus();
    } else {
      tabs[prev].focus();
    }
  };

  const handleKeydown = (tabs, target, event) => {
    switch (event.keyCode) {
      case keys.right:
        focusNextTab(tabs, target);
        break;

      case keys.left:
        focusPreviousTab(tabs, target);
        break;

      default:
        break;
    }
  };

  const handleKeyboardEvent = (event) => {
    if (event.metaKey || event.altKey || event.ctrlKey) {
      return;
    }

    setKeyboardPress(true);
  };

  const handleMouseEvent = () => {
    setKeyboardPress(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardEvent);
    window.addEventListener('mousedown', handleMouseEvent);
  }, []);
  return (
    <div>
      <ul
        aria-orientation="horizontal"
        className={clsx('tabs', {
          'tabs--block': block,
        })}
        role="tablist"
      >
        {values.map(({value, label}) => (
          <li
            aria-selected={selectedValue === value}
            className={clsx('tabs__item', styles.tabItem, {
              'tabs__item--active': selectedValue === value,
            })}
            key={value}
            onClick={() => {
              changeSelectedValue(value);
              setKeyboardPress(false);
            }}
            onFocus={() => changeSelectedValue(value)}
            onKeyDown={(event) => {
              handleKeydown(tabRefs, event.target, event);
              handleKeyboardEvent(event);
            }}
            onPointerDown={() => setKeyboardPress(false)}
            ref={(tabControl) => tabRefs.push(tabControl)}
            role="tab"
            style={
              keyboardPress ?
                {} :
                {
                    outline: 'none',
                  }
            }
            tabIndex={0}
          >
            {label}
          </li>
        ))}
      </ul>
      <div className="margin-vert--md" role="tabpanel">
        {
          Children.toArray(children).filter(
            (child) => child.props.value === selectedValue,
          )[0]
        }
      </div>
    </div>
  );
}

export default Tabs;
