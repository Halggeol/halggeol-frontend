<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3 class="title03">자산 변동 및 손실금액 추이</h3>
      <div class="legend-container">
        <div class="legend-item">
          <div class="p-1">자산 변동</div>
        </div>
        <div class="legend-item">
          <div class="legend-badge loss-badge">손실 금액</div>
        </div>
      </div>
    </div>
    <div class="chart-wrapper">
      <div class="chart-content">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
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
  Filler,
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
    default: () => [],
  },
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
  const lostAssetData = props.regretInsightData.map(
    item => item.lostAsset || 0
  );

  // Y축 범위 계산
  const assetMin = Math.min(...assetData);
  const assetMax = Math.max(...assetData);
  const lossMin = Math.min(...lostAssetData);
  const lossMax = Math.max(...lostAssetData);

  // 기존 차트 제거
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: labels,
      // 차트 데이터셋 부분 (자산변동: 파란색, 손실금액: 빨간색)
      datasets: [
        {
          label: '자산 변동',
          data: assetData,
          borderColor: '#287EFF',
          backgroundColor: 'rgba(40, 126, 255, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0,
          pointRadius: function (context) {
            const dataLength = context.dataset.data.length;
            if (dataLength > 20) return 0;
            if (dataLength > 10) return 3;
            return 6;
          },
          pointHoverRadius: function (context) {
            const dataLength = context.dataset.data.length;
            if (dataLength > 20) return 4;
            if (dataLength > 10) return 6;
            return 8;
          },
          pointBackgroundColor: '#287EFF',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#287EFF',
          pointHoverBorderColor: '#FFFFFF',
          pointHoverBorderWidth: 3,
          yAxisID: 'y',
        },
        {
          label: '손실 금액',
          data: lostAssetData,
          borderColor: '#F23F3F',
          backgroundColor: 'rgba(242, 63, 63, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0,
          pointRadius: function (context) {
            const dataLength = context.dataset.data.length;
            if (dataLength > 20) return 0;
            if (dataLength > 10) return 3;
            return 6;
          },
          pointHoverRadius: function (context) {
            const dataLength = context.dataset.data.length;
            if (dataLength > 20) return 4;
            if (dataLength > 10) return 6;
            return 8;
          },
          pointBackgroundColor: '#F23F3F',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#F23F3F',
          pointHoverBorderColor: '#FFFFFF',
          pointHoverBorderWidth: 3,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#FFFFFF',
          bodyColor: '#FFFFFF',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 12,
          displayColors: false,
          titleFont: {
            size: 14,
            weight: 'bold',
          },
          bodyFont: {
            size: 13,
          },
          padding: 16,
          caretSize: 8,
          caretPadding: 8,
          callbacks: {
            title: function (context) {
              return `${context[0].label}`;
            },
            label: function (context) {
              if (context.datasetIndex === 0) {
                return `자산: ${new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW',
                  maximumFractionDigits: 0,
                }).format(context.parsed.y)}`;
              } else {
                return `손실 금액: ${new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW',
                  maximumFractionDigits: 0,
                }).format(context.parsed.y)}`;
              }
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: false,
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 12,
              weight: '600',
            },
            maxTicksLimit: (function () {
              const dataLength = labels.length;
              if (dataLength > 30) return 6;
              if (dataLength > 20) return 8;
              if (dataLength > 10) return 10;
              return dataLength;
            })(),
            maxRotation: 0,
            minRotation: 0,
          },
          grid: {
            display: true,
            color: 'rgba(156, 163, 175, 0.15)',
            lineWidth: 1,
            drawBorder: false,
            tickLength: 0,
          },
          border: {
            display: false,
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: false,
          },
          beginAtZero: false,
          suggestedMin: assetMin * 0.98,
          suggestedMax: assetMax * 1.02,
          ticks: {
            callback: function (value) {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + 'M';
              } else if (value >= 1000) {
                return (value / 1000).toFixed(0) + 'K';
              }
              return value.toLocaleString();
            },
            color: '#6B7280',
            font: {
              size: 11,
              weight: '600',
            },
            maxTicksLimit: 4,
          },
          grid: {
            color: 'rgba(156, 163, 175, 0.15)',
            lineWidth: 1,
            drawBorder: false,
            tickLength: 0,
          },
          border: {
            display: false,
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: false,
          },
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: lossMax * 1.05,
          ticks: {
            callback: function (value) {
              if (value >= 100000000) {
                return (value / 100000000).toFixed(1) + '억';
              } else if (value >= 10000) {
                return (value / 10000).toFixed(0) + '만';
              }
              return value.toLocaleString();
            },
            color: '#6B7280',
            font: {
              size: 10,
              weight: '500',
            },
            maxTicksLimit: 4,
          },
          grid: {
            drawOnChartArea: false,
            color: 'rgba(156, 163, 175, 0.15)',
            lineWidth: 1,
            drawBorder: false,
            tickLength: 0,
          },
          border: {
            display: false,
          },
        },
      },
      layout: {
        padding: 0,
      },
      elements: {
        point: {
          hoverBorderWidth: 3,
        },
      },
    },
  });
};

// 데이터 변경 감지
watch(
  () => props.regretInsightData,
  () => {
    createChart();
  },
  { deep: true }
);
watch(
  () => props.regretInsightData,
  () => {
    createChart();
  },
  { deep: true }
);

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
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  flex-shrink: 0;
}

.legend-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.01em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.asset-badge {
  background: linear-gradient(135deg, #287eff, #1e6fff);
}

.loss-badge {
  background: linear-gradient(135deg, #f23f3f, #e53e3e);
}

.chart-wrapper {
  flex: 1;
  width: 100%;
  min-height: 0;
  position: relative;
}

.chart-content {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(249, 250, 251, 0.5)
  );
  border-radius: 12px;
  padding: 16px 12px 12px 12px;
  box-sizing: border-box;
}

.chart-content canvas {
  width: 100% !important;
  height: 100% !important;
  max-width: 100%;
  max-height: 100%;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .chart-container {
    padding: 16px;
    border-radius: 20px;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  .legend-container {
    align-self: flex-end;
    gap: 8px;
  }

  .chart-title {
    font-size: 16px;
  }

  .legend-badge {
    font-size: 11px;
    padding: 3px 10px;
  }

  .chart-content {
    padding: 12px 8px 8px 8px;
  }
}

@media (max-width: 480px) {
  .chart-container {
    padding: 12px;
    border-radius: 16px;
  }

  .legend-container {
    flex-direction: column;
    gap: 6px;
    align-items: stretch;
  }

  .legend-badge {
    text-align: center;
    font-size: 10px;
    padding: 2px 8px;
  }

  .chart-title {
    font-size: 14px;
  }

  .chart-content {
    padding: 8px 4px 4px 4px;
  }
}

/* 애니메이션 효과 */
.chart-container {
  transition: all 0.3s ease;
}

.chart-container:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
}

.legend-badge {
  transition: all 0.2s ease;
  cursor: pointer;
}

.legend-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
