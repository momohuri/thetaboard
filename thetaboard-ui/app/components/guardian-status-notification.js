import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class GuardianStatusNotificationComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  @service('guardian') guardian;

  @action
  copyToClipboard() {
    const el = document.createElement('textarea');
    el.value = this.guardian.messages.join("|");
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    $.notify(
      {
        icon: 'glyphicon glyphicon-success-sign',
        title: 'Success!!',
        message: 'Guardian node status copied to clipboard',
      },
      { type: 'success' }
    );
  }
}
