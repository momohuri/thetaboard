import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  queryParams = ['wa'];

  @tracked wa;

  @action
  setQueryParam(walletAddress) {
    this.wa = walletAddress;
  }
}
