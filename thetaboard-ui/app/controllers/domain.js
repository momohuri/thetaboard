import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class DomainController extends Controller {

  @action
  setQueryParam(walletAddress) {
    this.transitionToRoute({ queryParams: { wa: walletAddress } });
  }
}
