import Service from '@ember/service';
import { action } from '@ember/object';

export default class UtilsService extends Service {
  @action
  copyToClipboard(textToCopy, message) {
    const el = document.createElement('textarea');
    el.value = textToCopy;
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
        message: message,
      },
      { type: 'success' }
    );
  }

  @action
  walletAddress(address) {
    if (Array.isArray(address)) {
      address = address[0];
    }
    debugger
    if (address && address.length == 42) {
      const front = address.substr(0, 4);
      const end = address.substr(-4);
      address = `${front}...${end}`;
    }
    return address;
  }

  @action
  errorNotify(message) {
    $.notify(
      {
        icon: 'glyphicon glyphicon-success-sign',
        title: 'Error',
        message: message,
      },
      { type: 'danger' }
    );
  }

  @action
  successNotify(message) {
    $.notify(
      {
        icon: 'glyphicon glyphicon-success-sign',
        title: 'Success!',
        message: message,
      },
      { type: 'success' }
    );
  }
}
