// git ls-tree -r --name-only HEAD docs -z | TZ=UTC xargs -0n1 -I_ git --no-pager log -1 --date=iso-local --format="%ad _" -- _ | grep -E '.*\.(md|mdx)' | sort -r > output-file.txt
const fs = require('fs');
const fm = require('front-matter');
const execSync = require('child_process').execSync;

const blacklist = [
    "Changelog",
    "Version"
]


const command = `git ls-tree -r --name-only HEAD docs -z | TZ=UTC xargs -0n1 -I_ git --no-pager log -1 --date=iso-local --format="%ad _" -- _ | grep -E '.*\\.(md|mdx)' | sort -r`
/*const command = `git log main --pretty=%x0a%ci --name-only --diff-filter=A | grep -E '.*\\.(md|mdx)' \\
| awk '
     /^$/        { dateline=!dateline; next }
     dateline    { date=$0; next }
     !seen[$0]++ { print date,$0 }
'`*/

const files = execSync(command, { encoding: 'utf-8' });
const newLinks = files.split('\n');

const homepageLinks = newLinks.map(page => {
    if(page !== '') {
        const [date, hour, timezone, link] = page.split(" ");
        const content = fs.readFileSync(link, {encoding: 'utf8'});
        const head = fm(content);
        const {id, title} = {...head.attributes};

        const uriPart = link.split('/');
        uriPart.splice(-1, 1, id);

        const url = `${uriPart.join('/').replace("docs/", "/")}`;

        return {
            title,
            url
        }
    } else {
        console.log("Error on: ", page);
        return null;
    }
}).filter(u => u !== null).filter(u => blacklist.every(s => !u.title.toLowerCase().includes(s.toLowerCase())));

fs.writeFileSync("./src/components/LastPages/links.json", JSON.stringify(homepageLinks, null, 2));
