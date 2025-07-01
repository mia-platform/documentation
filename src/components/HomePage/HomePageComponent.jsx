import React from 'react';
import PropTypes from "prop-types";
import SearchBar from "@theme/SearchBar";

/**
 * A reusable link component to avoid repetitive styling on anchor tags.
 */
const CustomLink = ({children, className, href, style, target}) => (
    <a className={className} href={href} style={{color: 'inherit', textDecoration: 'none', ...style}} target={target} >
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
    <header style={{
        background: `url(${data.backgroundImageUrl}), linear-gradient(to right, rgb(28, 50, 108), rgb(39, 68, 136))`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        color: 'white',
        padding: '80px 0',
    }}
    >
        <div className="container" style={{textAlign: 'left'}}>
            <div style={{alignItems: 'center', display: 'flex', gap: '16px', marginBottom: '16px'}}>
                <img alt="Mia Platform Logo" src={data.logoUrl} style={{height: '42px'}}/>
                <h1 style={{fontSize: '2.25rem', fontWeight: 600, margin: 0}}>{data.title}</h1>
            </div>
            <p style={{
                fontSize: '1.5rem',
                fontWeight: 400,
                margin: '0 0 8px 0',
            }}
            >{data.subtitle}</p>
            <p style={{
                fontSize: '1rem',
                fontWeight: 400,
                lineHeight: 1.25,
                margin: '0',
                maxWidth: '560px',
            }}
            >{data.description}</p>
            <div style={{marginTop: '18px', maxWidth: '640px'}}>
                <div style={{position: 'relative'}}>
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
    <div className="section" style={{backgroundColor: 'var(--mia-section-bg)', paddingBottom: '0', paddingTop: '24px'}}>
        <div className="container">
            <div style={{
                alignItems: 'center',
                background: 'linear-gradient(to right, #D0C5F0, #F7D3DB)',
                border: '1px solid var(--mia-card-border)',
                borderRadius: '12px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'space-between',
                padding: '24px',
            }}
            >
                <div>
                    <h2 style={{
                        color: 'var(--mia-text-primary)',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        margin: '0 0 4px 0',
                    }}
                    >{data.title}</h2>
                    <p style={{
                        color: 'var(--mia-text-secondary)',
                        fontSize: '0.875rem',
                        margin: 0,
                    }}
                    >{data.description}</p>
                </div>
                <div style={{display: 'flex', gap: '12px'}}>
                    {data.buttons.map(button => (
                        <CustomLink href={button.link} key={button.label}>
                            <button style={{
                                backgroundColor: button.primary ? '#1261E4' : '#FFFFFF',
                                border: button.primary ? '1px solid var(--mia-primary)' : '1px solid #D1D5DB',
                                borderRadius: '8px',
                                color: button.primary ? 'white' : 'var(--mia-text-primary)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 400,
                                padding: '10px 16px',
                                transition: 'all 0.2s ease',
                            }}
                            >
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
    <section className="section" style={{backgroundColor: 'var(--mia-section-bg)'}}>
        <div className="container">
            <div
                className="feature-grid"
                style={{
                    display: 'grid',
                    gap: '24px',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                }}
            >
                {features.map((feature) => {
                    if (feature.type === 'image') {
                        return (
                            <CustomLink className="feature-card-link" href={feature.link} key={feature.title}>
                                <div
className="card-container" style={{
                                    backgroundImage: `linear-gradient(rgba(0,0,100,0.4), rgba(0,0,0,0.4)), url(${feature.backgroundImage})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundColor: '#374151',
                                    border: '1px solid var(--mia-card-border)',
                                    borderRadius: '12px',
                                    boxSizing: 'border-box',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    justifyContent: 'flex-end',
                                    maxHeight: '116px',
                                    minHeight: '116px',
                                    padding: '24px',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                }}
                                >
                                    <div>
                                        <h3 style={{
                                            color: 'white',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            margin: '0 0 8px 0',
                                        }}
                                        >{feature.title}</h3>
                                        <p style={{
                                            color: '#E5E7EB',
                                            fontSize: '0.875rem',
                                            lineHeight: 1.6,
                                            margin: 0,
                                        }}
                                        >{feature.description}</p>
                                    </div>
                                </div>
                            </CustomLink>
                        );
                    }
                    return (
                        <CustomLink className="feature-card-link" href={feature.link} key={feature.title}>
                            <div
className="feature-card card-container" style={{
                                alignItems: 'flex-start',
                                border: '1px solid var(--mia-card-border)',
                                borderRadius: '12px',
                                boxSizing: 'border-box',
                                display: 'flex',
                                height: '100%',
                                maxHeight: '116px',
                                minHeight: '116px',
                                padding: '24px',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            }}
                            >
                                <div style={{flexShrink: 0, marginRight: '16px'}}>
                                    <img alt={feature.title} src={feature.icon} style={{paddingTop: '10px'}}/>
                                </div>
                                <div>
                                    <h3 style={{
                                        color: '#00448C',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        margin: '0 0 8px 0',
                                    }}
                                    >{feature.title}</h3>
                                    <p style={{
                                        color: 'var(--mia-text-secondary)',
                                        fontSize: '0.875rem',
                                        lineHeight: 1.6,
                                        margin: 0,
                                    }}
                                    >{feature.description}</p>
                                </div>
                            </div>
                        </CustomLink>
                    );
                })}
            </div>
        </div>
        {/* Scoped styles for hover effects and mobile responsiveness */}
        <style>{`
            .feature-card-link:hover > .card-container {
                box-shadow: 0 8px 16px rgba(17, 24, 39, 0.05);
                transform: translateY(-4px);
            }
            .feature-card {
                background-color: #F5FAFF;
            }
            .feature-card:hover {
                background-color: #E5F0FC;
            }
            @media (max-width: 768px) {
                .feature-grid {
                    /* On mobile, use a single column layout */
                    grid-template-columns: 1fr !important;
                }
                .card-container {
                    /* On mobile, allow cards to grow to fit content */
                    height: auto !important;
                    max-height: none !important;
                }
            }
        `}</style>
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
 * A section designed to guide new users, with a two-column layout on desktop.
 */
const BeginnersSection = ({data}) => (
    <section className="section" style={{backgroundColor: 'var(--mia-section-bg)'}}>
        <div className="container">
            <div
className="beginners-grid" style={{
                alignItems: 'center',
                backgroundColor: '#F9F9F9',
                border: '1px solid var(--mia-card-border)',
                borderRadius: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                overflow: 'hidden',
            }}
            >
                <div style={{padding: '24px'}}>
                    <h2 style={{
                        color: 'var(--mia-text-primary)',
                        fontSize: '24px',
                        fontWeight: 700,
                        margin: '0 0 16px 0',
                    }}
                    >{data.title}</h2>
                    <p style={{
                        color: 'var(--mia-text-secondary)',
                        fontSize: '20px',
                        lineHeight: 1.7,
                        margin: '0',
                    }}
                    >
                        {data.description}
                        <br/>
                        {data.subtitle}
                    </p>
                </div>
                <div className="beginners-image-container" style={{height: '100%', position: 'relative'}}>
                    <img alt="Team working" src={data.imageUrl} style={{display: 'block', height: '100%', objectFit: 'cover', width: '100%'}}/>
                    <div style={{
                        background: 'linear-gradient(to right, #F9F9F9, transparent)',
                        height: '100%',
                        left: 0,
                        position: 'absolute',
                        top: 0,
                        width: '50%',
                    }}
                    ></div>
                </div>
            </div>
            {/* Scoped styles for mobile responsiveness */}
            <style>{`
                @media (max-width: 996px) {
                    .beginners-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .beginners-image-container {
                        /* Hide the image container on smaller screens */
                        display: none !important;
                    }
                }
            `}</style>
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
 * Displays links to join the community, with a hover effect.
 */
const CommunitySection = ({data}) => (
    <section className="section">
        <div className="container">
            <div style={{
                display: 'grid',
                gap: '24px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            }}
            >
                {data.map(item => (
                    <CustomLink className="community-card-link" href={item.link} key={item.title} target={item.target}>
                        <div style={{
                            alignItems: 'center',
                            border: '1px solid var(--mia-card-border)',
                            borderRadius: '12px',
                            display: 'flex',
                            gap: '16px',
                            justifyContent: 'center',
                            padding: '24px',
                            textAlign: 'center',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        }}
                        >
                            <img alt={item.title} src={item.icon} style={{height: '32px'}}/>
                            <h3 style={{
                                color: 'var(--mia-text-primary)',
                                fontSize: '1rem',
                                fontWeight: 600,
                                margin: 0,
                            }}
                            >{item.title}</h3>
                        </div>
                    </CustomLink>
                ))}
            </div>
            {/* Scoped styles for hover effects */}
            <style>{`
                .community-card-link:hover > div {
                    box-shadow: 0 8px 16px rgba(17, 24, 39, 0.05);
                    transform: translateY(-4px);
                }
            `}</style>
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
    <div
className="section" style={{
        backgroundImage: `url(${data.backgroundImageUrl})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        color: 'white',
        marginTop: '24px',
        padding: '80px 0',
        position: 'relative',
        textAlign: 'center',
        width: '100%',
    }}
    >
        <div style={{
            bottom: 0,
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 1,
        }}
        ></div>
        <div className="container" style={{position: 'relative', zIndex: 2}}>
            <h2 style={{color: "#004AAA", fontSize: '24px', fontWeight: 700, margin: '0 0 32px 0'}}>
                {data.title}
            </h2>
            <div className="socials-container" style={{display: 'flex', gap: '24px', justifyContent: 'center'}}>
                {data.socials.map(social => (
                    <a
                        href={social.link}
                        key={social.name}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        style={{
                            borderRadius: '50%',
                            display: 'block',
                            height: '64px',
                            overflow: 'hidden',
                            width: '64px',
                        }}
                        target="_blank"
                    >
                        <img
                            alt={social.name}
                            src={social.imageUrl}
                            style={{height: '100%', objectFit: 'cover', width: '100%'}}
                            title={social.name}
                        />
                    </a>
                ))}
            </div>
        </div>
        {/* Scoped styles for mobile responsiveness */}
        <style>{`
            @media (max-width: 768px) {
                .socials-container {
                    /* On mobile, stack icons vertically */
                    align-items: center !important;
                    flex-direction: column !important;
                }
            }
        `}</style>
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

/**
 * Global styles component to provide base variables and styles for the page.
 */
const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        :root {
            --mia-primary: #4453FE;
            --mia-primary-light: #F1F3FF;
            --mia-text-light: #AAB3E4;
            --mia-card-border: #E5E7EB;
            --mia-card-bg: #ffffff;
            --mia-section-bg: #FFFFFF;
            --mia-text-primary: #111827;
            --mia-text-secondary: #6B7280;
            --ifm-font-family-base: 'Inter', sans-serif;
        }

        body {
            background-color: #fff;
            color: var(--mia-text-primary);
            font-family: var(--ifm-font-family-base);
            margin: 0;
        }

        .container {
            margin-left: auto;
            margin-right: auto;
            max-width: 1140px;
            padding-left: 24px;
            padding-right: 24px;
        }

        .section {
            padding-top: 24px;
        }

        @media (max-width: 768px) {
            .container {
                /* Reduce padding on mobile to give content more space */
                padding-left: 16px;
                padding-right: 16px;
            }
            .section {
                padding-bottom: 32px;
                padding-top: 32px;
            }
        }
    `}</style>
);


// --- MAIN APP COMPONENT ---
// This component assembles the entire page structure.
export default function HomePageComponent({configuration}) {
    return (
        <>
            <GlobalStyles/>
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
        </>
    );
}

HomePageComponent.propTypes = {
    configuration: PropTypes.shape({
        hero: PropTypes.shape({
            backgroundImageUrl: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            logoUrl: PropTypes.string.isRequired,
            subtitle: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        }).isRequired,
        announcement: PropTypes.shape({
            buttons: PropTypes.arrayOf(PropTypes.shape({
                label: PropTypes.string.isRequired,
                link: PropTypes.string.isRequired,
                primary: PropTypes.bool.isRequired,
            })).isRequired,
            description: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        }).isRequired,
        featureGrid: PropTypes.arrayOf(PropTypes.shape({
            description: PropTypes.string.isRequired,
            icon: PropTypes.string, // Opzionale
            link: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            backgroundImage: PropTypes.string, // Opzionale
            type: PropTypes.string, // Opzionale
        })).isRequired,
        beginnersSection: PropTypes.shape({
            description: PropTypes.string.isRequired,
            imageUrl: PropTypes.string.isRequired,
            link: PropTypes.shape({
                url: PropTypes.string.isRequired,
            }).isRequired,
            subtitle: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        }).isRequired,
        communitySection: PropTypes.arrayOf(PropTypes.shape({
            icon: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        })).isRequired,
        footer: PropTypes.shape({
            backgroundImageUrl: PropTypes.string.isRequired,
            socials: PropTypes.arrayOf(PropTypes.shape({
                imageUrl: PropTypes.string.isRequired,
                link: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
            })).isRequired,
            title: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};
