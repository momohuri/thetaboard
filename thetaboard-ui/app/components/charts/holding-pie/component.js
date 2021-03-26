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
        'color': '#21edba'
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
    function drawSegmentValues()
    {
      debugger
      for(var i=0; i<myPieChart.segments.length; i++)
      {
        ctx.fillStyle="white";
        var textSize = canvas.width/15;
        ctx.font= textSize+"px Verdana";
        // Get needed variables
        var value = myPieChart.segments[i].value/totalValue*100;
        if(Math.round(value) !== value)
          value = (myPieChart.segments[i].value/totalValue*100).toFixed(1);
        value = value + '%';

        var startAngle = myPieChart.segments[i].startAngle;
        var endAngle = myPieChart.segments[i].endAngle;
        var middleAngle = startAngle + ((endAngle - startAngle)/2);

        // Compute text location
        var posX = (radius/2) * Math.cos(middleAngle) + midX;
        var posY = (radius/2) * Math.sin(middleAngle) + midY;

        // Text offside by middle
        var w_offset = ctx.measureText(value).width/2;
        var h_offset = textSize/4;

        ctx.fillText(value, posX - w_offset, posY + h_offset);
      }
    }
    debugger
    const myPieChart = new Chart(ctx, {
      type: 'pie',
      data: data,
      onAnimationProgress: drawSegmentValues,
      options: {
        tooltips: {
          mode: 'label',
          callbacks: {
            label: function (tooltipItem, data) {
              const indice = tooltipItem.index;

              return data.labels[indice] + ': ' +  formatter.format( data.datasets[0].data[indice]) + '';
            }
          }
        },
      }
    });
  }
}
