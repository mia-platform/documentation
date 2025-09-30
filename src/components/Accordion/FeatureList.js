import React from 'react';
import styles from './featureList.module.css';

// --- Internal SVG Icon Components ---
// These are stateless functional components used to render icons for each section header.
const NewFeatureIcon = () => (
  <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(-1065 -23)">
      <path d="M1072.45 24.9341C1072.28 24.7584 1072.06 24.6299 1071.82 24.5604C1071.58 24.491 1071.33 24.4829 1071.09 24.5368C1070.84 24.5907 1070.62 24.7049 1070.43 24.8689C1070.24 25.0328 1070.1 25.2413 1070.01 25.475L1065.09 39.0106C1065.01 39.2338 1064.99 39.4732 1065.02 39.7086C1065.05 39.944 1065.14 40.1685 1065.27 40.3634C1065.41 40.5583 1065.59 40.7178 1065.8 40.8286C1066.01 40.9394 1066.24 40.9981 1066.48 41C1066.65 40.9988 1066.83 40.9671 1066.99 40.9062L1080.52 35.9844C1080.76 35.8992 1080.97 35.7565 1081.13 35.5694C1081.29 35.3824 1081.41 35.157 1081.46 34.9141C1081.52 34.6712 1081.51 34.4186 1081.44 34.1797C1081.37 33.9407 1081.24 33.7231 1081.07 33.5469L1072.45 24.9341ZM1071.67 37.61L1068.39 34.3287L1069.62 30.9341L1075.07 36.3762L1071.67 37.61ZM1066.51 39.485L1067.83 35.8841L1070.12 38.1763L1066.51 39.485ZM1076.62 35.81L1070.19 29.375L1071.41 26.0122L1079.98 34.5837L1076.62 35.81ZM1077 26.75C1077.01 26.243 1077.14 25.7449 1077.36 25.2894C1077.86 24.2966 1078.79 23.75 1080 23.75C1080.63 23.75 1081.03 23.5353 1081.28 23.0741C1081.41 22.816 1081.49 22.5333 1081.5 22.2444C1081.5 22.0455 1081.58 21.855 1081.72 21.7149C1081.86 21.5747 1082.05 21.4964 1082.25 21.4972C1082.45 21.4979 1082.64 21.5777 1082.78 21.7188C1082.92 21.86 1083 22.0511 1083 22.25C1083 23.4556 1082.2 25.25 1080 25.25C1079.37 25.25 1078.97 25.4647 1078.72 25.9259C1078.59 26.184 1078.51 26.4667 1078.5 26.7556C1078.5 26.8541 1078.48 26.9516 1078.44 27.0424C1078.4 27.1333 1078.35 27.2157 1078.28 27.2851C1078.21 27.3545 1078.13 27.4094 1078.03 27.4468C1077.94 27.4841 1077.85 27.5032 1077.75 27.5028C1077.65 27.5024 1077.55 27.4827 1077.46 27.4446C1077.37 27.4066 1077.29 27.3511 1077.22 27.2812C1077.15 27.2112 1077.09 27.1284 1077.06 27.0372C1077.02 26.9461 1077 26.8485 1077 26.75ZM1074.75 23.75V21.5C1074.75 21.3011 1074.83 21.1103 1074.97 20.9697C1075.11 20.829 1075.3 20.75 1075.5 20.75C1075.7 20.75 1075.89 20.829 1076.03 20.9697C1076.17 21.1103 1076.25 21.3011 1076.25 21.5V23.75C1076.25 23.9489 1076.17 24.1397 1076.03 24.2803C1075.89 24.421 1075.7 24.5 1075.5 24.5C1075.3 24.5 1075.11 24.421 1074.97 24.2803C1074.83 24.1397 1074.75 23.9489 1074.75 23.75ZM1084.28 31.4694C1084.35 31.5391 1084.41 31.6218 1084.44 31.7128C1084.48 31.8038 1084.5 31.9014 1084.5 31.9999C1084.5 32.0984 1084.48 32.1959 1084.44 32.2869C1084.4 32.3779 1084.35 32.4605 1084.28 32.5302C1084.21 32.5998 1084.13 32.655 1084.04 32.6926C1083.95 32.7303 1083.85 32.7497 1083.75 32.7496C1083.65 32.7496 1083.55 32.7301 1083.46 32.6924C1083.37 32.6547 1083.29 32.5994 1083.22 32.5297L1081.72 31.0297C1081.58 30.889 1081.5 30.6981 1081.5 30.4991C1081.5 30.3 1081.58 30.1092 1081.72 29.9684C1081.86 29.8277 1082.05 29.7486 1082.25 29.7486C1082.45 29.7486 1082.64 29.8277 1082.78 29.9684L1084.28 31.4694ZM1084.74 27.4616L1082.49 28.2116C1082.3 28.2745 1082.09 28.2598 1081.91 28.1709C1081.74 28.0819 1081.6 27.9259 1081.54 27.7372C1081.48 27.5485 1081.49 27.3425 1081.58 27.1646C1081.67 26.9866 1081.82 26.8513 1082.01 26.7884L1084.26 26.0384C1084.45 25.9755 1084.66 25.9902 1084.84 26.0791C1085.01 26.1681 1085.15 26.3241 1085.21 26.5128C1085.27 26.7015 1085.26 26.9075 1085.17 27.0854C1085.08 27.2634 1084.93 27.3987 1084.74 27.4616Z" fill="currentColor"/>
    </g>
  </svg>
);
const ImprovementIcon = () => (
  <svg viewBox="1064 438 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M1074 438.25C1072.07 438.25 1070.19 438.822 1068.58 439.893C1066.98 440.965 1065.73 442.487 1064.99 444.269C1064.25 446.05 1064.06 448.011 1064.44 449.902C1064.81 451.793 1065.74 453.531 1067.11 454.894C1068.47 456.258 1070.21 457.186 1072.1 457.563C1073.99 457.939 1075.95 457.746 1077.73 457.008C1079.51 456.27 1081.04 455.02 1082.11 453.417C1083.18 451.813 1083.75 449.928 1083.75 448C1083.75 445.415 1082.72 442.937 1080.89 441.109C1079.06 439.281 1076.59 438.253 1074 438.25ZM1074 456.25C1072.37 456.25 1070.77 455.766 1069.42 454.86C1068.06 453.953 1067 452.665 1066.38 451.157C1065.75 449.65 1065.59 447.991 1065.91 446.391C1066.23 444.79 1067.01 443.32 1068.17 442.166C1069.32 441.013 1070.79 440.227 1072.39 439.909C1073.99 439.59 1075.65 439.754 1077.16 440.378C1078.66 441.002 1079.95 442.06 1080.86 443.417C1081.77 444.773 1082.25 446.368 1082.25 448C1082.25 450.187 1081.38 452.284 1079.83 453.831C1078.28 455.378 1076.19 456.248 1074 456.25ZM1077.53 446.719C1077.6 446.789 1077.66 446.872 1077.69 446.963C1077.73 447.054 1077.75 447.151 1077.75 447.25C1077.75 447.349 1077.73 447.446 1077.69 447.537C1077.66 447.628 1077.6 447.711 1077.53 447.781C1077.46 447.85 1077.38 447.906 1077.29 447.943C1077.2 447.981 1077.1 448 1077 448C1076.9 448 1076.8 447.981 1076.71 447.943C1076.62 447.906 1076.54 447.85 1076.47 447.781L1074.75 446.06V451.75C1074.75 451.949 1074.67 452.14 1074.53 452.28C1074.39 452.421 1074.2 452.5 1074 452.5C1073.8 452.5 1073.61 452.421 1073.47 452.28C1073.33 452.14 1073.25 451.949 1073.25 451.75V446.06L1071.53 447.781C1071.39 447.921 1071.2 448 1071 448C1070.8 448 1070.61 447.921 1070.47 447.781C1070.33 447.64 1070.25 447.449 1070.25 447.25C1070.25 447.051 1070.33 446.86 1070.47 446.719L1073.47 443.719C1073.54 443.65 1073.62 443.594 1073.71 443.557C1073.8 443.519 1073.9 443.499 1074 443.499C1074.1 443.499 1074.2 443.519 1074.29 443.557C1074.38 443.594 1074.46 443.65 1074.53 443.719L1077.53 446.719Z" fill="currentColor" />
  </svg>
);
const BugFixIcon = () => (
  <svg viewBox="1062 854 24 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M1075.5 860.625C1075.5 860.403 1075.57 860.185 1075.69 860C1075.81 859.815 1075.99 859.671 1076.19 859.586C1076.4 859.501 1076.63 859.479 1076.84 859.522C1077.06 859.566 1077.26 859.673 1077.42 859.83C1077.58 859.987 1077.68 860.188 1077.73 860.406C1077.77 860.624 1077.75 860.85 1077.66 861.056C1077.58 861.262 1077.44 861.437 1077.25 861.561C1077.07 861.685 1076.85 861.75 1076.62 861.75C1076.33 861.75 1076.04 861.632 1075.83 861.421C1075.62 861.21 1075.5 860.924 1075.5 860.625ZM1071.38 859.5C1071.15 859.5 1070.93 859.566 1070.75 859.69C1070.56 859.814 1070.42 859.989 1070.34 860.195C1070.25 860.401 1070.23 860.627 1070.27 860.845C1070.32 861.063 1070.42 861.264 1070.58 861.421C1070.74 861.578 1070.94 861.685 1071.16 861.729C1071.37 861.772 1071.6 861.75 1071.81 861.665C1072.01 861.58 1072.19 861.436 1072.31 861.251C1072.43 861.065 1072.5 860.848 1072.5 860.625C1072.5 860.327 1072.38 860.041 1072.17 859.83C1071.96 859.619 1071.67 859.5 1071.38 859.5ZM1082.25 865.5C1082.25 866.229 1082.16 866.954 1081.97 867.657L1084.05 868.568C1084.21 868.639 1084.34 868.76 1084.41 868.913C1084.49 869.065 1084.51 869.239 1084.48 869.406C1084.44 869.573 1084.35 869.723 1084.22 869.831C1084.09 869.939 1083.92 869.999 1083.75 870C1083.65 870.001 1083.54 869.979 1083.45 869.938L1081.44 869.063C1080.77 870.467 1079.71 871.652 1078.4 872.482C1077.08 873.312 1075.56 873.752 1074 873.752C1072.44 873.752 1070.92 873.312 1069.6 872.482C1068.29 871.652 1067.23 870.467 1066.56 869.063L1064.55 869.938C1064.46 869.979 1064.35 870.001 1064.25 870C1064.08 870 1063.91 869.941 1063.78 869.832C1063.64 869.724 1063.55 869.572 1063.52 869.404C1063.48 869.235 1063.5 869.06 1063.58 868.907C1063.66 868.753 1063.79 868.632 1063.95 868.563L1066.03 867.657C1065.84 866.954 1065.75 866.229 1065.75 865.5V864.75H1063.5C1063.3 864.75 1063.11 864.671 1062.97 864.531C1062.83 864.39 1062.75 864.199 1062.75 864C1062.75 863.802 1062.83 863.611 1062.97 863.47C1063.11 863.33 1063.3 863.25 1063.5 863.25H1065.75V862.5C1065.75 861.772 1065.84 861.047 1066.03 860.344L1063.95 859.438C1063.86 859.4 1063.77 859.344 1063.7 859.273C1063.63 859.202 1063.58 859.118 1063.54 859.025C1063.5 858.933 1063.48 858.834 1063.48 858.734C1063.49 858.634 1063.51 858.535 1063.55 858.444C1063.59 858.352 1063.65 858.27 1063.72 858.201C1063.79 858.132 1063.88 858.078 1063.97 858.043C1064.06 858.007 1064.16 857.991 1064.26 857.994C1064.36 857.998 1064.46 858.021 1064.55 858.063L1066.56 858.938C1067.23 857.534 1068.29 856.349 1069.6 855.519C1070.92 854.689 1072.44 854.249 1074 854.249C1075.56 854.249 1077.08 854.689 1078.4 855.519C1079.71 856.349 1080.77 857.534 1081.44 858.938L1083.45 858.06C1083.63 857.986 1083.83 857.986 1084.02 858.059C1084.2 858.133 1084.34 858.275 1084.42 858.454C1084.5 858.634 1084.51 858.837 1084.44 859.02C1084.37 859.204 1084.23 859.352 1084.05 859.435L1081.97 860.349C1082.16 861.052 1082.25 861.777 1082.25 862.505V863.255H1084.5C1084.7 863.255 1084.89 863.334 1085.03 863.475C1085.17 863.615 1085.25 863.806 1085.25 864.005C1085.25 864.204 1085.17 864.395 1085.03 864.536C1084.89 864.676 1084.7 864.755 1084.5 864.755H1082.25V865.5ZM1067.25 863.25H1080.75V862.5C1080.75 860.71 1080.04 858.993 1078.77 857.728C1077.51 856.462 1075.79 855.75 1074 855.75C1072.21 855.75 1070.49 856.462 1069.23 857.728C1067.96 858.993 1067.25 860.71 1067.25 862.5V863.25ZM1073.25 872.207V864.75H1067.25V865.5C1067.25 867.16 1067.86 868.761 1068.97 869.998C1070.08 871.235 1071.6 872.021 1073.25 872.207ZM1080.75 865.5V864.75H1074.75V872.207C1076.4 872.021 1077.92 871.235 1079.03 869.998C1080.14 868.761 1080.75 867.16 1080.75 865.5Z" fill="currentColor" />
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
      if(url.startsWith("http")) {
        parts.push(
          <a href={url} key={matchIndex} rel="noopener noreferrer" target="_blank">
            {linkText}
          </a>
        );
      } else {
        parts.push(
          <a href={url} key={matchIndex} target="_self">
            {linkText}
          </a>
        )
      }
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
 * Renders categorized lists for new features, improvements, and bug fixes.
 * @param {object} props - The component props.
 * @param {Array<object>} [props.newFeatures] - Array of new feature objects, each with title, description, etc.
 * @param {Array<object>} [props.improvements] - Array of improvement objects, structured like new features.
 * @param {Array<string>} [props.bugFixes] - Array of simple strings describing each bug fix.
 */
export default function FeatureList({newFeatures, improvements, bugFixes}) {

  /**
   * A local helper function to render a list of complex items (features or improvements).
   * It handles items that are objects containing a title, a description array, and optional images.
   * @param {Array<object>} items - The array of feature/improvement objects to render.
   */
  const renderFeatureList = (items) => {
    return items.map((item, index) => (
      <div className={styles.item} key={index}>
        <h3 className={styles.itemTitle}>{item.title}</h3>

        {/* Conditionally render a gallery of images if the item has them. */}
        {item.images && item.images.length > 0 && (
          <div className={styles.imagesContainer}>
            {item.images.map((src, imgIndex) => (
              <img alt={`${item.title} screenshot ${imgIndex + 1}`} className={styles.itemImage} key={imgIndex} src={src} />
            ))}
          </div>
        )}

        {/* The item's description is an array of strings, each rendered as a separate paragraph. */}
        <div className={styles.itemDescription}>
          {item.description.map((paragraph, pIndex) => (
            <p key={pIndex}>
              {/* Use the Markdown Parser to transform any markdown links and code within the paragraph. */}
              <MarkdownParser text={paragraph} />
            </p>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      {/* New Features Section */}
      {/* This section is rendered only if the `newFeatures` array exists and is not empty. */}
      {newFeatures && newFeatures.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <NewFeatureIcon />
            </span>
            {`New Features`}
          </h2>
          <div className={styles.sectionContent}>
            {/* Use the helper function to render the list of new feature items. */}
            {renderFeatureList(newFeatures)}
          </div>
        </section>
      )}

      {/* Improvements Section */}
      {/* This section is rendered only if the `improvements` array exists and is not empty. */}
      {improvements && improvements.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <ImprovementIcon />
            </span>
            {`Improvements`}
          </h2>
          <div className={styles.sectionContent}>
            {/* Use the same helper function to render the list of improvement items. */}
            {renderFeatureList(improvements)}
          </div>
        </section>
      )}

      {/* Bug Fixes Section */}
      {/* This section is rendered only if the `bugFixes` array exists and is not empty. */}
      {bugFixes && bugFixes.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <BugFixIcon />
            </span>
            {`Bug fixes`}
          </h2>
          <div className={styles.sectionContent}>
            {/* Bug fixes are treated as simple strings and rendered in a `<ul>` list, unlike the other sections. */}
            <ul className={styles.bugList}>
              {bugFixes.map((bug, index) => (
                <li key={index}>
                  <MarkdownParser text={bug} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
