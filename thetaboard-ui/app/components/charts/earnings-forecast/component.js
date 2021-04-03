import Component from '@glimmer/component';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';


export default class EarningsProjectionsComponent extends Component {
  @service('theta-sdk') thetaSdk;

  @tracked avg_tfuel_per_day = 0;
  @tracked avg_tfuel_per_year = 0;

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  get avg_tfuel_per_month() {
    return this.avg_tfuel_per_day * 30;
  }

  get avg_tfuel_per_day_dollar() {
    let value = 0;
    if (this.args.walletInfo.wallets.length) {
      value = this.avg_tfuel_per_day * this.args.walletInfo.wallets[1].market_price
    }
    return this.formatter.format(value);
  }

  get avg_tfuel_per_month_dollar() {
    let value = 0;
    if (this.args.walletInfo.wallets.length) {
      value = this.avg_tfuel_per_month * this.args.walletInfo.wallets[1].market_price;
    }
    return this.formatter.format(value);
  }

  get avg_tfuel_per_year_dollar() {
    let value = 0;
    if (this.args.walletInfo.wallets.length) {
      value = this.avg_tfuel_per_year * this.args.walletInfo.wallets[1].market_price
    }
    return this.formatter.format(value);
  }


  _groupByDay(accumulator, currentValue) {
    let d = new Date(currentValue['timestamp']);
    d = d.toISOString().split('T')[0];
    accumulator[d] = accumulator[d] || 0;
    accumulator[d] += currentValue.value[1].amount;
    return accumulator;
  }

  async _getAvgTfuelPerDay() {
    const account = await this.thetaSdk.getThetaAccount();
    const transactions = await this.thetaSdk.getTransactions(account, 1, 100);
    const reward_transactions = transactions.transactions.filter((x) => x.type === 0);
    const day_groups = reward_transactions.reduce(this._groupByDay, {});
    // remove first and last date as they might not be complete
    if (Object.keys(day_groups).length > 2) {
      delete day_groups[Object.keys(day_groups)[0]];
      delete day_groups[Object.keys(day_groups)[Object.keys(day_groups).length - 1]];
    }
    const sum = Object.values(day_groups).reduce((a, b) => a + b, 0);
    this.avg_tfuel_per_day = (sum / Object.keys(day_groups).length) || 0;
    return this.avg_tfuel_per_day;
  }

  async chartData() {
    const avg_tfuel_per_day = await this._getAvgTfuelPerDay();
    const labels = [];
    for (let i = 0; i < 13; i++) {
      labels.push(moment().add(i, 'months'));
    }
    const data = labels.reduce((acc, curr, index) => {
      if (acc[index - 1]) {
        acc.push(acc[index - 1] + avg_tfuel_per_day * curr.daysInMonth());
      } else {
        acc.push(avg_tfuel_per_day * curr.daysInMonth());
      }
      return acc;
    }, []);

    this.avg_tfuel_per_year = data[data.length - 1];
    return {
      labels: labels,
      datasets: [
        {
          label: "Tfuel",
          yAxisID: 'tfuel',
          pointStyle: 'point',
          radius: 0,
          borderColor: '#FFA500',
          pointBackgroundColor: '#FFA500',
          data: data,
          borderDash: [10, 5]
        }]
    };
  }

  @action
  async setupChart() {
    const element = document.getElementById("forecastChart");
    const gradientChartOptionsConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          title: (tooltipItem, data) => {
            return moment(new Date(tooltipItem[0].label)).format('LL')
          },
        },
        backgroundColor: '#fff',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          id: "tfuel",
          type: 'linear',
          position: 'right',
          ticks: {
            min: 0,
            fontColor: "#FFA500",
            beginAtZero: true,
            maxTicksLimit: 10,
          },
        }],

        xAxes: [{
          type: 'time',
          time: {
            unit: 'month'
          },
          ticks: {
            min: 0,
            fontColor: "#ccc",
            beginAtZero: true,
            maxTicksLimit: 10,
          },
        }],
      },
      plugins: {
        datalabels: {
          display: () => {
            return null;
          }, // This is a hack so it doesn't display any label
        }
      },
    };
    const ctx = element.getContext("2d");
    const data = await this.chartData();
    new Chart(ctx, {
      type: 'line',
      data: data,
      options: gradientChartOptionsConfiguration
    });
  }
}
