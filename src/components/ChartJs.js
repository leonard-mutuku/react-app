import React from 'react';
import {Bar, Doughnut, Line} from 'react-chartjs-2';
import ChartLegend from './ChartLegend';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const barGradient = (canvas, colors) => {
    const ctx = canvas.getContext("2d");
    let gradient_bg = ctx.createLinearGradient(0, 0, 0, 600);
    gradient_bg.addColorStop(0, colors[0]);
    gradient_bg.addColorStop(1, colors[1]);
    return gradient_bg;
}
const generateBarDataset = (chartData) => {
    let datasets = chartData.values.map((data, idx) => {
        return {
            label: chartData.labels[idx],
            data: data,
            backgroundColor: function(context) {
                return barGradient(context.chart.canvas, chartData.colors[idx]);
            },
            borderRadius: 5
        };
    });
    return datasets;
}

const formatTooltip = (chart) => {
    return {
       usePointStyle: true,
       callbacks: {
           labelColor: function(context) {
               let color = chart === 'doughnut' ? context.dataset.backgroundColor[context.dataIndex] : context.dataset.backgroundColor;
               return {
                   backgroundColor: color,
                   borderColor: color,
               };
           },
           labelPointStyle: function(context) {
               return {
                   pointStyle: 'circle'
               };
           }
       },
       boxPadding: 3,
    }
}

const formatYsScale = () => {
    return {
      y: {
          ticks: {
              callback: function(value, index, values) {
                  let ranges = [{divider: 1e6, suffix: 'M'}, {divider: 1e3, suffix: 'k'}];
                  function formatNumber(n) {
                      if ((n - Math.floor(n)) !== 0) {
                          return parseFloat(n).toFixed(1);
                      } else {
                          for (var i = 0; i < ranges.length; i++) {
                              if (n >= ranges[i].divider) {
                                  return (n / ranges[i].divider).toString() + ranges[i].suffix;
                              }
                          }
                      }
                      return n;
                  }
                  return formatNumber(value);
              }
          }
      }
  };
}

const beforeDrawPlugin = {
    beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
            let ctx = chart.ctx;
            const innerRadius = chart._metasets[0].controller.innerRadius;

            const centerConfig = chart.config.options.elements.center;
            const fontStyle = centerConfig.fontStyle || "myFont, sans-serif";

            const value = centerConfig.value;
            const sidePadding = centerConfig.sidePadding || 20;
            const sidePaddingCalculated = (sidePadding / 100) * (innerRadius * 2);
            ctx.font = "30px " + fontStyle;

            const stringWidth = ctx.measureText(value).width;
            const elementWidth = (innerRadius * 2) - sidePaddingCalculated;

            const widthRatio = elementWidth / stringWidth;
            const newFontSize = Math.floor(30 * widthRatio);
            const elementHeight = (innerRadius * 1.3);
            let fontSizeToUse = Math.min(newFontSize, elementHeight);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
            let centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
            ctx.font = fontSizeToUse + "px " + fontStyle;
            ctx.fillStyle = centerConfig.color || '#000';
            ctx.fillText(value, centerX, centerY);

            const txt = centerConfig.text;
            const stringWidth1 = ctx.measureText(txt).width;
            const elementWidth1 = (innerRadius * 1.5) - sidePaddingCalculated;

            const widthRatio1 = elementWidth1 / stringWidth1;
            const newFontSize1 = Math.floor(30 * widthRatio1);
            const elementHeight1 = (innerRadius * 0.2);
            fontSizeToUse = Math.min(newFontSize1, elementHeight1);

            centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 1.55);
            ctx.font = fontSizeToUse + "px " + fontStyle;
            ctx.fillStyle = '#333';
            ctx.fillText(txt, centerX, centerY);
        }
    }
};
const afterDatasetDrawPlugin = {
    afterDatasetsDraw: function (chartInstance) {
        let ctx = chartInstance.ctx;
        ctx.font = "bold 'myFont', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'center';

        const meta = chartInstance.getDatasetMeta(0);
        chartInstance.data.datasets.forEach(function (dataset) {

            for (let i = 0; i < dataset.data.length; i++) {
                const model = meta.data[i],
                total = meta.total,
                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                start_angle = model.startAngle,
                end_angle = model.endAngle,
                mid_angle = start_angle + (end_angle - start_angle) / 2;

                const x = mid_radius * Math.cos(mid_angle);
                const y = mid_radius * Math.sin(mid_angle);

                ctx.fillStyle = '#fff';
                const percent = Math.round(dataset.data[i] / total * 100);
                if (percent > 4) {
                    ctx.fillText(percent + '%', model.x + x, model.y + y);
                }
            }
        });
    }
};
const shadowPlugin = {
    afterDraw: function(chartInstance) {
        const ctx = chartInstance.ctx;
        const _fill = ctx.fill;
        ctx.fill = function () {
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2;
            _fill.apply(this, arguments);
            ctx.restore();
        };
    }
}

