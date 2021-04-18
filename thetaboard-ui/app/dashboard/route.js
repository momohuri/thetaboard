import Route from '@ember/routing/route';

export default class DashboardRoute extends Route {
  async model() {
    debugger
    const oneYearBack = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    const historicPrice = await fetch(
      `https://www.thetascan.io/api/price/?start_date=${oneYearBack}&end_date=${today}`
    );
    return {
      historicPrice: await historicPrice.json(),
    };
  }
}
