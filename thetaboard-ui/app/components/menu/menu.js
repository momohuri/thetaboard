import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class MenuComponent extends Component {
  menuItems = [
    { name: 'dashboard', icon: 'icon-chart-pie-36' },
    { name: 'wallet', icon: 'icon-wallet-43' },
    { name: 'domain', icon: 'icon-book-bookmark' },
    { name: 'guardian', icon: 'icon-atom' },
    { name: 'faq', icon: 'icon-compass-05' },
  ];
  @service router;

  get routeName() {
    return this.router.currentRoute.name;
  }

  get menuItemList() {
    const finalList = [];
    finalList.push(
      ...this.menuItems.map((x) => {
        return {
          name: x.name,
          classActive: this.routeName === x.name,
          icon: x.icon,
        };
      })
    );
    return finalList;
  }

  @action
  transitionTo(event) {
    if ($('#toggler-navigation.toggled').length) {
      $('.navbar-toggle').click();
    }
    return this.router.transitionTo(event.currentTarget.innerText.toLocaleLowerCase());
  }
}
