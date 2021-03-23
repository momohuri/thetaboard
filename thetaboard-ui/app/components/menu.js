import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class MenuComponent extends Component {
  menuItems = ['dashboard', 'wallet', 'guardian'];
  @service router;

  get routeName() {
    return this.router.currentRoute.name;
  }

  get menuItemList() {
    const finalList = [];
    finalList.push(
      ...this.menuItems.map((x) => {
        return {
          name: x,
          classActive: this.routeName === x,
        };
      })
    );
    return finalList;
  }
}
