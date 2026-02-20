const fs = require('fs-extra');
const path = require('path');
const { globSync } = require('glob');
const matter = require('gray-matter');

// IMPOSTA QUESTO A true PER ATTIVARE I LOG DETTAGLIATI
const DEBUG = true;

const normalizeAllLinks = async (directoryPath) => {
    console.log('[INFO] Phase 1: Building an internal map of all files and IDs...');
    const allFiles = globSync(`${directoryPath}/**/*.{md,mdx}`);
    const idToPathMap = new Map();

    for (const filePath of allFiles) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const { data: metadata } = matter(content);
            if (metadata.id) {
                idToPathMap.set(metadata.id, filePath);
            }
        } catch (e) {
            console.error(`[WARN] Could not parse frontmatter for ${filePath}`);
        }
    }
    console.log(`[SUCCESS] Map created with ${idToPathMap.size} unique IDs.`);

    console.log('\n[INFO] Phase 2: Scanning and normalizing links in all markdown files...');
    const linkRegex = /(\[.*?\])\(([^)]+)\)/g;
    const absoluteDirectoryPath = path.resolve(directoryPath);

    for (const currentFilePath of allFiles) {
        let content = await fs.readFile(currentFilePath, 'utf-8');
        let hasChanged = false;

        const newContent = content.replace(linkRegex, (match, linkText, originalUrl) => {
            if (originalUrl.startsWith('http') || originalUrl.startsWith('#') || originalUrl.startsWith('mailto:')) {
                return match;
            }

            const [linkPath, anchor] = originalUrl.split('#');
            const anchorPart = anchor ? `#${anchor}` : '';
            const linkExtension = path.extname(linkPath);

            if (linkExtension && !['.md', '.mdx'].includes(linkExtension.toLowerCase())) {
                return match;
            }

            // --- INIZIO BLOCCO DI DEBUG ---
            if (DEBUG) {
                console.log(`\n----------------------------------------------------`);
                console.log(`> Found link in file: ${path.relative(process.cwd(), currentFilePath)}`);
                console.log(`  - Original URL:      ${originalUrl}`);
            }
            // --- FINE BLOCCO DI DEBUG ---

            let resolvedTargetAbsPath;
            if (linkPath.startsWith('/')) {
                resolvedTargetAbsPath = path.resolve(absoluteDirectoryPath, linkPath.substring(1));
            } else {
                resolvedTargetAbsPath = path.resolve(path.dirname(currentFilePath), linkPath);
            }

            let canonicalFilePath = null;
            const potentialId = path.basename(linkPath);

            if (fs.existsSync(resolvedTargetAbsPath)) {
                canonicalFilePath = resolvedTargetAbsPath;
                if (DEBUG) console.log(`  - Resolution Method:   ✅ Direct path exists`);
            } else if (fs.existsSync(resolvedTargetAbsPath + '.md')) {
                canonicalFilePath = resolvedTargetAbsPath + '.md';
                if (DEBUG) console.log(`  - Resolution Method:   ✅ Direct path + .md exists`);
            } else if (fs.existsSync(resolvedTargetAbsPath + '.mdx')) {
                canonicalFilePath = resolvedTargetAbsPath + '.mdx';
                if (DEBUG) console.log(`  - Resolution Method:   ✅ Direct path + .mdx exists`);
            } else if (idToPathMap.has(potentialId)) {
                canonicalFilePath = path.resolve(idToPathMap.get(potentialId));
                if (DEBUG) console.log(`  - Resolution Method:   ✅ Found by ID lookup ('${potentialId}')`);
            } else {
                if (DEBUG) console.log(`  - Resolution Method:   ❌ FAILED to resolve`);
            }

            if (DEBUG) console.log(`  - Canonical Path:    ${canonicalFilePath ? path.relative(process.cwd(), canonicalFilePath) : 'null'}`);
            // --- FINE BLOCCO DI DEBUG ---

            if (canonicalFilePath) {
                const relativeToDocs = path.relative(absoluteDirectoryPath, canonicalFilePath);
                const standardPath = `/${relativeToDocs.replace(/\\/g, '/')}`;
                const newUrl = standardPath + anchorPart;

                if (newUrl !== originalUrl) {
                    hasChanged = true;
                    // Questo log ora è ridondante con il DEBUG, ma lo lasciamo
                    console.log(`  - In ${path.relative(process.cwd(), currentFilePath)}:\n    > Old: ${originalUrl}\n    > New: ${newUrl}`);
                    return `${linkText}(${newUrl})`;
                }
            }

            return match;
        });

        if (hasChanged) {
            await fs.writeFile(currentFilePath, newContent, 'utf-8');
            console.log(`[SUCCESS] Updated links in ${path.relative(process.cwd(), currentFilePath)}`);
        }
    }

    console.log('\n[SUCCESS] Link normalization complete.');
};

normalizeAllLinks("./docs").catch((err) => {
    console.error('[ERROR] An error occurred during link normalization:', err);
});
