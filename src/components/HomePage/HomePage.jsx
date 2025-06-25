import React from 'react';
import PropTypes from "prop-types";

// --- CONFIGURATION FILE (can be moved to src/data/homepage.json) ---
const homepageData = {
    hero: {
        logoUrl: "img/mia-platform-logo.png",
        title: "",
        subtitle: "Welcome on Mia-Platform Docs!",
        description: "Learn how Mia-Platform can help you to develop your business",
        backgroundImageUrl: "/img/home-page-banner.png"
    },
    announcement: {
        title: "Mia Platform v13 is now available!",
        description: "Compose Your Platform",
        buttons: [
            {
                label: "View roadmap",
                link: "/roadmap",
                primary: false
            },
            {
                label: "View release note",
                link: "/release-notes",
                primary: true
            }
        ]
    },
    featureGrid: [
        {
            title: "Platform Engineering Enablement",
            description: "Discover how to establish clear governance with golden paths for software delivery",
            icon: "/img/homepage/card-1.png",
            link: "/docs/platform-engineering"
        },
        {
            title: "Self-service Application Development",
            description: "Discover how the console solves problems in Platform Engineering",
            icon: "/img/homepage/card-2.png",
            link: "/docs/self-service-dev"
        },
        {
            title: "Real-Time Data Integration",
            description: "Find out how to connect any data source and deliver it to cloud-native applications in near real-time",
            icon: "/img/homepage/card-3.png",
            link: "/docs/real-time-data"
        },
        {
            title: "Secure Platform Operations",
            description: "Learn how to connect to any cloud-native infrastructure and manage workloads across any runtime",
            icon: "/img/homepage/card-4.png",
            link: "/docs/secure-operations"
        },
        {
            title: "AI Agent Lifecycle Management",
            description: "Learn how to enable the creation and orchestration of AI Agents within the platform experience",
            icon: "/img/homepage/card-5.png",
            link: "/docs/ai-lifecycle"
        },
        {
            title: "AI-Native DevX",
            description: "Integrate AI-native capabilities throughout the software lifecycle",
            type: 'image',
            backgroundImage: "/img/homepage/ai.png",
            link: "/docs/ai-devx"
        }
    ],
    beginnersSection: {
        title: "Mia-Platform for beginners!",
        description: "New to Mia-Platform ecosystem?",
        subtitle: "Discover how and where to start.",
        imageUrl: "/img/homepage/beginners.png",
        link: {
            url: "/docs/getting-started",
        }
    },
    communitySection: [
        {
            title: "Join our GitHub Community",
            icon: "community-1",
            link: "https://github.com/mia-platform"
        },
        {
            title: "Join our Expert Program",
            icon: "community-2",
            link: "/expert-program"
        }
    ],
    footer: {
        text: "Let's keep in touch!",
        websiteUrl: "#",
        socials: [
            {name: "Discourse", icon: "social-1", link: "#"},
            {name: "LinkedIn", icon: "social-2", link: "#"},
            {name: "Instagram", icon: "social-3", link: "#"}
        ]
    }
};

