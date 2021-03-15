import Route from '@ember/routing/route';

export default class DashboardRoute extends Route {
  async model() {
    const response = await fetch('/wallet-info/0xa60f2744347d68f46822c89bdfbacfcc3e46f1b0');
    const wallet_info = await response.json();
    return { wallet_info };
  }
}
