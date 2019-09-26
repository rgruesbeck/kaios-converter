const Koji = require('@withkoji/vcc').default;

const styles = `
    * {
        font-family: ${Koji.config.settings.fontFamily};
    }

    body {
        background-color: ${Koji.config.colors.bodyBackground};
        color: ${Koji.config.colors.textColor};
    }

    .container {
      display: flex;
      flex-direction: column;
      height: 100%;
      margin: 5px;
    }
`;

module.exports.default = styles;
