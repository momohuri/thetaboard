import Controller from '@ember/controller';
import { action } from '@ember/object';
import { set } from '@ember/object';

export default class ApplicationController extends Controller {
  queryParams = ['wa'];
  
  @action
  setQueryParam(walletAddress) {
    set(this, 'wa', walletAddress);
  }
}
