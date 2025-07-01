import React from 'react';
import PropTypes from "prop-types";
import SearchBar from "@theme/SearchBar";
import './HomePageComponent.css';

/**
 * A reusable link component.
 */
const CustomLink = ({children, className, href, style, target}) => (
    <a className={`custom-link ${className || ''}`} href={href} style={style} target={target}>
        {children}
    </a>
);

CustomLink.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    href: PropTypes.string.isRequired,
    style: PropTypes.object,
    target: PropTypes.string.isRequired
};

/**
 * Renders the main hero section of the page.
 */
const HomepageHeader = ({data}) => (
    <header className="homepage-header" style={{backgroundImage: `url(${data.backgroundImageUrl})`}}>
        <div className="container hero-container">
            <div className="hero-branding">
                <img alt="Mia Platform Logo" className="hero-logo" src={data.logoUrl}/>
                <h1 className="hero-title">{data.title}</h1>
            </div>
            <p className="hero-subtitle">{data.subtitle}</p>
            <p className="hero-description">{data.description}</p>
            <div className="hero-search-bar-container">
                <div className="hero-search-bar-wrapper">
                    <SearchBar
                        avoidKeyboardShortcuts
                        customStyle={{
                            height: '32px',
                            maxWidth: '90%',
                            width: '380px',
                        }}
                    />
                </div>
            </div>
        </div>
    </header>
);

HomepageHeader.propTypes = {
    data: PropTypes.shape({
        backgroundImageUrl: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        logoUrl: PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
};

/**
 * Displays an announcement banner.
 */
const AnnouncementBanner = ({data}) => (
    <div className="section announcement-section">
        <div className="container">
            <div className="announcement-banner">
                <div className="announcement-content">
                    <h2 className="announcement-title">{data.title}</h2>
                    <p className="announcement-description">{data.description}</p>
                </div>
                <div className="announcement-buttons">
                    {data.buttons.map(button => (
                        <CustomLink href={button.link} key={button.label} target={button.target}>
                            <button className={`announcement-button ${button.primary ? 'primary' : 'secondary'}`}>
                                {button.label}
                            </button>
                        </CustomLink>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

AnnouncementBanner.propTypes = {
    data: PropTypes.shape({
        buttons: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired,
            primary: PropTypes.bool,
        })).isRequired,
        description: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
};

/**
 * A responsive grid of feature cards.
 */
const FeatureGrid = ({features}) => (
    <section className="section feature-grid-section">
        <div className="container">
            <div className="feature-grid">
                {features.map((feature) => {
                    if (feature.type === 'image') {
                        return (
                            <CustomLink className="feature-card-link" href={feature.link} key={feature.title} target={feature.target}>
                                <div className="card-container image-card" style={{backgroundImage: `linear-gradient(rgba(0,0,100,0.4), rgba(0,0,0,0.4)), url(${feature.backgroundImage})`}}>
                                    <div className="card-content">
                                        <h3 className="image-card-title">{feature.title}</h3>
                                        <p className="image-card-description">{feature.description}</p>
                                    </div>
                                </div>
                            </CustomLink>
                        );
                    }
                    return (
                        <CustomLink className="feature-card-link" href={feature.link} key={feature.title} target={feature.target}>
                            <div className="card-container feature-card">
                                <div className="feature-card-icon-wrapper">
                                    <img alt={feature.title} className="feature-card-icon" src={feature.icon}/>
                                </div>
                                <div className="card-content">
                                    <h3 className="feature-card-title">{feature.title}</h3>
                                    <p className="feature-card-description">{feature.description}</p>
                                </div>
                            </div>
                        </CustomLink>
                    );
                })}
            </div>
        </div>
    </section>
);

FeatureGrid.propTypes = {
    features: PropTypes.arrayOf(PropTypes.shape({
        backgroundImage: PropTypes.string,
        description: PropTypes.string.isRequired,
        icon: PropTypes.string,
        link: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        type: PropTypes.string,
    })).isRequired,
};

/**
 * A section designed to guide new users.
 */
const BeginnersSection = ({data}) => (
    <section className="section beginners-section">
        <div className="container">
            <div className="beginners-grid">
                <div className="beginners-content">
                    <h2 className="beginners-title">{data.title}</h2>
                    <p className="beginners-description">
                        {data.description}
                        <br/>
                        {data.subtitle}
                    </p>
                </div>
                <div className="beginners-image-container" style={{backgroundImage: `url(${data.imageUrl})`}}>
                    <div className="beginners-image-gradient"></div>
                </div>
            </div>
        </div>
    </section>
);

BeginnersSection.propTypes = {
    data: PropTypes.shape({
        description: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired,
        link: PropTypes.shape({url: PropTypes.string.isRequired}).isRequired,
        subtitle: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
};

/**
 * Displays links to join the community.
 */
const CommunitySection = ({data}) => (
    <section className="section">
        <div className="container">
            <div className="community-grid">
                {data.map(item => (
                    <CustomLink className="community-card-link" href={item.link} key={item.title} target={item.target}>
                        <div className="community-card">
                            <img alt={item.title} className="community-card-icon" src={item.icon}/>
                            <h3 className="community-card-title">{item.title}</h3>
                        </div>
                    </CustomLink>
                ))}
            </div>
        </div>
    </section>
);

CommunitySection.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    })).isRequired,
};

/**
 * The footer section with social media links.
 */
const TouchFooter = ({data}) => (
    <div className="touch-footer" style={{backgroundImage: `url(${data.backgroundImageUrl})`}}>
        <div className="footer-overlay"></div>
        <div className="container footer-container">
            <h2 className="footer-title">{data.title}</h2>
            <div className="socials-container">
                {data.socials.map(social => (
                    <a className="social-link" href={social.link} key={social.name} rel="noreferrer" target="_blank">
                        <img alt={social.name} className="social-icon" src={social.imageUrl} title={social.name}/>
                    </a>
                ))}
            </div>
        </div>
    </div>
);

TouchFooter.propTypes = {
    data: PropTypes.shape({
        backgroundImageUrl: PropTypes.string.isRequired,
        socials: PropTypes.arrayOf(PropTypes.shape({
            imageUrl: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })).isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
};


// --- MAIN APP COMPONENT ---
export default function HomePageComponent({configuration}) {
    return (
        <div className="homepage-wrapper">
            <HomepageHeader data={configuration.hero}/>
            <main>
                <AnnouncementBanner data={configuration.announcement}/>
                <FeatureGrid features={configuration.featureGrid}/>
                <BeginnersSection data={configuration.beginnersSection}/>
                <CommunitySection data={configuration.communitySection}/>
                <TouchFooter data={configuration.footer}/>
            </main>
        </div>
    );
}

HomePageComponent.propTypes = {
    configuration: PropTypes.shape({
        hero: PropTypes.object.isRequired,
        announcement: PropTypes.object.isRequired,
        featureGrid: PropTypes.array.isRequired,
        beginnersSection: PropTypes.object.isRequired,
        communitySection: PropTypes.array.isRequired,
        footer: PropTypes.object.isRequired,
    }).isRequired,
};
