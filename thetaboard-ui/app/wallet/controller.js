import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class WalletController extends Controller {
  @action
  setQueryParam(walletAddress) {
    this.transitionToRoute({ queryParams: { wa: walletAddress } });
  }
}
