// .prettierrc.cjs
module.exports = {
    // la configurazione qui sotto è quella usata da Docusaurus stesso
    plugins: [require.resolve('@ianvs/prettier-plugin-sort-imports')],
    importOrder: [
        '<BUILTIN_MODULES>',
        '',
        '^react$',
        '',
        '<THIRD_PARTY_MODULES>',
        '',
        '^@docusaurus/(.*)$',
        '',
        '^@site/(.*)$',
        '',
        '^@theme/(.*)$',
        '',
        '^[./]',
    ],
    importOrderParserPlugins: ['typescript', 'jsx'],
    importOrderTypeScriptVersion: '5.0.0',
    bracketSpacing: false,
    singleQuote: true,
    trailingComma: 'all',
    arrowParens: 'avoid',
    endOfLine: 'lf',
};
