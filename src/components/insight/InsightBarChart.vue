<template>
  <div class="w-full flex flex-col box-border overflow-hidden">
    <div class="flex justify-between items-center mb-4 pb-3 shrink-0">
      <h3 class="title03 text-fg-primary">{{ chartTitle }}</h3>
      <div class="flex items-center gap-3">
        <div class="flex items-center">
          <div class="w-4 h-4 rounded-full bg-gray-primary mr-2"></div>
          <span class="text-callout">과거 환율</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 rounded-full bg-secondary mr-2"></div>
          <span class="text-callout">현재 환율</span>
        </div>
      </div>
    </div>
    <div class="w-full min-h-0 relative flex-1">
      <div class="w-full h-full relative box-border">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  forexInfo: {
    type: Array,
    default: () => [],
  },
  selectedCurrency: {
    type: String,
    default: '',
  },
});

const chartCanvas = ref(null);
let chartInstance = null;

const chartTitle = computed(() => {
  const selected = props.forexInfo?.find(
    item => item.curUnit === props.selectedCurrency
  );
  return selected ? `${selected.curUnit} 환율정보` : '환율정보';
});

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);

  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
}

// 차트 생성
const createChart = () => {
  if (!chartCanvas.value) return;

  const selected = props.forexInfo?.find(
    item => item.curUnit === props.selectedCurrency
  );

  if (!selected) return;

  const ctx = chartCanvas.value.getContext('2d');

  const pastDateLabel = formatDate(selected.recDate);
  const currentDateLabel = formatDate(selected.anlzDate);

  // 레이블을 "환율 타입 : 날짜" 형식으로 변경
  const pastLabel = `${pastDateLabel}`;
  const currentLabel = `${currentDateLabel}`;

  const minY = Math.min(selected.pastRate, selected.currentRate);
  const maxY = Math.max(selected.pastRate, selected.currentRate);
  const range = maxY - minY;
  const padding = range > 0 ? range * 0.15 : maxY * 0.001;

  // 기존 차트 제거
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels: [pastLabel, currentLabel], // 수정된 레이블 사용
      datasets: [
        {
          label: '환율',
          data: [selected.pastRate, selected.currentRate],
          backgroundColor: [
            '#60584C', // 과거 환율
            '#FFBC00', // 현재 환율
          ],
          borderWidth: 0,
          borderRadius: 12,
          borderSkipped: false,
          barThickness: 100,
          maxBarThickness: 100,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
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
              const isCurrentRate = context[0].dataIndex === 1;
              return isCurrentRate ? '현재 환율' : '과거 환율';
            },
            label: function (context) {
              return `${context.parsed.y.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })} 원`;
            },
            afterLabel: function (context) {
              const isCurrentRate = context.dataIndex === 1;
              const date = isCurrentRate ? selected.anlzDate : selected.recDate;
              return `${formatDate(date)} 기준`;
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
          display: true,
          title: {
            display: false,
          },
          min: minY - padding,
          max: maxY + padding,
          ticks: {
            callback: function (value) {
              return value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
            },
            color: '#6B7280',
            font: {
              size: 12,
              weight: '400',
            },
            maxTicksLimit: 5,
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
      },
      layout: {
        padding: 0,
      },
    },
  });
};

// 데이터 변경 감지
watch(
  () => [props.forexInfo, props.selectedCurrency],
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
.chart-content canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
