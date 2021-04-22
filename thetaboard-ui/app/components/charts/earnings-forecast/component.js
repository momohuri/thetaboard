import Component from '@glimmer/component';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';

export default class EarningsProjectionsComponent extends Component {
  @service('theta-sdk') thetaSdk;
  account = '';
  walletLength = 0;

  @tracked avg_tfuel_per_day = 0;
  @tracked avg_tfuel_per_year = 0;

  @tracked thetaAmount = 1000;
  @tracked transactions = [];

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  get setUpChart() {
    if (this.thetaSdk.currentAccount != this.account || this.walletLength != this.thetaSdk.wallets.length) {
      this.account = this.thetaSdk.currentAccount;
      this.walletLength = this.thetaSdk.wallets.length;
      const guardian = this.thetaSdk.wallets.filter((x) => x.type === 'guardian');
      if (guardian.length > 1) {
        this.thetaAmount = Math.round(guardian.reduce((a, b) => a + b.amount, 0));
      } else if (guardian.length > 0) {
        this.thetaAmount = guardian.amount;
      }
      this.transactions = this.thetaSdk.transactions;
      this.setupChart();
    }
  }

  get avg_tfuel_per_month() {
    return this.avg_tfuel_per_day * 30;
  }

  get avg_tfuel_per_day_dollar() {
    let value = 0;
    if (this.thetaSdk.prices.tfuel) {
      value = this.avg_tfuel_per_day * this.thetaSdk.prices.tfuel.price;
    }
    return this.formatter.format(value);
  }

  get avg_tfuel_per_month_dollar() {
    let value = 0;
    if (this.thetaSdk.prices.tfuel) {
      value = this.avg_tfuel_per_month * this.thetaSdk.prices.tfuel.price;
    }
    return this.formatter.format(value);
  }

  get avg_tfuel_per_year_dollar() {
    let value = 0;
    if (this.thetaSdk.prices.tfuel) {
      value = this.avg_tfuel_per_year * this.thetaSdk.prices.tfuel.price;
    }
    return this.formatter.format(value);
  }

  get chartData() {
    this.avg_tfuel_per_day = this.thetaAmount * 0.00118;
    const labels = [];
    for (let i = 0; i < 13; i++) {
      labels.push(moment().add(i, 'months'));
    }
    const data = labels.reduce((acc, curr, index) => {
      if (acc[index - 1]) {
        acc.push(acc[index - 1] + this.avg_tfuel_per_day * curr.daysInMonth());
      } else {
        acc.push(this.avg_tfuel_per_day * curr.daysInMonth());
      }
      return acc;
    }, []);
    const datasets = [];
    datasets.push({
      label: 'Tfuel Forecast',
      backgroundColor: 'rgba(255,165,0,0.16)',
      borderColor: 'rgba(255,165,0,0.16)',
      data: data,
      borderDash: [10, 5],
    });

    //todo remove setter from getter
    this.avg_tfuel_per_year = data[data.length - 1];

    return {
      labels: labels,
      datasets: datasets,
    };
  }

  @action
  setupChart() {
    let element = document.getElementById("forecastChart");
    if (!element) return;
    element.remove(); // this is my <canvas> element
    $('#forecast-chart-container').append('<canvas id="forecastChart" height="239"></canvas>');
    element = document.getElementById('forecastChart');
    const ctx = element.getContext('2d');
    const gradientChartOptionsConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          title: (tooltipItem) => {
            return moment(new Date(tooltipItem[0].label)).format('LL');
          },
          label: function (tooltipItem, data) {
            const label = [];
            label.push(`Tfuel Forecast: ${Math.round(data.datasets[0].data[tooltipItem.index], 0)}`);
            return label;
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
          stacked: true,
          type: 'linear',
          position: 'left',
          ticks: {
            min: 0,
            beginAtZero: true,
          },
        }],
        xAxes: [
          {
            stacked: true,
            type: 'time',
            time: {
              unit: 'month'
            },
            ticks: {
              min: 0,
              fontColor: '#ccc',
              beginAtZero: true,
              maxTicksLimit: 10,
            },
          },
        ],
      },
      plugins: {
        datalabels: {
          display: () => {
            return null;
          }, // This is a hack so it doesn't display any label
        }
      },
    };
    const data = this.chartData;
    this.forecast_chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: gradientChartOptionsConfiguration,
    });
  }

  @action
  updateData() {
    this.forecast_chart.data = this.chartData;
    this.forecast_chart.update();
  }
}
