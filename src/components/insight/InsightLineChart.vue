<template>
  <div class="w-full h-full flex flex-col box-border overflow-hidden">
    <div class="flex justify-between items-center mb-4 pb-3 flex-shrink">
      <h3 class="title03">자산 비교</h3>
      <div class="flex gap-3 items-center">
        <div class="flex items-center">
          <div class="w-4 h-4 rounded-full bg-gray-primary mr-2"></div>
          <span class="text-callout">현재 자산</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 rounded-full bg-secondary mr-2"></div>
          <span class="text-callout">예상 자산</span>
        </div>
      </div>
    </div>
    <div class="flex-1 w-full relative">
      <div class="w-full h-full relative">
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

    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
  });

  const assetData = props.regretInsightData.map(item => item.asset || 0);
  const lostAssetData = props.regretInsightData.map(
    item => item.lostAsset || 0
  );

  // Y축 범위 계산
  // const assetMin = Math.min(...assetData);
  // const assetMax = Math.max(...assetData);
  // const lossMin = Math.min(...lostAssetData);
  // const lossMax = Math.max(...lostAssetData);

  const allData = [...assetData, ...lostAssetData];
  const min = Math.min(...allData);
  const max = Math.max(...allData);

  // 기존 차트 제거
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: labels,
      // 차트 데이터셋 부분
      datasets: [
        {
          label: '현재 자산',
          data: assetData,
          borderColor: '#60584C',
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
          pointBackgroundColor: '#60584C',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#60584C',
          pointHoverBorderColor: '#FFFFFF',
          pointHoverBorderWidth: 3,
          yAxisID: 'y',
        },
        {
          label: '예상 자산',
          data: lostAssetData,
          borderColor: '#FFBC00',
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
          pointBackgroundColor: '#FFBC00',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#FFBC00',
          pointHoverBorderColor: '#FFFFFF',
          pointHoverBorderWidth: 3,
          yAxisID: 'y',
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
          cornerRadius: 12,
          displayColors: false,
          titleFont: {
            size: 16,
            weight: 'bold',
          },
          bodyFont: {
            size: 14,
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
                return `현재 자산: ${new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW',
                  maximumFractionDigits: 0,
                }).format(context.parsed.y)}`;
              } else {
                return `예상 자산: ${new Intl.NumberFormat('ko-KR', {
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
              size: 16,
              weight: '500',
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
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          type: 'linear',
          display: true,
          title: {
            display: false,
          },
          beginAtZero: false,
          suggestedMin: min * 0.98,
          suggestedMax: max * 1.02,
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
              size: 12,
              weight: '400',
            },
            maxTicksLimit: 5,
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
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
