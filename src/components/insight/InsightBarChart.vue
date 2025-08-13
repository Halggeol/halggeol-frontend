<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3 class="chart-title">{{ chartTitle }}</h3>
      <div class="legend-container">
        <div class="legend-item">
          <div class="legend-badge past-badge">과거 환율</div>
        </div>
        <div class="legend-item">
          <div class="legend-badge current-badge">현재 환율</div>
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
    (item) => item.curUnit === props.selectedCurrency
  );
  return selected ? `${selected.curUnit} 환율 변화` : '환율 변화';
});

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year : '2-digit',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\.$/, ''); // 마지막 점(.) 제거
}

// 차트 생성
const createChart = () => {
  if (!chartCanvas.value) return;

  const selected = props.forexInfo?.find(
    (item) => item.curUnit === props.selectedCurrency
  );
  
  if (!selected) return;

  const ctx = chartCanvas.value.getContext('2d');

  const pastDateLabel = formatDate(selected.recDate);
  const currentDateLabel = formatDate(selected.anlzDate);

  // 레이블을 "환율 타입 : 날짜" 형식으로 변경
  const pastLabel = `과거 : ${pastDateLabel}`;
  const currentLabel = `현재 : ${currentDateLabel}`;

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
            'rgba(242, 63, 63, 0.8)',   // #F23F3F 빨간색 (과거)
            'rgba(40, 126, 255, 0.8)'   // #287EFF 파란색 (현재)
          ],
          borderColor: [
            '#F23F3F',
            '#287EFF'
          ],
          borderWidth: 2,
          borderRadius: 12,
          borderSkipped: false,
          barThickness: 80,
          maxBarThickness: 100,
        }
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
              const isCurrentRate = context[0].dataIndex === 1;
              return isCurrentRate ? '현재 환율' : '과거 환율';
            },
            label: function (context) {
              return `${context.parsed.y.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
              })} 원`;
            },
            afterLabel: function(context) {
              const isCurrentRate = context.dataIndex === 1;
              const date = isCurrentRate ? selected.anlzDate : selected.recDate;
              return `(${formatDate(date)})`;
            }
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
                maximumFractionDigits: 2
              });
            },
            color: '#6B7280',
            font: {
              size: 11,
              weight: '600',
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
.chart-container {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.8);
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
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  flex-shrink: 0;
}

.chart-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  letter-spacing: -0.025em;
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
  color: #FFFFFF;
  letter-spacing: -0.01em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.past-badge {
  background: linear-gradient(135deg, #F23F3F, #FF6B6B);
}

.current-badge {
  background: linear-gradient(135deg, #287EFF, #5AA0FF);
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(249, 250, 251, 0.5));
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

/* 글래스모피즘 효과 */
.chart-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 24px;
  pointer-events: none;
}
</style>