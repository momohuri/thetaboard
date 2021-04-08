import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TrendThetaComponent extends Component {
  constructor(...args) {
    super(...args);
    this.trendLastWeek = {};
    this.trendYesterday = {};
    this.initialize();
  }
  @service('theta-sdk') thetaSdk;

  @tracked trendLastWeek;
  @tracked trendYesterday;

  async initialize() {
    return this.getDates().then((dates) => {
      const prices = this.args.historic_price;
      const thetaPrice = this.thetaSdk.prices.theta.price;
      this.trendLastWeek = this.setTrend(thetaPrice, prices[dates.lastWeek].theta_price);
      this.trendYesterday = this.setTrend(thetaPrice, prices[dates.yesterday].theta_price);
    });
  }

  setTrend(currentPrice, previousPrice) {
    const change = Math.round(((currentPrice - previousPrice) + Number.EPSILON) * 100) / 100;
    const percentChange = Math.round(((change / previousPrice * 100) + Number.EPSILON) * 100) / 100;
    return {
      type: percentChange < 0 ? '-' : '+',
      class: percentChange < 0 ? 'down' : 'up',
      change: change < 0 ? -change : change,
      percentChange: percentChange < 0 ? -percentChange : percentChange,
    };
  }

  async getDates() {
    const yesterday = await moment(new Date(new Date() -3600000*24)).format('YYYY-MM-DD');
    const lastWeek = await moment(new Date(new Date() -3600000*24*7)).format('YYYY-MM-DD');
    return { yesterday: yesterday, lastWeek: lastWeek };
  }
}
