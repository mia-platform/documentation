const fs = require('fs');

const parseSubtitle = (srt) => {
    const subtitleBlocks = srt.trim().split(/\n\s*\n/);
    const subtitles = subtitleBlocks.map(subtitleBlock => {
        let [timeString, ...textLines] = subtitleBlock.split("\n");
        timeString = textLines[0];
        textLines.shift(); // remove index
        const [startTimeString, endTimeString] = timeString.split(" --> ");
        const text = textLines
            .join("\n")
            .replace(/<[^>]*>/g, "")
            .replace(/\{.*?\}/g, '');
        return {
            startTimeString,
            endTimeString,
            text
        };
    });
    return subtitles;
}

const finalize = (data) => {
    let result = [];
    let currentText = '';
    let currentStart = '';

    data.forEach((item) => {
        //currentText += item.text..replace('\n', ' ');
        currentText += ` ${item.text.replace(/(\r\n|\n|\r)/gm, " ")}`;
        if (!currentStart) {
            currentStart = item.startTimeString;
        }

        if (currentText.trim().includes('.')) {
            result.push({
                startTimeString: currentStart.replace(/(\r\n|\n|\r)/gm, " "),
                endTimeString: item.endTimeString.replace(/(\r\n|\n|\r)/gm, " "),
                text: currentText.replace(/ +(?= )/g,'').trim(),
            });

            currentText = '';
            currentStart = '';
        }
    });

    return result;
}

function parseString(str) {
    const matches = str.match(/\[(.*?)\](.*?)\.srt/);

    if (matches && matches.length === 3) {
        const id = matches[1];
        const name = matches[2];
        return {id, name};
    }

    return null;
}

fs.readdirSync(process.argv[2]).forEach(file => {
    if (file.endsWith('.srt')) {
        const subtitlePath = process.argv[2]+file;
        const {id, name} = parseString(file);
        const subtitleContent = fs.readFileSync(subtitlePath, 'utf8');
        const parsed = parseSubtitle(subtitleContent);
        const final = finalize(parsed);
        const output = {
            videoId: id,
            subtitles: final
        }

        const outputPath = process.argv[3] ? process.argv[3] : process.argv[2];
        fs.writeFileSync(outputPath + name + '.json', JSON.stringify(output, null, 2));
    }
});
