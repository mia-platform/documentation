/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const raw_redirects = require('../301redirects.json');

console.log('Generating permanent redirects');

const output = path.join(__dirname, '..', 'nginx', 'permanent.redirects');
const redirects = Object.keys(raw_redirects).map((key) => `rewrite ^${key}$ ${raw_redirects[key].destination} permanent;`);

console.log(`Generated ${redirects.length} permanent redirects`);

fs.writeFileSync(output, redirects.join("\n"));
