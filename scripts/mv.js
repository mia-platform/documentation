const fs = require('fs-extra');
const path = require('path');
const {globSync} = require('glob');
const matter = require('gray-matter');
const prompts = require('prompts');
const CWD = process.cwd();

const log = (level, message, details) => {
    const prefixMap = {
        INFO: '[INFO]',
        SUCCESS: '[SUCCESS]',
        ERROR: '[ERROR]',
        REDIRECT: '[REDIRECT]',
        'LINK UPDATE': '[LINK UPDATE]',
    };
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
        oldLogicalPath,
        newLogicalPath,
        newPhysicalPath: newFilePath,
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
            }
        }
    } catch (error) {
        console.error(`Error during cleanup: ${error.message}`);
    }
};

const normalizeForRedirect = (filePath) => {
    if (!filePath) return null;
    // Questa logica ora gestisce percorsi relativi puliti
    return path.join('/', filePath.replace('./', '')).replace(/\\/g, '/');
};

const makeRedirect = (redirectsPath, oldPath, newPath) => {
    if (!oldPath || !newPath) {
        console.error(`[ERROR] Redirect creation skipped due to invalid paths.`, oldPath, newPath);
        return;
    }
    let redirects = {};
    const normOldPath = normalizeForRedirect(oldPath);
    const normNewPath = normalizeForRedirect(newPath);
    try {
        if (fs.pathExistsSync(redirectsPath)) {
            redirects = fs.readJsonSync(redirectsPath);
        }
        const today = new Date().toISOString().split('T')[0];
        for (const sourceRedirect in redirects) {
            if (redirects[sourceRedirect].destination === normOldPath) {
                redirects[sourceRedirect].destination = normNewPath;
            }
        }
        redirects[normOldPath] = {
            destination: normNewPath,
            addedOn: today,
        };
        fs.writeJsonSync(redirectsPath, redirects, {spaces: 2});
        return redirects;
    } catch (error) {
        console.error(`[ERROR] Failed to update redirects: ${error.message}`);
        return redirects;
    }
};

const updateAllLinks = (newPhysicalPath, oldLogicalPath, oldPhysicalPath) => {
    try {
        const docsDir = './docs';
        const allMarkdownFiles = globSync(`${docsDir}/**/*.{md,mdx}`);
        for (const currentFilePath of allMarkdownFiles) {
            let content = fs.readFileSync(currentFilePath, 'utf-8');

            const newPhysicalPathParsed = newPhysicalPath.replace(/^docs\//, '/');
            const oldPhysicalPathParsed = oldPhysicalPath.replace(/^docs\//, '/');

            const newContent = content.replaceAll(`${oldPhysicalPathParsed}`, `${newPhysicalPathParsed}`);
            fs.writeFileSync(currentFilePath, newContent, 'utf-8');
        }
    } catch (e) {
        console.error(`[ERROR] Failed to update links: ${e.message}`);
    }
};

const main = async () => {
    console.log("Starting move operation...");
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        process.exit(1);
    }

    const [source, destination] = args;

    if (!await fs.pathExists(source)) {
        console.error(`Source path does not exist: ${source}`);
        process.exit(1);
    }

    let mapping = createMapping('./docs');
    const toMoveFiles = listAllFiles(source);

    toMoveFiles.forEach((filePath, index) => {
        console.log(`Processing: ${index+1}/${toMoveFiles.length} - File: ${filePath}`);
        const newFilePath = moveFile(source, destination, filePath);
        if(newFilePath && (path.extname(filePath).toLowerCase() === '.md' || path.extname(filePath).toLowerCase() === '.mdx')) {
            const updatePaths = updateMappingAfterMove(mapping, filePath, newFilePath);
            mapping = { ...updatePaths.mapping };
            const { newLogicalPath, newPhysicalPath, oldLogicalPath, oldPhysicalPath } = updatePaths;
            makeRedirect("./301redirects.json", oldLogicalPath, newLogicalPath);
            updateAllLinks(newPhysicalPath, oldLogicalPath, oldPhysicalPath)
        }
    });

    cleanupEmptyFolders(path.resolve(CWD, source));
    console.log("Move operation completed.");
}

main();
