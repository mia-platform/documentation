const js = require("@eslint/js");
const pluginReact = require("eslint-plugin-react");
const babelParser = require("@babel/eslint-parser");

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
    js.configs.recommended,
    {
        files: ["**/*.js", "**/*.jsx"],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    presets: ["@babel/preset-react"]
                },
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                window: "readonly",
                document: "readonly"
            }
        },
        linterOptions: {
            reportUnusedDisableDirectives: "off",
        },
        plugins: {
            react: pluginReact
        },
        settings: {
            react: {version: "detect"}
        },
        rules: {
            "no-console": "error",
            "no-unused-vars": "off",
            "no-undef": "off",
            "no-unused-eslint-disable": "off",
            "object-curly-spacing": ["error", "never"],
            "operator-linebreak": ["error", "after"],

            "react/jsx-closing-bracket-location": "error",
            "react/jsx-curly-brace-presence": "off",
            "react/jsx-first-prop-new-line": "error",
            "react/jsx-no-literals": "error",
            "react/jsx-sort-props": "error",
            "react/jsx-wrap-multilines": [
                "error",
                {
                    declaration: "parens-new-line",
                    assignment: "parens-new-line",
                    return: "parens-new-line",
                    arrow: "parens-new-line"
                }
            ],
            "react/no-multi-comp": ["error", { ignoreStateless: true }],
            "react/no-unused-prop-types": "error",
            "react/no-unused-state": "error",
            "react/sort-prop-types": "error",
            "react/sort-comp": [
                "error",
                {
                    order: ["static-methods", "lifecycle", "everything-else", "render"]
                }
            ]
        }
    },
    {
        ignores: [
            "build/**",
            "node_modules/**",
            "static/**",
            ".docusaurus/**",
            "scripts/**",
            "**/*.config.js"
        ]
    }
];
