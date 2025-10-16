// src/components/Changelog/index.js
import React from 'react';
import styles from './styles.module.css';

export default function Changelog({children}) {
  return (
    <div className={`${styles.changelogContainer} changelog-wrapper`}>
      {children}
    </div>
  );
}
