export function parseTypescript(text: string): string {
    const cr = '\r\n';
    const lines = text.split(cr);
    const results: string[] = [];
    lines.forEach(line => {
        if (line.includes('class')) {
            const tokens = line.split(' ');
            const className = tokens[tokens.length - 1];
            line = `export interface ${className} {`;
        } else if (line.trim() === '{') {
            line = '';
        } else if (line.includes('get;')) {
            const tokens = line.split(' ').filter(x => x !== '');
            const fieldName = lowercase(tokens[2]).replace(';', '');
            const type = parseType(tokens[1]);
            line = `${fieldName}: ${type};`;
        }
        results.push(line);
    });
    return results.filter(x => x !== '').join(cr);
}

export function lowercase(str: string) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export function parseType(type: string) {
    const types = [
        { key: 'number', value: ['int', 'long', 'float', 'double', 'short', 'decimal'] },
        { key: 'string', value: ['string'] },
        { key: 'Date', value: ['DateTime', 'DateTime?'] },
        { key: 'boolean', value: ['bool', 'bool?'] }
    ];
    return types.find(x => x.value.includes(type))?.key;
}
