import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class GuardianStatusNotificationComponent extends Component {
  constructor(...args) {
    super(...args);
  }
  @tracked arr = [];

  get isError() {
    let { guardianStatus } = this.args;
    return guardianStatus.status == 'error';
  }

  get isSyncing() {
    let { guardianStatus } = this.args;
    return guardianStatus.status == 'syncing';
  }

  get isReady() {
    let { guardianStatus } = this.args;
    return guardianStatus.status == 'ready';
  }

  get messages() {
    let { guardianStatus } = this.args;
    for (let i in guardianStatus.msg)
      this.arr.push([i + ': ' + guardianStatus.msg[i]]);
    return this.arr;
  }

  @action
  copyToClipboard() {
    const el = document.createElement('textarea');
    el.value = this.arr.join();
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