// --- GLOBAL STYLES (can be moved to a .css file) ---
const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --mia-primary: #4453FE;
      --mia-primary-light: #F1F3FF;
      --mia-text-light: #AAB3E4;
      --mia-card-border: #E5E7EB;
      --mia-card-bg: #ffffff;
      --mia-section-bg: #F9FAFB;
      --mia-text-primary: #111827;
      --mia-text-secondary: #6B7280;
      --mia-announcement-bg: linear-gradient(90deg, #F0F3FA 0%, #F7F8FC 100%);
      --ifm-font-family-base: 'Inter', sans-serif;
    }
    
    body {
      font-family: var(--ifm-font-family-base);
      background-color: #fff;
      margin: 0;
      color: var(--mia-text-primary);
    }

    .container {
      max-width: 1140px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 24px;
      padding-right: 24px;
    }
    
    .section {
      padding-top: 12px;
      padding-bottom: 48px;
    }
    
    @media (max-width: 768px) {
      .section {
        padding-top: 32px;
        padding-bottom: 32px;
      }
    }
  `}</style>
);

// --- REACT COMPONENTS (can be split into individual files) ---

const SvgIcon = ({name, size = 48}) => {
    const icons = {
        'search': <svg fill="none" height="20" viewBox="0 0 20 20" width="20"><path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667"/></svg>,
        'feature-1': <svg fill="none" height={size} viewBox="0 0 48 48" width={size}><rect fill="#EFF9FF" height="48" rx="12" width="48"/><path d="M24 32V16M16 24H32" stroke="#4453FE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>,
        'feature-2': <svg fill="none" height={size} viewBox="0 0 48 48" width={size}><rect fill="#EFF9FF" height="48" rx="12" width="48"/><path d="M20 30L16 26L20 22M28 22L32 26L28 30" stroke="#4453FE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>,
        'feature-3': <svg fill="none" height={size} viewBox="0 0 48 48" width={size}><rect fill="#EFF9FF" height="48" rx="12" width="48"/><path d="M21 18L16 24L21 30M27 18L32 24L27 30" stroke="#4453FE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>,
        'feature-4': <svg fill="none" height={size} viewBox="0 0 48 48" width={size}><rect fill="#EFF9FF" height="48" rx="12" width="48"/><path d="M24 18V30M18 24H30" stroke="#4453FE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>,
        'feature-5': <svg fill="none" height={size} viewBox="0 0 48 48" width={size}><rect fill="#EFF9FF" height="48" rx="12" width="48"/><path d="M18 24L24 18L30 24L24 30L18 24Z" stroke="#4453FE" strokeLinejoin="round" strokeWidth="2"/></svg>,
        'community-1': <svg fill="none" height="32" viewBox="0 0 32 32" width="32"><rect fill="#F3F4F6" height="32" rx="8" width="32"/><path d="M16 22.6667C19.6819 22.6667 22.6667 19.6819 22.6667 16C22.6667 12.3181 19.6819 9.33334 16 9.33334C12.3181 9.33334 9.33334 12.3181 9.33334 16C9.33334 19.6819 12.3181 22.6667 16 22.6667Z" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/></svg>,
        'community-2': <svg fill="none" height="32" viewBox="0 0 32 32" width="32"><rect fill="#F3F4F6" height="32" rx="8" width="32"/><path d="M11.3333 16H20.6667M16 11.3333V20.6667" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/></svg>,
        'social-1': <svg fill="none" height="24" viewBox="0 0 24 24" width="24"><path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><path d="M12 15L15 12L12 9" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><path d="M9 12H15" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>,
        'social-2': <svg fill="none" height="24" viewBox="0 0 24 24" width="24"><path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V19H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V19H10V10H14V11.5C14.5594 10.9234 15.2633 10.4939 16.0393 10.2638C16.8153 10.0337 17.636 10.0123 18.4222 10.2045" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="translate(-2 -1)"/><path d="M6 9H2V19H6V9Z" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" transform="translate(0 -1)"/><path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>,
        'social-3': <svg fill="none" height="24" viewBox="0 0 24 24" width="24"><rect height="20" rx="5" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="20" x="2" y="2"/><path d="M16 11.37C16.1234 12.2366 15.9813 13.1221 15.5938 13.9056C15.2063 14.6891 14.5931 15.3347 13.8416 15.7388C13.0901 16.1428 12.2384 16.2863 11.4078 16.149C10.5771 16.0118 9.81197 15.5997 9.22218 14.9745C8.63239 14.3493 8.24763 13.5413 8.11786 12.6749C7.98809 11.8085 8.11865 10.9168 8.49479 10.123C8.87093 9.3292 9.47549 8.68537 10.2331 8.29188C10.9906 7.89839 11.8654 7.77194 12.72 7.91001" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><path d="M17.5 6.5H17.51" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>,
    };
    return icons[name] || null;
};

const CustomLink = ({href, children, className, style}) => (
    <a className={className} href={href} style={{textDecoration: 'none', color: 'inherit', ...style}}>
        {children}
    </a>
);

const HomepageHeader = ({data}) => (
    <header style={{
        background: `url(${data.backgroundImageUrl}), linear-gradient(to right, rgb(28, 50, 108), rgb(39, 68, 136))`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: 'white',
        padding: '80px 0',
    }}
    >
        <div className="container" style={{textAlign: 'left'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px'}}>
                <img alt="Mia Platform Logo" src={data.logoUrl} style={{height: '42px'}}/>
                <h1 style={{fontSize: '2.25rem', fontWeight: 600, margin: 0}}>{data.title}</h1>
            </div>
            <p style={{fontSize: '1.5rem', color: 'var(--mia-text-light)', margin: '0 0 8px 0', fontWeight: 400}}>{data.subtitle}</p>
            <p style={{fontSize: '1rem', color: 'var(--mia-text-light)', maxWidth: '560px', margin: '0', fontWeight: 400, lineHeight: 1.25}}>{data.description}</p>
            <div style={{marginTop: '18px', maxWidth: '640px'}}>
                <div style={{position: 'relative'}}>
          <span style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'}}>
            <SvgIcon name="search" />
          </span>
                    <input
placeholder="Search for terms, features and more..." style={{
                        width: '100%',
                        padding: '16px 48px 16px 48px',
                        borderRadius: '8px',
                        border: '1px solid #4B5563',
                        backgroundColor: 'rgba(255,255,255, 0.05)',
                        fontSize: '1rem',
                        color: 'white',
                        boxSizing: 'border-box'
                    }} type="search"
                    />
                </div>
            </div>
        </div>
    </header>
);

const AnnouncementBanner = ({data}) => (
    <div className="section" style={{paddingTop: '24px', paddingBottom: '0', backgroundColor: 'var(--mia-section-bg)'}}>
        <div className="container">
            <div style={{
                background: 'linear-gradient(to right, rgb(208, 198, 235), rgb(234, 209, 220))',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                border: '1px solid var(--mia-card-border)',
            }}
            >
                <div>
                    <h2 style={{fontSize: '1.125rem', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--mia-text-primary)'}}>{data.title}</h2>
                    <p style={{margin: 0, color: 'var(--mia-text-secondary)', fontSize: '0.875rem'}}>{data.description}</p>
                </div>
                <div style={{display: 'flex', gap: '12px'}}>
                    {data.buttons.map(button => (
                        <CustomLink href={button.link} key={button.label}>
                            <button style={{
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: button.primary ? '1px solid var(--mia-primary)' : '1px solid #D1D5DB',
                                backgroundColor: button.primary ? 'var(--mia-primary)' : 'white',
                                color: button.primary ? 'white' : 'var(--mia-text-primary)',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
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

const FeatureGrid = ({features}) => (
    <section className="section" style={{backgroundColor: 'var(--mia-section-bg)'}}>
        <div className="container">
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px'
            }}
            >
                {features.map((feature) => {
                    if (feature.type === 'image') {
                        return (
                            <CustomLink className="feature-card-link" href={feature.link} key={feature.title}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    padding: '24px',
                                    border: '1px solid var(--mia-card-border)',
                                    borderRadius: '12px',
                                    backgroundColor: '#374151',
                                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${feature.backgroundImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    height: '100%',
                                    minHeight: '148px',
                                    boxSizing: 'border-box'
                                }}
                                >
                                    <div>
                                        <h3 style={{margin: '0 0 8px 0', fontSize: '1rem', color: 'white', fontWeight: 600}}>{feature.title}</h3>
                                        <p style={{margin: 0, color: '#E5E7EB', lineHeight: 1.6, fontSize: '0.875rem'}}>{feature.description}</p>
                                    </div>
                                </div>
                            </CustomLink>
                        );
                    }
                    return (
                        <CustomLink className="feature-card-link" href={feature.link} key={feature.title}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                padding: '24px',
                                border: '1px solid var(--mia-card-border)',
                                borderRadius: '12px',
                                backgroundColor: 'rgb(246, 250, 255)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                height: '100%',
                                boxSizing: 'border-box'
                            }}
                            >
                                <div style={{marginRight: '16px', flexShrink: 0}}><img src={feature.icon} alt={feature.title} /></div>
                                <div>
                                    <h3 style={{margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--mia-text-primary)', fontWeight: 600}}>{feature.title}</h3>
                                    <p style={{margin: 0, color: 'var(--mia-text-secondary)', lineHeight: 1.6, fontSize: '0.875rem'}}>{feature.description}</p>
                                </div>
                            </div>
                        </CustomLink>
                    );
                })}
            </div>
        </div>
        <style jsx>{`
      .feature-card-link:hover > div {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(17, 24, 39, 0.05);
      }
    `}</style>
    </section>
);

const BeginnersSection = ({data}) => (
    <section className="section" style={{backgroundColor: 'var(--mia-section-bg)'}}>
        <div className="container">
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '1px solid var(--mia-card-border)',
                overflow: 'hidden'
            }}
            >
                <div style={{padding: '24px'}}>
                    <h2 style={{fontSize: '2rem', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--mia-text-primary)'}}>{data.title}</h2>
                    <p style={{fontSize: '1.4rem', margin: '0', color: 'var(--mia-text-secondary)', lineHeight: 1.7}}>
                        {data.description}
                        <br />{data.subtitle}
                    </p>
                </div>
                <div style={{height: '100%', position: 'relative'}}>
                    <img alt="Team working" src={data.imageUrl} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '50%',
                        height: '100%',
                        background: 'linear-gradient(to right, white, transparent)'
                    }}
                    ></div>
                </div>
            </div>
            <style jsx>{`
        @media (max-width: 996px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr;
          }
          div[style*="grid-template-columns: 1fr 1fr"] > div:last-child {
            max-height: 250px;
          }
        }
      `}</style>
        </div>
    </section>
);

const CommunitySection = ({data}) => (
    <section className="section">
        <div className="container">
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px'
            }}
            >
                {data.map(item => (
                    <CustomLink className="community-card-link" href={item.link} key={item.title}>
                        <div style={{
                            padding: '24px',
                            border: '1px solid var(--mia-card-border)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        }}
                        >
                            <SvgIcon name={item.icon} size={32}/>
                            <h3 style={{color: 'var(--mia-text-primary)', margin: 0, fontWeight: 600, fontSize: '1rem'}}>{item.title}</h3>
                        </div>
                    </CustomLink>
                ))}
            </div>
            <style>{`
        .community-card-link:hover > div {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(17, 24, 39, 0.05);
        }
      `}</style>
        </div>
    </section>
);

const TouchFooter = ({data}) => (
    <div style={{backgroundColor: 'var(--mia-section-bg)', padding: '48px 0', textAlign: 'center'}}>
        <div className="container">
            <p style={{fontSize: '1.125rem', color: 'var(--mia-text-secondary)', margin: '0 0 24px 0'}}>{data.text}</p>
            <div style={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px',
                border: '1px solid var(--mia-card-border)',
                borderRadius: '12px',
                padding: '16px 24px',
                backgroundColor: 'white'
            }}
            >
                <CustomLink
href={data.websiteUrl} style={{
                    color: 'var(--mia-text-primary)',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                }}
                >
                    {'Visit our website'}
                </CustomLink>
                <div style={{width: '1px', height: '24px', backgroundColor: 'var(--mia-card-border)'}}></div>
                <div style={{display: 'flex', gap: '16px'}}>
                    {data.socials.map(social => (
                        <CustomLink href={social.link} key={social.name}>
                            <SvgIcon name={social.icon} size={24} />
                        </CustomLink>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// --- MAIN APP COMPONENT ---
export default function HomePageComponent() {
    return (
        <>
            <GlobalStyles />
            <div className="homepage-wrapper">
                <HomepageHeader data={homepageData.hero} />
                <main>
                    <AnnouncementBanner data={homepageData.announcement} />
                    <FeatureGrid features={homepageData.featureGrid} />
                    <BeginnersSection data={homepageData.beginnersSection} />
                    <CommunitySection data={homepageData.communitySection} />
                    <TouchFooter data={homepageData.footer} />
                </main>
            </div>
        </>
    );
}


HomePageComponent.propTypes = {
};
TouchFooter.propTypes = {
    data: PropTypes.shape({
        text: PropTypes.string.isRequired,
        websiteUrl: PropTypes.string.isRequired,
        socials: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired
        })).isRequired
    }).isRequired
};
CommunitySection.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired
    })).isRequired
};
BeginnersSection.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired,
        link: PropTypes.shape({
            url: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};
FeatureGrid.propTypes = {
    features: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired
    })).isRequired
};
AnnouncementBanner.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        buttons: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired,
            primary: PropTypes.bool
        })).isRequired
    }).isRequired
};
HomepageHeader.propTypes = {
    data: PropTypes.shape({
        logoUrl: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        backgroundImageUrl: PropTypes.string.isRequired
    }).isRequired
};
CustomLink.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    href: PropTypes.string.isRequired,
    style: PropTypes.object
};
SvgIcon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number
}
