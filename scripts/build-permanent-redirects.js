const fs = require('fs');
const path = require('path');

const raw_redirects = require('../301redirects.json');

const output = path.join(__dirname, '..', 'nginx', 'permanent.redirects');
const redirects = Object.keys(raw_redirects).map((key) => `rewrite ^${key}$ ${raw_redirects[key].destination} permanent;`);

fs.writeFileSync(output, redirects.join("\n"));