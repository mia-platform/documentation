/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
export default {
  releaseNotes: [
    {
      "label": "v15",
      "type": "category",
      "collapsed": false,
      "link": {"type": "doc", "id": "v15-overview"},
      "items": [
        {"id": "versions", "type": "doc"},
         {"id": "v15.0.0", "type": "doc", "label": "v15.0.0 - Preview"},
      ]
    },
    {
      "id": "stable-versions",
      "type": "doc"
    },
    {
      "id": "roadmap",
      "type": "doc"
    },
    {
      "id": "security-overview",
      "type": "doc"
    },
    {
      "id": "info/version_policy",
      "type": "doc",
    },
    {
      "id": "info/bug_policy",
      "type": "doc",
    },
    {
      "id": "support-policy",
      "type": "doc"
    }
  ],
};
