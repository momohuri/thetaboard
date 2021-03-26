import Component from '@glimmer/component';
import {action} from '@ember/object';

export default class HoldingPieComponent extends Component {
  @action
  setupChart() {
    const element = document.getElementById("pieChartExample");
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    const types = [
      {
        'label': 'guardian',
        "value": this.args.walletInfo.wallets.filter((x) => x.type === 'guardian').reduce((a, b) => a.value + b.value, {'value': 0}),
        'color': '#24bac5'
      },
      {
        'label': 'theta',
        "value": this.args.walletInfo.wallets.filter((x) => x.type === 'wallet' && x.currency === 'theta')
          .reduce((a, b) => a.value + b.value, {'value': 0}),
        'color': '#21edba'
      },
      {
        'label': 'tfuel',
        "value": this.args.walletInfo.wallets.filter((x) => x.type === 'wallet' && x.currency === 'tfuel')
          .reduce((a, b) => a.value + b.value, {'value': 0}),
        'color': '#FFA500'
      }
    ];
    this.args.walletInfo.wallets.map((x) => x.value)
    let data = {
      datasets: [{
        data: types.map((x) => x.value),
        backgroundColor: types.map((x) => x.color),
        hoverOffset: 4
      }],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: types.map((x) => x.label)
    };
    const ctx = element.getContext("2d");
    // const data = this.chartData
    const myPieChart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        tooltips: {
          mode: 'label',
          callbacks: {
            label: function (tooltipItem, data) {
              const indice = tooltipItem.index;

              return data.labels[indice] + ': ' + formatter.format(data.datasets[0].data[indice]) + '';
            }
          }
        },
        plugins: {
          datalabels: {
            color: 'black',
            display: function (context) {
              const total = context.dataset.data.reduce((a,b)=> a+b,0);
              const curr_value = context.dataset.data[context.dataIndex];
              return ((100 * curr_value ) / total) > 1;
            },
            font: {
              weight: 'bold'
            },
            formatter: function (value, context) {
              const total = context.dataset.data.reduce((a,b)=> a+b,0);
              return ((100 * value) / total).toFixed(2) + '%';
            },
          }
        },
      }
    });
  }
}
