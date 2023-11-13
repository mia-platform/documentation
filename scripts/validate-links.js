const fs = require('fs');
const path = require('path');

const docsFolder = path.resolve(__dirname, '../');

const excludePath = (path) => {
    const pathToExclude = [
        'docs/runtime_suite',
        'docs/runtime_suite_examples',
        'docs/runtime_suite_templates',
        'docs/runtime_suite_libraries',
        'docs/runtime_suite_tools',
        'docs/runtime_suite_applications',
        'docs/self_hosted/installation-chart',
        'docs/microfrontend-composer/back-kit',
        'docs/microfrontend-composer/composer',
        'docs/cli'
    ];

    if (pathToExclude.some(s => path.toLowerCase().includes(s))) return true;
    return false;
}

const readFiles = (dir) => {
    if(excludePath(dir)) return '';
    return fs.readdirSync(dir).map((file) => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            return readFiles(fullPath);
        } else {
            return fullPath;
        }
    });
};

const toCheck = {
    start: [
        'mailto',
        '#',
    ],
    end: [
        '.png',
        '.jpg',
        '.gif',
        '.svg',
        '.sh',
        '.xml'
    ],
    special: [
        'http',
        'https'
    ]
};

const linkToCheck = (link) => {
    if (toCheck.start.some(s => link.toLowerCase().startsWith(s))) return false;
    if (toCheck.end.some(s => link.toLowerCase().endsWith(s))) return false;
    if (toCheck.special.some(s => link.toLowerCase().toLowerCase().includes(s))) return true;
    return true;
}

const checkLink = (link) => {
    const [pathWithQs] = link.split('#');
    const [path] = pathWithQs.split('?')
    const pathToCheck = `${docsFolder}/docs${path}`;
    let errors = [];

    if(path.toLowerCase().startsWith('http') || path.toLowerCase().startsWith('https')) {
        if (path.toLowerCase().includes('docs.mia-platform.eu')) errors.push("httpLinkToInternalDocs");
    } else {
        if(!path.toLowerCase().includes('.md') && !path.toLowerCase().includes('.mdx')) errors.push("missingExtension");
        if(path.startsWith('.')) errors.push("relativePath");
        if(!path.startsWith('/')) errors.push("missingStartingSlash");
        if(path.toLowerCase().startsWith('/docs') || path.toLowerCase().startsWith('docs')) errors.push("linkStartWithDocs");
        if(!fs.existsSync(pathToCheck) || !fs.lstatSync(pathToCheck).isFile()) errors.push("fileNotFound");
    }
    return errors.length > 0 ? errors : null;
}

const linksWithErrors = readFiles(docsFolder+'/docs/')
    .flat(Infinity)
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    .reduce((pages, pageLink) => {
        const content = fs.readFileSync(pageLink, 'utf8');
        const links = content.match(/!?\[([^\]]*)\]\(([^)]+)\)/gm);
        const errors = links ? links
            .map(l => l.match(/\[.*\]\((.*)\)/)[1])
            .filter(linkToCheck)
            .map(l => {
                const errors = checkLink(l);
                return errors ? {link: l, errors: errors.join(', ')} : null;
            })
            .filter(r => r) : [];
        if(errors.length > 0) pages[pageLink] = errors;
        return pages;
    }, {});

if(Object.keys(linksWithErrors).length > 0) {
    throw new Error(`Found ${Object.keys(linksWithErrors).length} page with wrong links: ${JSON.stringify(linksWithErrors, null, 2)}`);
}
