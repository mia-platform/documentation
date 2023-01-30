
// read sidebar json from file
const sidebars = require('../sidebars.json');

function extractIds(obj) {
    let ids = [];

    function traverse(obj) {
        for (let key in obj) {
            if (key === "id") {
                ids.push(obj[key]);
            }
            if (typeof obj[key] === "object") {
                if (Array.isArray(obj[key])) {
                    for (let item of obj[key]) {
                        traverse(item);
                    }
                } else {
                    traverse(obj[key]);
                }
            }
        }
    }

    traverse(obj);
    return ids;
}

function findDuplicates(arr) {
    let result = [];
    let frequency = {};

    for (let str of arr) {
        if (frequency[str]) {
            result.push(str);
        } else {
            frequency[str] = 1;
        }
    }

    return result;
}


const links = extractIds(sidebars);
const duplicates = findDuplicates(links);

if(duplicates.length > 0) {
    throw new Error(`Found duplicate links in sidebar: ${duplicates}`);
}