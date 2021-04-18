import Controller from '@ember/controller';
import {getOwner} from '@ember/application';
import {action} from '@ember/object';


export default class GuardianController extends Controller {
  summary = '0x4417fFbb5A04611DecCCd9Fe9529f98742664690b4d1aa4e65dd2fa44f7990528d63ccf1dd6a6b1a7442d57a52ab4ce6d9a4a3b97597546d07675d4260acee5dd4e179a9adbf76d937a5942fc9dd4de0247bd3a74511294495336ebd84647c974ab9ae022d93741d3a4a6314463f7f619fadcf1517c6995ed8120084b88565cc9cc6d5bf95dc764fcc7d29f29748fa5aa21ddc7410f3926fc4b140b66903b4a141d9e11fa18ebe4ce6e4d1057b550bb37061c7d9724d6d15b98f73648fe9e10e35d26e6044b61a4d0cd39dc11c378eb8085cb6f843adf61efb0b930521b2fffdde6511c401';

  get utils() {
    return getOwner(this).lookup('service:utils');
  }

  get guardian() {
    return getOwner(this).lookup('service:guardian');
  }

  get envManager() {
    return getOwner(this).lookup('service:env-manager');
  }

  @action
  copySummaryToClipBoard(label, summary) {
    this.utils.copyToClipboard(
      summary,
      `${label} was successfully copied to your clipboad`
    );
  }
}
