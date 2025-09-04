const path = require('path');
const {Joi} = require('@docusaurus/utils-validation');

function pluginImageZoom() {
  return {
    name: 'docusaurus-image-zoom',

    getClientModules() {
      return [path.resolve(__dirname, './zoom')];
    },
  };
}

const pluginOptionsSchema = Joi.object({});

pluginImageZoom.validateOptions = ({options, validate}) => {
  return validate(pluginOptionsSchema, options);
}

module.exports = pluginImageZoom
