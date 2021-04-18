import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class MenuComponent extends Component {
  menuItems = [
    { name: 'dashboard', icon: 'icon-chart-pie-36' },
    { name: 'wallet', icon: 'icon-wallet-43' },
    // { name: 'domain', icon: 'icon-book-bookmark' },
    { name: 'guardian', icon: 'icon-atom' },
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
}
