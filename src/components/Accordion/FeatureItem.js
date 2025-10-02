import React from 'react';
import styles from './featureItem.module.css';

// A default fallback icon component used when no specific icon is provided to FeatureItem.
const DefaultIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);


/**
 * A component that parses a string for markdown-style syntax and converts it
 * into the respective HTML tags (`<a>`, `<code>`, `<strong>`, `<em>`).
 * @param {object} props - The component props.
 * @param {string} props.text - The text content to parse.
 */
const MarkdownParser = ({text}) => {
  // Regular expression to find links, code, bold (**), and emphasis/italic (_).
  const markdownRegex = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|_([^_]+)_/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = markdownRegex.exec(text)) !== null) {
    // Destructure the match for all possible capture groups.
    const [fullMatch, linkText, url, codeText, strongText, emphasisText] = match;
    const matchIndex = match.index;

    // Add the plain text part that comes before the current match.
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    // Check which syntax was matched and create the correct React element.
    if (linkText && url) {
      parts.push(
        <a href={url} key={matchIndex} rel="noopener noreferrer" target="_blank">
          {linkText}
        </a>
      );
    } else if (codeText) {
      parts.push(<code key={matchIndex}>{codeText}</code>);
    } else if (strongText) {
      parts.push(<strong key={matchIndex}>{strongText}</strong>);
    } else if (emphasisText) {
      parts.push(<em key={matchIndex}>{emphasisText}</em>);
    }

    lastIndex = markdownRegex.lastIndex;
  }

  // Add any remaining plain text that follows the last match.
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
};


/**
 * Renders a single feature item with an icon, title, description, and optional metadata.
 * @param {object} props - The component props.
 * @param {React.ReactNode} [props.icon] - An optional icon component to display.
 * @param {string} props.title - The title of the feature.
 * @param {string} [props.quarter] - An optional quarter/release tag (e.g., "Q3 2025").
 * @param {string[]} props.description - An array of paragraphs for the description.
 * @param {string[]} [props.images] - An optional array of image URLs.
 * @param {string[]} [props.tags] - An optional array of string tags.
 */
export default function FeatureItem({icon, title, quarter, description, images, tags}) {
  // Use the provided icon prop, or fall back to the `DefaultIcon` if none is given.
  const IconComponent = icon || <DefaultIcon />;

  return (
    <div className={styles.itemContainer}>
      <div className={styles.iconWrapper}>
        {IconComponent}
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {/* Conditionally render the quarter badge if the `quarter` prop is provided. */}
          {quarter && <span className={styles.quarterBadge}>{quarter}</span>}
        </div>

        {/* Conditionally render a gallery of images if the `images` prop is provided and not empty. */}
        {images && images.length > 0 && (
          <div className={styles.imagesContainer}>
            {images.map((src, imgIndex) => (
              <img alt={`${title} screenshot ${imgIndex + 1}`} className={styles.itemImage} key={imgIndex} src={src} />
            ))}
          </div>
        )}

        <div className={styles.body}>
          <div className={styles.description}>
            {/* Map over each paragraph in the description array. */}
            {description.map((paragraph, pIndex) => (
              <p key={pIndex}>
                {/* Use MarkdownParser to transform any markdown syntax within the paragraph. */}
                <MarkdownParser text={paragraph} />
              </p>
            ))}
          </div>

          {/* Conditionally render a list of tags if the `tags` prop is provided and not empty. */}
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
