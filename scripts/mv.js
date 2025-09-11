const fs = require('fs-extra');
const path = require('path');
const {globSync} = require('glob');
const matter = require('gray-matter');
const prompts = require('prompts');
const CWD = process.cwd();


// --- LOGGER UTILITY ---
const log = (level, message, details) => {
    const prefixMap = {
        INFO: '[INFO]',
        SUCCESS: '[SUCCESS]',
        ERROR: '[ERROR]',
        REDIRECT: '[REDIRECT]',
        'LINK UPDATE': '[LINK UPDATE]',
    };
    console.log(`\n${prefixMap[level] || '[LOG]'} ${message}`);
    if (details) {
        console.log(`  - From: ${details.from}`);
        console.log(`  - To:   ${details.to}`);
    }
};

const createMapping = (directoryPath) => {
    const files = globSync(`${directoryPath}/**/*.{md,mdx}`);
    const fileMap = {};

    const linkRegex = /!?!?\[[^\]]*\]\(([^)]+)\)/g;

    for (const filePath of files) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const {data: metadata, content: markdownContent} = matter(content);

            const links = [];
            const images = [];
            const external_links = [];

            let match;
            while ((match = linkRegex.exec(markdownContent)) !== null) {
                const url = match[1];
                if (url.startsWith('http://') || url.startsWith('https://')) {
                    external_links.push(url);
                } else if (/\.(jpg|jpeg|png|gif|svg|webp|avif)$/i.test(url)) {
                    images.push(url);
                } else {
                    links.push(url);
                }
            }

            const fileId = metadata.id || null;
            let logicalPath = null;

            if (fileId) {
                const dirName = path.dirname(filePath);
                logicalPath = path.join(dirName, fileId).replace(/\\/g, '/');
            }

            const fileDetails = {
                id: fileId,
                physical_path: filePath,
                logical_path: logicalPath,
                links,
                images,
                external_links,
                metadata,
            };

            fileMap[filePath] = fileDetails;

            if (logicalPath) {
                fileMap[logicalPath] = fileDetails;
            }

        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        }
    }

    return fileMap;
};

const listAllFiles = (inputPath) => {
    try {
        const resolvedInputPath = path.resolve(inputPath);
        const projectRoot = process.cwd();

        if (!fs.existsSync(resolvedInputPath)) {
            console.error(`Error: Path not found at ${resolvedInputPath}`);
            return [];
        }

        const stats = fs.statSync(resolvedInputPath);

        if (stats.isFile()) {
            const relativePath = path.relative(projectRoot, resolvedInputPath);
            return [path.join('./', relativePath).replace(/\\/g, '/')];
        }

        if (stats.isDirectory()) {
            const pattern = path.join(resolvedInputPath, '**/*').replace(/\\/g, '/');
            const absoluteFiles = globSync(pattern, { nodir: true });

            return absoluteFiles.map(file => {
                const relativePath = path.relative(projectRoot, file);
                return path.join('./', relativePath).replace(/\\/g, '/');
            });
        }

        return [];
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
        return [];
    }
};

const moveFile = (sourcePath, destinationPath, filePath) => {
    try {
        const relativePath = path.relative(sourcePath, filePath);
        const finalDestinationPath = path.join(destinationPath, relativePath);
        fs.moveSync(filePath, finalDestinationPath, { overwrite: true });

        console.log(`Successfully moved ${filePath} to ${finalDestinationPath}`);
        return finalDestinationPath;

    } catch (error) {
        console.error(`Error moving file ${filePath}:`, error);
        return null;
    }
};

const updateMappingAfterMove = (mapping, oldFilePath, newFilePath) => {
    if (!mapping[oldFilePath]) {
        console.error(`Error: Could not find old file path in mapping: ${oldFilePath}`);
        return mapping;
    }

    const fileDetails = mapping[oldFilePath];

    const oldPhysicalPath = fileDetails.physical_path;
    const oldLogicalPath = fileDetails.logical_path;

    let newLogicalPath = null;
    if (fileDetails.id) {
        const newDirName = path.dirname(newFilePath);
        newLogicalPath = path.join(newDirName, fileDetails.id).replace(/\\/g, '/');
    }

    fileDetails.physical_path = newFilePath;
    fileDetails.logical_path = newLogicalPath;

    delete mapping[oldFilePath];
    if (oldLogicalPath && mapping[oldLogicalPath]) {
        delete mapping[oldLogicalPath];
    }

    mapping[newFilePath] = fileDetails;
    if (newLogicalPath) {
        mapping[newLogicalPath] = fileDetails;
    }

    return {
        mapping,
        oldPhysicalPath,
        oldLogicalPath
    };
};

