import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class DownloadWalletModalComponent extends Component {
  @action
  setupEventListener() {
    $('#downloadThetaExtension').on('hidden.bs.modal', () => {
      $('button.connect-wallet-button').removeClass("disabled");
    });
  }
}
