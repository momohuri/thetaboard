'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {

    // Add options here
    fingerprint: {
      enabled: false
    },
    SRI: {
      enabled: false,
    },
    autoImport: {
      webpack: {
        node: {
          Buffer: false,
          global: true,
          process: true,
        },
      }
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('vendor/black-dashboard/js/core/jquery.min.js');
  app.import('vendor/black-dashboard/js/core/popper.min.js');
  app.import('vendor/black-dashboard/js/plugins/perfect-scrollbar.jquery.min.js');
  app.import('vendor/black-dashboard/js/plugins/chartjs.min.js');
  app.import('vendor/black-dashboard/js/plugins/chartjs-plugin-datalabels.min.js');
  app.import('vendor/black-dashboard/js/black-dashboard.js');

  app.import('vendor/black-dashboard/js/core/bootstrap.min.js');
  app.import('vendor/black-dashboard/js/plugins/bootstrap-notify.js');

  // smart contracts:
  // app.import('node_modules/web3-utils/src/index.js');


  return app.toTree();
};
