import Component from '@glimmer/component';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';


export default class PriceChartComponent extends Component {
  @tracked time_range = 'year';

  get chartData() {
    let historic_data = {};
    if (this.time_range === 'week') {
      Object.keys(this.args.historic_price).splice(0, 7).forEach((date) => {
        historic_data[date] = this.args.historic_price[date]
      })
    } else if (this.time_range === 'month') {
      Object.keys(this.args.historic_price).splice(0, 30).forEach((date) => {
        historic_data[date] = this.args.historic_price[date]
      })
    } else {
      historic_data = this.args.historic_price;
    }
    const labels = Object.keys(historic_data).map((x) => moment(x, "YYYY-MM-DD"));
    const ctx = document.getElementById("lineChartExample").getContext("2d");
    const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
    gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors
    return {
      labels: labels,
      datasets: [{
        label: "Theta",
        pointStyle: 'point',
        yAxisID: 'theta',
        radius: 0,
        borderColor: '#21edba',
        pointBackgroundColor: '#21edba',
        data: Object.values(historic_data).map((x) => x.theta_price),
      },
        {
          label: "Tfuel",
          yAxisID: 'tfuel',
          pointStyle: 'point',
          radius: 0,
          borderColor: '#FFA500',
          pointBackgroundColor: '#FFA500',
          data: Object.values(historic_data).map((x) => x.tfuel_price),
        },]
    };
  }

  @action
  setupChart() {
    const element = document.getElementById("lineChartExample");
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    const gradientChartOptionsConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true
        }
      },
      tooltips: {
        callbacks: {
          title: (tooltipItem, data) => {
            return moment(new Date(tooltipItem[0].label)).format('LL')
          },
          label: (tooltipItem, data) => {
            if (Number(tooltipItem.yLabel) > 0.01) {
              return formatter.format(Number(tooltipItem.yLabel));
            } else {
              return `$${Number(tooltipItem.yLabel)}`
            }

          }
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
          id: "theta",
          type: 'linear',
          ticks: {
            min: 0,
            fontColor: "#21edba",
            beginAtZero: true,
            maxTicksLimit: 10,
            callback: function (value, index, values) {
              return formatter.format(Number(value.toString()));
            }
          },
        },
          {
            id: "tfuel",
            type: 'linear',
            position: 'right',
            ticks: {
              min: 0,
              fontColor: "#FFA500",
              beginAtZero: true,
              maxTicksLimit: 10,
              callback: function (value, index, values) {
                return formatter.format(Number(value.toString()));
              }
            },
          }],

        xAxes: [{
          type: 'time',
          time: {
            unit: 'month'
          },
        }],
      },
      plugins: {
        datalabels: {
          display: () => {return null;}, // This is a hack so it doesn't display any label
        }
      },
    };
    const ctx = element.getContext("2d");
    const data = this.chartData
    this.historic_data_chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: gradientChartOptionsConfiguration
    });
  }

  @action
  updateData() {
    this.historic_data_chart.data = this.chartData;
    if (this.time_range === 'week') {
      this.historic_data_chart.options.scales.xAxes[0].time.unit = 'day';
    } else if (this.time_range === 'month') {
      this.historic_data_chart.options.scales.xAxes[0].time.unit = 'week';
    } else {
      this.historic_data_chart.options.scales.xAxes[0].time.unit = 'month';
    }
    this.historic_data_chart.update();
  }

  @action
  updateTimeRange(value) {
    this.time_range = value;
    this.updateData();
  }
}
