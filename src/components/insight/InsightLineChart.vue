<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  regretInsightData: {
    type: Array,
    required: true,
    default: () => []
  }
});

const chartCanvas = ref(null);
let chartInstance = null;

// 차트 생성
const createChart = () => {
  if (!chartCanvas.value || !props.regretInsightData?.length) return;

  const ctx = chartCanvas.value.getContext('2d');
  
  // 데이터 정제
  const labels = props.regretInsightData.map(item => {
    if (!item.date) return '';
    const date = new Date(item.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const assetData = props.regretInsightData.map(item => item.asset || 0);
  const lostAssetData = props.regretInsightData.map(item => item.lostAsset || 0);

  // 기존 차트 제거
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '자산 변동',
          data: assetData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          pointBackgroundColor: 'rgb(75, 192, 192)',
          pointBorderColor: 'rgb(75, 192, 192)',
          pointRadius: 4,
          pointHoverRadius: 6,
          yAxisID: 'y'
        },
        {
          label: '손실률',
          data: lostAssetData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: 'rgb(255, 99, 132)',
          pointRadius: 4,
          pointHoverRadius: 6,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: '자산 변동 및 손실률 추이',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 20
        },
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.datasetIndex === 0) {
                // 자산 변동 - 통화 포맷
                label += new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW'
                }).format(context.parsed.y);
              } else {
                // 손실률 - 퍼센트 포맷
                label += context.parsed.y.toFixed(2) + '%';
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: '날짜',
            font: {
              size: 12,
              weight: 'bold'
            }
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: '자산 (원)',
            font: {
              size: 12,
              weight: 'bold'
            },
            color: 'rgb(75, 192, 192)'
          },
          ticks: {
            callback: function(value) {
              return new Intl.NumberFormat('ko-KR', {
                notation: 'compact',
                compactDisplay: 'short'
              }).format(value) + '원';
            },
            color: 'rgb(75, 192, 192)'
          },
          grid: {
            color: 'rgba(75, 192, 192, 0.1)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: '손실률 (%)',
            font: {
              size: 12,
              weight: 'bold'
            },
            color: 'rgb(255, 99, 132)'
          },
          ticks: {
            callback: function(value) {
              return value.toFixed(1) + '%';
            },
            color: 'rgb(255, 99, 132)'
          },
          grid: {
            drawOnChartArea: false,
            color: 'rgba(255, 99, 132, 0.1)'
          }
        }
      }
    }
  });
};

// 데이터 변경 감지
watch(() => props.regretInsightData, () => {
  createChart();
}, { deep: true });

onMounted(() => {
  createChart();
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 450px;
}
</style>