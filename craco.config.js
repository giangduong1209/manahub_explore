const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@component-background': 'white',
              '@text-color': 'black',
              '@primary-5': 'black',
              '@primary-color': 'darkslategrey',
              '@heading-color': '#FEA013',
              '@layout-header-background': '#001529', //header background
              '@menu-item-active-bg': 'darkslategrey', //menu top color
              '@menu-dark-item-active-bg': 'darkslategrey', //menu top color
              '@link-color': '#FEA013', //green color for text
              '@timeline-dot-bg': 'transparent',
              //table
              '@table-bg': '#001529',
              '@table-header-bg': '#001529',
              '@table-header-color': '#FEA013',
              '@table-row-hover-bg': 'darkslategrey',
              //table pagination
              '@pagination-item-bg': 'transparent',
              '@pagination-item-bg-active':
                'linear-gradient(180deg, #FEA013 0%, #FEA013 100%)',
              //button
              '@btn-link-hover-bg': '#001529',
              //icons
              '@icon-color-hover': '#001529',
              '@icon-color': 'black',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
