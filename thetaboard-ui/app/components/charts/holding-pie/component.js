import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class HoldingPieComponent extends Component {
  @service('theta-sdk') thetaSdk;

  get setUpChart() {
    if (this.thetaSdk.wallets.length) {
      this.setupChart();
    }
  }

  async connectToWallet() {
    const address = await this.thetaSdk.connectWallet();
    this.args.onRouteChange(address);
  }

  @action
  async connectWallet(event) {
    if (event) {
      event.preventDefault();
    }
    Ember.run.debounce(this, this.connectToWallet, 500, true);
  }

  @action
  setupChart() {
    let element = document.getElementById('pieChartExample');
    if (!element) return;
    element.remove(); // this is my <canvas> element
    $('#holding-container').append('<canvas id="pieChartExample" height="266"></canvas>');
    element = document.getElementById('pieChartExample');

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const numberWithCommas = function(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const guardian = this.thetaSdk.wallets.filter((x) => x.type === 'guardian');
    let guardian_value = 0;
    let guardian_amount = 0;
    if (guardian.length > 0) {
      guardian_value = guardian.reduce((a, b) => a + b.value, 0);
      guardian_amount = guardian.reduce((a, b) => a + b.amount, 0);
    }

    let theta_value = this.thetaSdk.wallets.filter((x) => x.type === 'wallet' && x.currency === 'theta').reduce((a, b) => a + b.value, 0);
    let theta_amount = this.thetaSdk.wallets.filter((x) => x.type === 'wallet' && x.currency === 'theta').reduce((a, b) => a + b.amount, 0);
    let tfuel_value = this.thetaSdk.wallets.filter((x) => x.type === 'wallet' && x.currency === 'tfuel').reduce((a, b) => a + b.value, 0);
    let tfuel_amount = this.thetaSdk.wallets.filter((x) => x.type === 'wallet' && x.currency === 'tfuel').reduce((a, b) => a + b.amount, 0);

    const types = [
      {
        label: `Guardian (${numberWithCommas(guardian_amount.toFixed(2))})`,
        value: guardian_value,
        color: '#24bac5',
      },
      {
        label: `Theta (${numberWithCommas(theta_amount.toFixed(2))})`,
        value: theta_value,
        color: '#2BB7E5',
      },
      {
        label: `Tfuel (${numberWithCommas(tfuel_amount.toFixed(2))})`,
        value: tfuel_value,
        color: '#FFA500',
      },
    ];
    this.thetaSdk.wallets.map((x) => x.value);
    let data = {
      datasets: [
        {
          data: types.map((x) => x.value),
          backgroundColor: types.map((x) => x.color),
          hoverOffset: 4,
          borderWidth: 1,
          borderColor: '#ddd',
        },
      ],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: types.map((x) => x.label),
    };
    const ctx = element.getContext('2d');
    // const data = this.chartData
    const myPieChart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: '#ccc',
            usePointStyle: true,
            padding: 20,
          },
        },
        maintainAspectRatio: false,
        tooltips: {
          mode: 'label',
          callbacks: {
            label: function (tooltipItem, data) {
              const indice = tooltipItem.index;
              return (
                data.labels[indice] +
                ': ' +
                formatter.format(data.datasets[0].data[indice]) +
                ''
              );
            },
          },
        },
        plugins: {
          datalabels: {
            color: 'black',
            display: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const curr_value = context.dataset.data[context.dataIndex];
              return (100 * curr_value) / total > 1;
            },
            font: {
              weight: 'bold',
            },
            formatter: function (value, context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              return `
                  ${formatter.format(value)}
                   ${((100 * value) / total).toFixed(2)}%
              `
            },
          },
        },
      },
    });
  }
}
