import React from 'react';
import PropTypes from "prop-types";
import SearchBar from "@theme/SearchBar";
import {useColorMode} from '@docusaurus/theme-common';
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

const GetIcons = ({icon}) => {
    switch (icon) {
        case 'ai-agent':
            return (
                <svg fill="none" height="49" viewBox="0 0 56 49" width="56" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8898 0.157715L0.971191 12.1522V36.1522L21.8898 48.1577L42.7973 36.1522V12.1522L21.8898 0.157715Z" fill="#AAD1FF" />
                    <path d="M45.2398 24.3316L36.7725 21.2144L33.6553 12.7406C33.4707 12.2391 33.1368 11.8063 32.6985 11.5006C32.2602 11.1949 31.7386 11.031 31.2042 11.031C30.6699 11.031 30.1483 11.1949 29.71 11.5006C29.2717 11.8063 28.9378 12.2391 28.7532 12.7406L25.6327 21.2046L17.1589 24.3218C16.6574 24.5064 16.2246 24.8404 15.9188 25.2787C15.6131 25.717 15.4492 26.2385 15.4492 26.7729C15.4492 27.3073 15.6131 27.8288 15.9188 28.2671C16.2246 28.7054 16.6574 29.0394 17.1589 29.224L25.6212 32.3608L28.7384 40.8297C28.923 41.3312 29.257 41.764 29.6953 42.0698C30.1336 42.3755 30.6551 42.5394 31.1895 42.5394C31.7239 42.5394 32.2454 42.3755 32.6837 42.0698C33.122 41.764 33.456 41.3312 33.6406 40.8297L36.7578 32.3625L45.2316 29.2453C45.7331 29.0607 46.1659 28.7267 46.4716 28.2884C46.7773 27.8501 46.9412 27.3286 46.9412 26.7942C46.9412 26.2598 46.7773 25.7383 46.4716 25.3C46.1659 24.8617 45.7331 24.5277 45.2316 24.3431L45.2398 24.3316ZM35.8571 29.8999C35.5024 30.0301 35.1803 30.2359 34.9131 30.5031C34.646 30.7702 34.4401 31.0923 34.31 31.447L31.1928 39.8897L28.0821 31.4404C27.9519 31.0876 27.7467 30.7672 27.4807 30.5013C27.2148 30.2354 26.8944 30.0302 26.5416 29.8999L18.0989 26.7827L26.5416 23.6655C26.8944 23.5352 27.2148 23.3301 27.4807 23.0641C27.7467 22.7982 27.9519 22.4778 28.0821 22.125L31.1993 13.6823L34.3165 22.125C34.4467 22.4797 34.6525 22.8018 34.9197 23.0689C35.1868 23.3361 35.5089 23.5419 35.8636 23.6721L44.3063 26.7893L35.8571 29.8999ZM36.4493 9.72021C36.4493 9.37212 36.5876 9.03828 36.8337 8.79214C37.0799 8.546 37.4137 8.40771 37.7618 8.40771H40.3868V5.78271C40.3868 5.43462 40.5251 5.10078 40.7712 4.85464C41.0174 4.6085 41.3512 4.47021 41.6993 4.47021C42.0474 4.47021 42.3813 4.6085 42.6274 4.85464C42.8735 5.10078 43.0118 5.43462 43.0118 5.78271V8.40771H45.6368C45.9849 8.40771 46.3188 8.546 46.5649 8.79214C46.811 9.03828 46.9493 9.37212 46.9493 9.72021C46.9493 10.0683 46.811 10.4022 46.5649 10.6483C46.3188 10.8944 45.9849 11.0327 45.6368 11.0327H43.0118V13.6577C43.0118 14.0058 42.8735 14.3397 42.6274 14.5858C42.3813 14.8319 42.0474 14.9702 41.6993 14.9702C41.3512 14.9702 41.0174 14.8319 40.7712 14.5858C40.5251 14.3397 40.3868 14.0058 40.3868 13.6577V11.0327H37.7618C37.4137 11.0327 37.0799 10.8944 36.8337 10.6483C36.5876 10.4022 36.4493 10.0683 36.4493 9.72021ZM53.5118 17.5952C53.5118 17.9433 53.3735 18.2772 53.1274 18.5233C52.8813 18.7694 52.5474 18.9077 52.1993 18.9077H50.8868V20.2202C50.8868 20.5683 50.7485 20.9022 50.5024 21.1483C50.2563 21.3944 49.9224 21.5327 49.5743 21.5327C49.2262 21.5327 48.8924 21.3944 48.6462 21.1483C48.4001 20.9022 48.2618 20.5683 48.2618 20.2202V18.9077H46.9493C46.6012 18.9077 46.2674 18.7694 46.0212 18.5233C45.7751 18.2772 45.6368 17.9433 45.6368 17.5952C45.6368 17.2471 45.7751 16.9133 46.0212 16.6671C46.2674 16.421 46.6012 16.2827 46.9493 16.2827H48.2618V14.9702C48.2618 14.6221 48.4001 14.2883 48.6462 14.0421C48.8924 13.796 49.2262 13.6577 49.5743 13.6577C49.9224 13.6577 50.2563 13.796 50.5024 14.0421C50.7485 14.2883 50.8868 14.6221 50.8868 14.9702V16.2827H52.1993C52.5474 16.2827 52.8813 16.421 53.1274 16.6671C53.3735 16.9133 53.5118 17.2471 53.5118 17.5952Z" fill="#004AAA" />
                </svg>
            )
        case 'ai-foundry':
            return (
                <svg fill="none" height="48" viewBox="0 0 56 48" width="56" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8898 0L0.971191 11.9945V35.9945L21.8898 48L42.7973 35.9945V11.9945L21.8898 0Z" fill="#AAD1FF"/>
                    <g fill="#004AAA" transform="translate(18.3, 8.3) scale(0.138)">
                        <path d="M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z"/>
                    </g>
                </svg>
            )
        case 'context-catalog':
            return (
                <svg fill="none" height="48" viewBox="0 0 56 48" width="56" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8898 0L0.971191 11.9945V35.9945L21.8898 48L42.7973 35.9945V11.9945L21.8898 0Z" fill="#AAD1FF"/>
                    <g fill="#004AAA" transform="translate(6.01, 4.17) scale(0.17)">
                        <path d="M208,24H72A32,32,0,0,0,40,56V224a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16H56a16,16,0,0,1,16-16H208a8,8,0,0,0,8-8V32A8,8,0,0,0,208,24ZM120,40h48v72L148.79,97.6a8,8,0,0,0-9.6,0L120,112Zm80,144H72a31.82,31.82,0,0,0-16,4.29V56A16,16,0,0,1,72,40h32v88a8,8,0,0,0,12.8,6.4L144,114l27.21,20.4A8,8,0,0,0,176,136a8,8,0,0,0,8-8V40h16Z"/>
                    </g>
                </svg>
            )
        case 'flow':
            return (
                <svg fill="none" height="48" viewBox="0 0 56 48" width="56" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8898 0L0.971191 11.9945V35.9945L21.8898 48L42.7973 35.9945V11.9945L21.8898 0Z" fill="#AAD1FF"/>
                    <g fill="#004AAA" transform="translate(18.3, 8.3) scale(0.138)">
                        <path d="M48,64a8,8,0,0,1,8-8H72V40a8,8,0,0,1,16,0V56h16a8,8,0,0,1,0,16H88V88a8,8,0,0,1-16,0V72H56A8,8,0,0,1,48,64ZM184,192h-8v-8a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16Zm56-48H224V128a8,8,0,0,0-16,0v16H192a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V160h16a8,8,0,0,0,0-16ZM219.31,80,80,219.31a16,16,0,0,1-22.62,0L36.68,198.63a16,16,0,0,1,0-22.63L176,36.69a16,16,0,0,1,22.63,0l20.68,20.68A16,16,0,0,1,219.31,80Zm-54.63,32L144,91.31l-96,96L68.68,208ZM208,68.69,187.31,48l-32,32L176,100.69Z"/>
                    </g>
                </svg>
            )
        case 'data-catalog':
            return (
                <svg fill="none" height="48" viewBox="0 0 56 48" width="56" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8898 0L0.971191 11.9945V35.9945L21.8898 48L42.7973 35.9945V11.9945L21.8898 0Z" fill="#AAD1FF"/>
                    <path d="M52.9181 25.3125L36.625 9.01947C36.3821 8.77465 36.093 8.58056 35.7745 8.44846C35.4559 8.31637 35.1143 8.24891 34.7695 8.25001H19.5625C19.2144 8.25001 18.8806 8.38829 18.6344 8.63444C18.3883 8.88058 18.25 9.21442 18.25 9.56251V24.7695C18.2489 25.1143 18.3164 25.4559 18.4485 25.7745C18.5806 26.093 18.7747 26.3821 19.0195 26.625L35.3125 42.9181C35.5563 43.1619 35.8457 43.3553 36.1642 43.4872C36.4827 43.6192 36.8241 43.6871 37.1689 43.6871C37.5137 43.6871 37.855 43.6192 38.1736 43.4872C38.4921 43.3553 38.7815 43.1619 39.0252 42.9181L52.9181 29.0252C53.1619 28.7815 53.3553 28.4921 53.4872 28.1736C53.6192 27.855 53.6871 27.5137 53.6871 27.1689C53.6871 26.8241 53.6192 26.4827 53.4872 26.1642C53.3553 25.8457 53.1619 25.5563 52.9181 25.3125ZM37.1681 41.0625L20.875 24.7695V10.875H34.7695L51.0625 27.1681L37.1681 41.0625ZM28.75 16.7813C28.75 17.1706 28.6345 17.5513 28.4182 17.875C28.2019 18.1988 27.8944 18.4511 27.5347 18.6002C27.1749 18.7492 26.7791 18.7881 26.3972 18.7122C26.0153 18.6362 25.6645 18.4487 25.3891 18.1734C25.1138 17.898 24.9263 17.5472 24.8503 17.1653C24.7744 16.7834 24.8134 16.3876 24.9624 16.0279C25.1114 15.6681 25.3637 15.3606 25.6875 15.1443C26.0112 14.928 26.3919 14.8125 26.7813 14.8125C27.3034 14.8125 27.8042 15.0199 28.1734 15.3891C28.5426 15.7584 28.75 16.2591 28.75 16.7813Z" fill="#004AAA"/>
                </svg>
            )
        case 'mfe-composer':
            return (
                <svg fill="none" height="48" viewBox="0 0 56 48" width="56" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8898 0L0.971191 11.9945V35.9945L21.8898 48L42.7973 35.9945V11.9945L21.8898 0Z" fill="#AAD1FF"/>
                    <path d="M50.2026 14.3202C50.123 14.1234 49.9968 13.9489 49.835 13.8116C49.6731 13.6743 49.4803 13.5783 49.2732 13.5318C49.0661 13.4853 48.8507 13.4898 48.6457 13.5448C48.4407 13.5999 48.2521 13.7038 48.096 13.8477L41.4843 19.9492L38.6575 19.3422L38.0505 16.5154L44.152 9.90364C44.2959 9.74761 44.3998 9.55899 44.4549 9.35397C44.5099 9.14895 44.5144 8.93364 44.4679 8.72651C44.4214 8.51938 44.3254 8.32661 44.1881 8.16473C44.0508 8.00286 43.8763 7.8767 43.6795 7.79708C41.8862 7.07165 39.9422 6.79775 38.0182 6.99944C36.0943 7.20113 34.2493 7.87224 32.6454 8.95381C31.0416 10.0354 29.7279 11.4943 28.8197 13.2024C27.9116 14.9104 27.4369 16.8154 27.4373 18.7499C27.4352 20.3834 27.7703 21.9998 28.4217 23.4979L18.5435 32.039C18.5189 32.0586 18.4959 32.0816 18.4729 32.1029C17.4882 33.0876 16.9351 34.4231 16.9351 35.8157C16.9351 36.5052 17.0709 37.188 17.3347 37.825C17.5986 38.462 17.9854 39.0408 18.4729 39.5284C18.9605 40.016 19.5393 40.4027 20.1763 40.6666C20.8134 40.9305 21.4961 41.0663 22.1857 41.0663C23.5782 41.0663 24.9137 40.5131 25.8984 39.5284C25.9197 39.5071 25.9427 39.4825 25.9624 39.4595L34.5018 29.578C36.3007 30.3676 38.268 30.6962 40.2258 30.5338C42.1836 30.3715 44.07 29.7235 45.7142 28.6484C47.3585 27.5733 48.7086 26.1051 49.6424 24.3768C50.5763 22.6484 51.0643 20.7144 51.0623 18.7499C51.0649 17.2316 50.7729 15.7273 50.2026 14.3202ZM39.2498 27.9374C37.6962 27.9353 36.1685 27.5402 34.8086 26.789C34.5452 26.6434 34.2397 26.5928 33.9434 26.6457C33.6471 26.6986 33.378 26.8517 33.1811 27.0793L24.01 37.7007C23.5137 38.1723 22.8529 38.4312 22.1684 38.4225C21.4839 38.4137 20.8299 38.1379 20.3459 37.6538C19.8618 37.1698 19.586 36.5158 19.5772 35.8313C19.5685 35.1468 19.8274 34.4859 20.2989 33.9897L30.9121 24.8202C31.1402 24.6233 31.2936 24.3538 31.3464 24.0572C31.3993 23.7605 31.3485 23.4547 31.2025 23.1911C30.3659 21.6778 29.9732 19.9592 30.0697 18.2327C30.1662 16.5063 30.748 14.8421 31.7481 13.4316C32.7483 12.021 34.1261 10.9213 35.7234 10.2589C37.3206 9.59652 39.0724 9.39831 40.7772 9.68708L35.6585 15.234C35.516 15.3885 35.4128 15.575 35.3574 15.7777C35.302 15.9804 35.2961 16.1934 35.3402 16.3989L36.2688 20.7186C36.3219 20.9657 36.4452 21.1922 36.6239 21.3709C36.8026 21.5496 37.0291 21.6729 37.2761 21.726L41.5992 22.6546C41.8046 22.6986 42.0177 22.6927 42.2204 22.6374C42.4231 22.582 42.6095 22.4787 42.764 22.3363L48.311 17.2175C48.5321 18.535 48.4636 19.8848 48.1102 21.1731C47.7568 22.4613 47.1271 23.6572 46.2647 24.6774C45.4023 25.6976 44.3281 26.5177 43.1166 27.0807C41.9052 27.6437 40.5857 27.936 39.2498 27.9374Z" fill="#004AAA"/>
                </svg>
            )
        case 'real-time-data-integration':
            return (
                <svg fill="none" height="49" viewBox="0 0 56 49" width="56" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8898 0.157715L0.971191 12.1522V36.1522L21.8898 48.1577L42.7973 36.1522V12.1522L21.8898 0.157715Z" fill="#AAD1FF"/>
                    <path d="M33.8242 7.09521C24.9927 7.09521 18.0742 11.1312 18.0742 16.2827V32.0327C18.0742 37.1843 24.9927 41.2202 33.8242 41.2202C42.6557 41.2202 49.5742 37.1843 49.5742 32.0327V16.2827C49.5742 11.1312 42.6557 7.09521 33.8242 7.09521ZM46.9492 24.1577C46.9492 25.736 45.6564 27.3454 43.4038 28.5743C40.8674 29.9573 37.4648 30.7202 33.8242 30.7202C30.1837 30.7202 26.781 29.9573 24.2446 28.5743C21.992 27.3454 20.6992 25.736 20.6992 24.1577V21.4277C23.4981 23.8887 28.2838 25.4702 33.8242 25.4702C39.3646 25.4702 44.1503 23.8821 46.9492 21.4277V24.1577ZM24.2446 11.8662C26.781 10.4831 30.1837 9.72021 33.8242 9.72021C37.4648 9.72021 40.8674 10.4831 43.4038 11.8662C45.6564 13.095 46.9492 14.7044 46.9492 16.2827C46.9492 17.861 45.6564 19.4704 43.4038 20.6993C40.8674 22.0823 37.4648 22.8452 33.8242 22.8452C30.1837 22.8452 26.781 22.0823 24.2446 20.6993C21.992 19.4704 20.6992 17.861 20.6992 16.2827C20.6992 14.7044 21.992 13.095 24.2446 11.8662ZM43.4038 36.4493C40.8674 37.8323 37.4648 38.5952 33.8242 38.5952C30.1837 38.5952 26.781 37.8323 24.2446 36.4493C21.992 35.2204 20.6992 33.611 20.6992 32.0327V29.3027C23.4981 31.7637 28.2838 33.3452 33.8242 33.3452C39.3646 33.3452 44.1503 31.7571 46.9492 29.3027V32.0327C46.9492 33.611 45.6564 35.2204 43.4038 36.4493Z" fill="#004AAA"/>
                </svg>
            )
        case 'platform-operation':
            return (
                <svg fill="none" height="49" viewBox="0 0 56 49" width="56" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8898 0.157715L0.971191 12.1522V36.1522L21.8898 48.1577L42.7973 36.1522V12.1522L21.8898 0.157715Z" fill="#AAD1FF"/>
                    <path d="M46.9492 25.4702H20.6992C20.003 25.4702 19.3353 25.7468 18.8431 26.2391C18.3508 26.7313 18.0742 27.399 18.0742 28.0952V35.9702C18.0742 36.6664 18.3508 37.3341 18.8431 37.8264C19.3353 38.3187 20.003 38.5952 20.6992 38.5952H46.9492C47.6454 38.5952 48.3131 38.3187 48.8054 37.8264C49.2977 37.3341 49.5742 36.6664 49.5742 35.9702V28.0952C49.5742 27.399 49.2977 26.7313 48.8054 26.2391C48.3131 25.7468 47.6454 25.4702 46.9492 25.4702ZM46.9492 35.9702H20.6992V28.0952H46.9492V35.9702ZM46.9492 9.72021H20.6992C20.003 9.72021 19.3353 9.99678 18.8431 10.4891C18.3508 10.9813 18.0742 11.649 18.0742 12.3452V20.2202C18.0742 20.9164 18.3508 21.5841 18.8431 22.0764C19.3353 22.5687 20.003 22.8452 20.6992 22.8452H46.9492C47.6454 22.8452 48.3131 22.5687 48.8054 22.0764C49.2977 21.5841 49.5742 20.9164 49.5742 20.2202V12.3452C49.5742 11.649 49.2977 10.9813 48.8054 10.4891C48.3131 9.99678 47.6454 9.72021 46.9492 9.72021ZM46.9492 20.2202H20.6992V12.3452H46.9492V20.2202ZM44.3242 16.2827C44.3242 16.6721 44.2088 17.0527 43.9924 17.3765C43.7761 17.7003 43.4686 17.9526 43.1089 18.1016C42.7491 18.2506 42.3533 18.2896 41.9714 18.2136C41.5895 18.1377 41.2387 17.9502 40.9634 17.6748C40.688 17.3995 40.5005 17.0487 40.4245 16.6668C40.3486 16.2849 40.3876 15.889 40.5366 15.5293C40.6856 15.1696 40.9379 14.8621 41.2617 14.6458C41.5854 14.4294 41.9661 14.314 42.3555 14.314C42.8776 14.314 43.3784 14.5214 43.7476 14.8906C44.1168 15.2598 44.3242 15.7606 44.3242 16.2827ZM44.3242 32.0327C44.3242 32.4221 44.2088 32.8027 43.9924 33.1265C43.7761 33.4503 43.4686 33.7026 43.1089 33.8516C42.7491 34.0006 42.3533 34.0396 41.9714 33.9636C41.5895 33.8877 41.2387 33.7002 40.9634 33.4248C40.688 33.1495 40.5005 32.7987 40.4245 32.4168C40.3486 32.0349 40.3876 31.639 40.5366 31.2793C40.6856 30.9196 40.9379 30.6121 41.2617 30.3958C41.5854 30.1794 41.9661 30.064 42.3555 30.064C42.8776 30.064 43.3784 30.2714 43.7476 30.6406C44.1168 31.0098 44.3242 31.5106 44.3242 32.0327Z" fill="#004AAA"/>
                </svg>
            )
        case 'mia-platform-console':
            return (
                <svg fill="none" height="48" viewBox="0 0 56 48" width="56" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8898 0L0.971191 11.9945V35.9945L21.8898 48L42.7973 35.9945V11.9945L21.8898 0Z" fill="#AAD1FF"/>
                    <g fill="#004AAA" transform="translate(18.3, 8.3) scale(0.138)">
                        <path d="M223.85,47.12a16,16,0,0,0-15-15c-12.58-.75-44.73.4-71.41,27.07L132.69,64H74.36A15.91,15.91,0,0,0,63,68.68L28.7,103a16,16,0,0,0,9.07,27.16l38.47,5.37,44.21,44.21,5.37,38.49a15.94,15.94,0,0,0,10.78,12.92,16.11,16.11,0,0,0,5.1.83A15.91,15.91,0,0,0,153,227.3L187.32,193A15.91,15.91,0,0,0,192,181.64V123.31l4.77-4.77C223.45,91.86,224.6,59.71,223.85,47.12ZM74.36,80h42.33L77.16,119.52,40,114.34Zm74.41-9.45a76.65,76.65,0,0,1,59.11-22.47,76.46,76.46,0,0,1-22.42,59.16L128,164.68,91.32,128ZM176,181.64,141.67,216l-5.19-37.17L176,139.31Zm-74.16,9.5C97.34,201,82.29,224,40,224a8,8,0,0,1-8-8c0-42.29,23-57.34,32.86-61.85a8,8,0,0,1,6.64,14.56c-6.43,2.93-20.62,12.36-23.12,38.91,26.55-2.5,36-16.69,38.91-23.12a8,8,0,1,1,14.56,6.64Z"/>
                    </g>
                </svg>
            )
        case 'runtime-environment':
            return (
                <svg fill="none" height="49" viewBox="0 0 56 49" width="56" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8898 0.423828L0.971191 12.4183V36.4183L21.8898 48.4238L42.7973 36.4183V12.4183L21.8898 0.423828Z" fill="#AAD1FF"/>
                    <path d="M50.8837 31.2189C51.057 31.5197 51.1041 31.877 51.0146 32.2124C50.9252 32.5479 50.7064 32.8343 50.4062 33.0088L34.6562 42.1963C34.4556 42.3133 34.2274 42.375 33.9951 42.375C33.7628 42.375 33.5346 42.3133 33.3339 42.1963L17.5839 33.0088C17.2881 32.831 17.0742 32.5439 16.9885 32.2096C16.9029 31.8753 16.9523 31.5207 17.1262 31.2226C17.3 30.9244 17.5843 30.7068 17.9175 30.6167C18.2507 30.5267 18.6059 30.5715 18.9062 30.7414L34 39.5434L49.0938 30.7414C49.3946 30.5681 49.7518 30.521 50.0873 30.6105C50.4228 30.7 50.7091 30.9187 50.8837 31.2189ZM49.0938 22.8664L34 31.6684L18.9062 22.8664C18.6074 22.7176 18.2631 22.6883 17.9434 22.7844C17.6237 22.8806 17.3526 23.0949 17.1854 23.3838C17.0181 23.6727 16.9672 24.0145 17.0431 24.3397C17.119 24.6648 17.3159 24.9487 17.5938 25.1338L33.3438 34.3213C33.5444 34.4383 33.7726 34.5 34.0049 34.5C34.2372 34.5 34.4654 34.4383 34.6661 34.3213L50.4161 25.1338C50.5674 25.0482 50.7001 24.9334 50.8067 24.7961C50.9133 24.6588 50.9915 24.5017 51.0368 24.3339C51.0822 24.1661 51.0937 23.991 51.0709 23.8187C51.048 23.6464 50.9911 23.4804 50.9036 23.3302C50.816 23.1801 50.6995 23.0488 50.5608 22.9441C50.4221 22.8393 50.264 22.7632 50.0956 22.72C49.9272 22.6769 49.752 22.6676 49.58 22.6927C49.408 22.7179 49.2427 22.7769 49.0938 22.8664ZM16.9375 16.1251C16.938 15.8952 16.9989 15.6695 17.1141 15.4706C17.2293 15.2716 17.3947 15.1064 17.5938 14.9914L33.3438 5.80394C33.5444 5.68691 33.7726 5.62524 34.0049 5.62524C34.2372 5.62524 34.4654 5.68691 34.6661 5.80394L50.4161 14.9914C50.6142 15.107 50.7786 15.2725 50.8928 15.4714C51.0071 15.6704 51.0672 15.8957 51.0672 16.1251C51.0672 16.3545 51.0071 16.5799 50.8928 16.7788C50.7786 16.9777 50.6142 17.1432 50.4161 17.2588L34.6661 26.4463C34.4654 26.5633 34.2372 26.625 34.0049 26.625C33.7726 26.625 33.5444 26.5633 33.3438 26.4463L17.5938 17.2588C17.3947 17.1438 17.2293 16.9786 17.1141 16.7797C16.9989 16.5807 16.938 16.355 16.9375 16.1251ZM20.8553 16.1251L34 23.7934L47.1447 16.1251L34 8.45683L20.8553 16.1251Z" fill="#004AAA"/>
                </svg>
            )
        default:
            return (
                <></>
            );
    }
}

