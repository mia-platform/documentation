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
 * A component that parses a string for markdown-style links `[text](url)`
 * and backticked code ``code``, converting them into HTML `<a>` and `<code>` tags.
 * @param {object} props - The component props.
 * @param {string} props.text - The text content to parse.
 */
const MarkdownParser = ({text}) => {
  // Regular expression to find all instances of markdown-style links OR backticked code.
  const markdownRegex = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  // Iterate over all matches of the regex in the input text.
  while ((match = markdownRegex.exec(text)) !== null) {
    // Destructure the match. Depending on what was matched, some groups will be `undefined`.
    // match[1] and match[2] are for links.
    // match[3] is for code.
    const [fullMatch, linkText, url, codeText] = match;
    const matchIndex = match.index;

    // Add the plain text part that comes before the current match.
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    // Check if a link was matched.
    if (linkText && url) {
      parts.push(
        <a href={url} key={matchIndex} rel="noopener noreferrer" target="_blank">
          {linkText}
        </a>
      );
      // Otherwise, check if a code block was matched.
    } else if (codeText) {
      parts.push(
        <code key={matchIndex}>
          {codeText}
        </code>
      );
    }

    // Update the index to continue searching from the end of the current match.
    lastIndex = markdownRegex.lastIndex;
  }

  // Add any remaining plain text that follows the last match.
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // Return the combined array of strings and React elements to be rendered.
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
