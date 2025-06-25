export function cn(...inputs) {
    const classMap = new Map();

    const processInput = (input) => {
        if (!input) return;

        if (typeof input === 'string') {
            input.split(' ').forEach(cls => {
                if (cls.trim() === '') return;
                const [key] = extractTailwindKey(cls);
                classMap.set(key, {value: cls}); // 'order' property removed for simplicity, as it's not strictly necessary for basic merge.
            });
        } else if (Array.isArray(input)) {
            input.forEach(processInput);
        } else if (typeof input === 'object') {
            for (const key in input) {
                if (Object.prototype.hasOwnProperty.call(input, key) && input[key]) {
                    processInput(key);
                }
            }
        }
    };

    // Extracts the "key" of a Tailwind class for conflict resolution.
    // Example: 'p-4' -> 'p', 'text-lg' -> 'text', 'bg-red-500' -> 'bg'
    const extractTailwindKey = (cls) => {
        const match = cls.match(/^(?:(sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|group-hover:|group-focus:|first:|last:|odd:|even:))?([a-z-]+)(?:-|$)/);
        if (match && match[2]) {
            const baseKey = match[2];
            if (['p', 'm', 'px', 'py', 'pt', 'pb', 'pl', 'pr', 'mx', 'my', 'mt', 'mb', 'ml', 'mr'].includes(baseKey) && cls.match(/^(p|m)([xytrbl])?(-\d+)/)) {
                return [match[1] ? match[1] + match[2] : match[2], cls];
            }
            if (['text', 'font', 'leading', 'tracking', 'bg', 'border', 'rounded', 'w', 'h', 'min-w', 'max-w', 'min-h', 'max-h', 'flex', 'grid', 'justify', 'items', 'align', 'gap', 'space', 'order', 'col', 'row', 'z'].includes(baseKey)) {
                return [match[1] ? match[1] + match[2] : match[2], cls];
            }
            return [match[1] ? match[1] + baseKey : baseKey, cls];
        }
        return [cls, cls];
    };

    inputs.forEach(processInput);

    // Converts the map values to a string, maintaining the last-defined class for conflicts.
    return Array.from(classMap.values()).map(item => item.value).join(' ');
}