GetIcons.propTypes = {
    icon: PropTypes.string.isRequired,
};

/**
 * Renders the main hero section of the page.
 */
const HomepageHeader = ({data}) => {
    const {colorMode} = useColorMode();
    return (
        <header className="homepage-header">
            <div className="homepage-header-background" style={{backgroundImage: `url(${data.backgroundImageUrl})`}}>
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
                                    width: '480px',
                                    ...(colorMode === 'dark' && {
                                        border: '1px solid white',
                                        color: 'white'
                                    })
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
};

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
const FeatureGrid = ({features}) => {
    return (
        <section className="section feature-grid-section">
            <div className="container">
                <div className="feature-grid">
                    {features.map((feature) => {
                        {/*
                            ,To use this feature
                            {
                              "backgroundImage": "/img/homepage/ai.jpg",
                              "description": "Find out how to efficiently orchestrate, monitor, and manage your runtime environments with ready-to-use components.",
                              "link": "/docs/marketplace/overview_marketplace",
                              "title": "Runtime Components",
                              "target": "_self",
                              "type": "image"
                            }
                        */}
                        if (feature.type === 'image') {
                            return (
                                <CustomLink
                                    className="feature-card-link" href={feature.link} key={feature.title}
                                    target={feature.target}
                                >
                                    <div
                                        className="card-container image-card"
                                        style={{backgroundImage: `linear-gradient(rgba(0,0,100,0.4), rgba(0,0,0,0.4)), url(${feature.backgroundImage})`}}
                                    >
                                        <div className="card-content">
                                            <h3 className="image-card-title">{feature.title}</h3>
                                            <p className="image-card-description">{feature.description}</p>
                                        </div>
                                    </div>
                                </CustomLink>
                            );
                        }
                        return (
                            <CustomLink
                                className="feature-card-link" href={feature.link} key={feature.title}
                                target={feature.target}
                            >
                                <div className="card-container feature-card">
                                    <div className="feature-card-icon-wrapper">
                                        {GetIcons({icon: feature.icon})}
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
}

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
            <CustomLink className="beginners-card-link" href={data.link.url} key={data.title} target={data.link.target}>
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
            </CustomLink>
        </div>
    </section>
);

BeginnersSection.propTypes = {
    data: PropTypes.shape({
        description: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired,
        link: PropTypes.shape({
            url: PropTypes.string.isRequired,
            target: PropTypes.string.isRequired,
        }).isRequired,
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
    <div className="touch-footer">
        <div className="footer-overlay" style={{backgroundImage: `url(${data.backgroundImageUrl})`}}></div>
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
