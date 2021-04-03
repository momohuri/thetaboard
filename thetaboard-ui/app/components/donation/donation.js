import Component from '@glimmer/component';
import { getOwner } from '@ember/application';
import { action } from '@ember/object';

export default class DonationDonationComponent extends Component {
  get thetaSdk() {
    return getOwner(this).lookup('service:theta-sdk');
  }

  get utils() {
    return getOwner(this).lookup('service:utils');
  }

  @action
  async donation() {
    try {
      const donation = await this.thetaSdk.donation();
      if (donation.hash) {
        this.utils.successNotify('Thanks for your donation!!');
      } else {
        this.utils.errorNotify('Something went wrong, please try again');
      }
    } catch (error) {
      this.utils.errorNotify(error.message);
    }
  }
}
