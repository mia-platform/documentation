import React from 'react';
import styles from './featureItem.module.css';

const DefaultIcon = () => (
    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
);

const LinkParser = ({text}) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    const [fullMatch, linkText, url] = match;
    const matchIndex = match.index;

    // Aggiunge il testo prima del link
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    // Aggiunge il link come elemento React
    parts.push(
      <a href={url} key={matchIndex} rel="noopener noreferrer" target="_blank">
        {linkText}
      </a>
    );

    lastIndex = linkRegex.lastIndex;
  }

  // Aggiunge il testo rimanente dopo l'ultimo link
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
};

export default function FeatureItem({icon, title, quarter, description, images, tags}) {
    console.log(description)
    const IconComponent = icon || <DefaultIcon />;

    return (
        <div className={styles.itemContainer}>
            <div className={styles.iconWrapper}>
                {IconComponent}
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    {quarter && <span className={styles.quarterBadge}>{quarter}</span>}
                </div>
                {images && images.length > 0 && (
                  <div className={styles.imagesContainer}>
                    {images.map((src, imgIndex) => (
                      <img alt={`${title} screenshot ${imgIndex + 1}`} className={styles.itemImage} key={imgIndex} src={src} />
                    ))}
                  </div>
                )}
                <div className={styles.body}>
                    <p className={styles.description}>
                      {description.map((paragraph, pIndex) => (
                        <p key={pIndex}>
                          <LinkParser text={paragraph} />
                        </p>
                      ))}
                    </p>
                    {tags && tags.length > 0 && (
                        <div className={styles.tagsContainer}>
                            {tags.map((tag, index) => (
                                <span className={styles.tag} key={index}>{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