const lineGradient = (chart) => {
    let width, height, gradient;
    const {ctx, chartArea} = chart;
    if (!chartArea) {
        return;
    }
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgb(81 169 132 / 65%)');
        gradient.addColorStop(0.5, 'rgb(72 189 212 / 75%)');
        gradient.addColorStop(1, 'rgb(236 151 31 / 85%)');
    }

    return gradient;
};

export const PieChart = ({chartData}) => {
    const data = {
        labels: chartData.labels,
        datasets: [{
            data: chartData.data.pie_data,
            backgroundColor: chartData.data.pie_clrs
        }]
    };
    const total = chartData.data.pie_data.reduce((a, b) => a = a+b, 0);

    return (
        <div className="pnl flex-sm">
            <p className="chart-title">{chartData.title}</p>
            <div className="chart-wrap">
                <Doughnut
                    data={data}
                    options={{
                        cutout: '55%',
                        elements: {
                            arc: {borderWidth: 1},
                            center: {
                                value: total.toLocaleString(),
                                text: 'Total',
                                color: '#36A2EB',
                                sidePadding: 15
                            }
                        },
                        layout: {padding: {bottom: 3}},
                        plugins: {
                            title: {display: false},
                            legend: {display: false},
                            tooltip: formatTooltip('doughnut')
                        }
                    }}
                    plugins={[beforeDrawPlugin, afterDatasetDrawPlugin, shadowPlugin]}
                />
            </div>
            <ChartLegend
                labels={chartData.labels} colors={chartData.data.pie_clrs} values={chartData.data.pie_data}
            />
        </div>
    );
}

export const BarChart = ({chartData}) => {
    const datasets = generateBarDataset(chartData.data)
    const data = {
        labels: chartData.labels,
        datasets: datasets
    };

    return (
        <div className="pnl flex-lg">
            <p className="chart-title">{chartData.title}</p>
            <div className="chart-wrap">
                <Bar
                    data={data}
                    options={{
                        scales: formatYsScale(),
                        plugins: {
                            title: {display: false},
                            legend: {display: false},
                            tooltip: formatTooltip('bar')
                        }
                    }}
                />
            </div>
            <ChartLegend
                labels={chartData.data.labels} colors={chartData.data.colors}
            />
        </div>
    );
}

export const LineChart = ({chartData}) => {
    const data = {
        labels: chartData.labels,
        datasets: [{
            backgroundColor: function(context) {
                return lineGradient(context.chart);
            },
            borderColor: function(context) {
                return lineGradient(context.chart);
            },
            data: chartData.data,
            label: 'SMS Sent',
            pointRadius: 0,
            borderWidth: 1,
            lineTension: 0.25,
            fill: true
        }]
    };
    return(
        <div className="pnl flex-lg">
            <p className="chart-title">{chartData.title}</p>
            <div className="chart-wrap">
                <Line
                    data={data}
                    options={{
                        interaction: {mode: 'nearest', intersect: false},
                        tooltips: {position: 'nearest'},
                        scales: formatYsScale(),
                        plugins: {
                            title: {display: false},
                            legend: {display: false},
                            tooltip: formatTooltip('line')
                        }
                    }}
                />
            </div>
        </div>
    );
}