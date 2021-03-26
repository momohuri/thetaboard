import Ember from 'ember';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default class GuardianStatusComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  @service('theta-sdk') thetaSdk;
  @service('guardian') guardian;
}
