import EmberRouter from '@ember/routing/router';
import config from 'thetaboard-ui/config/environment';

export default class Router extends EmberRouter {
  constructor(...args) {
    super(...args);
    let pathNames = window.location.pathname.split('/');
    pathNames.shift();
    if (pathNames.length == 2) {
      config.rootURL = `${pathNames[0]}/`;
    }
  }

  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('dashboard', { path: '/' });
  this.route('guardian');
  this.route('wallet');
  this.route('domain');
  this.route('faq');
  this.route('deployment');
  this.route('not-found', { path: '/*path' });
});