const cleanupEmptyFolders = (basePath) => {
    try {
        const allPaths = globSync(path.join(basePath, '**/*'), { nodir: false });
        const allDirs = allPaths.filter(p => fs.statSync(p).isDirectory());
        allDirs.push(basePath);

        allDirs.sort((a, b) => b.length - a.length);

        for (const dir of allDirs) {
            const files = fs.readdirSync(dir);
            if (files.length === 0) {
                fs.rmdirSync(dir);
                log('INFO', `Cleaned up empty folder: ${path.relative(CWD, dir)}`);
            }
        }
    } catch (error) {
        log('ERROR', `An error occurred during cleanup: ${error.message}`);
    }
};

const normalizeForRedirect = (filePath) => {
    if (!filePath) return null;

    const docsIndex = filePath.indexOf('docs');
    if (docsIndex !== -1) {
        const webPath = `/${filePath.substring(docsIndex)}`;
        return webPath.replace(/\\/g, '/');
    }

    return path.join('/', filePath.replace('./', '')).replace(/\\/g, '/');
};

const makeRedirect = async (redirects, oldPath, newPath) => {
    if (!oldPath || !newPath) {
        console.error(`[ERROR] Redirect creation skipped due to invalid paths.`);
        return;
    }

    const normOldPath = normalizeForRedirect(oldPath);
    const normNewPath = normalizeForRedirect(newPath);

    try {
        const today = new Date().toISOString().split('T')[0];


        for (const sourceRedirect in redirects) {
            if (redirects[sourceRedirect].destination === normOldPath) {
                redirects[sourceRedirect].destination = normNewPath;
                console.log(`[SUCCESS] Chained redirect updated: ${sourceRedirect} -> ${normNewPath}`);
            }
        }

        redirects[normOldPath] = {
            destination: normNewPath,
            addedOn: today,
        };
        console.log(`[SUCCESS] Redirect rule created/updated: ${normOldPath} -> ${normNewPath}`);

        return redirects;

    } catch (error) {
        console.error(`[ERROR] Failed to update redirects: ${error.message}`);
    }
};

const main = async () => {
    console.log(process.argv.slice(2));
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        log('ERROR', 'Usage: npm run mv -- <source_path> <destination_path>');
        process.exit(1);
    }

    const [source, destination] = args.map(p => path.resolve(CWD, p));

    if (!await fs.pathExists(source)) {
        log('ERROR', `Source path does not exist: ${source}`);
        process.exit(1);
    }

    log('INFO', 'Starting pre-scan and ID mapping...');
    let mapping = createMapping('./docs');
    log('SUCCESS', `Mapping complete. Found ${Object.keys(mapping).length / 2} unique IDs.`);

    log('INFO', 'Starting mapping files to move...');
    const toMoveFiles = listAllFiles(source);
    log('SUCCESS', `Mapping files to move complete. Found ${toMoveFiles.length} files.`);

    let redirectsContent = null;
    if (fs.pathExistsSync("./301redirects.json")) {
        redirectsContent = fs.readJsonSync("./301redirects.json");
    }

    toMoveFiles.forEach((filePath, index) => {
        console.log(`${index + 1}. ${filePath}`);
        const newFilePath = moveFile(source, destination, filePath);
        if(newFilePath) {
            log('SUCCESS', `Moved file: ${filePath} to ${toMoveFiles}`);
            const updatePaths = updateMappingAfterMove(mapping, filePath, newFilePath);
            mapping = { ...updatePaths.mapping };
            const { oldPhysicalPath, oldLogicalPath } = updatePaths;
            const newLogicalPath = mapping[newFilePath] ? mapping[newFilePath].logical_path : null;
            cleanupEmptyFolders(source);
            if(redirectsContent) {
                redirectsContent = makeRedirect(redirectsContent, oldLogicalPath, newLogicalPath);
            }
        } else {
            log('ERROR', `Failed to move file: ${filePath}`);
        }
    });

    if(redirectsContent) {
        fs.writeJsonSync("./301redirects.json", redirectsContent, { spaces: 2 });
    }

    log('SUCCESS', 'Operation completed successfully!');


}

main();
