<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3 class="title03">{{ chartTitle }}</h3>
      <div class="legend-container">
        <div class="legend-item">
          <div class="p-1">과거환율</div>
        </div>
        <div class="legend-item">
          <div class="legend-badge current-badge">현재환율</div>
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
import { ref, watch, computed } from 'vue';
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

// props 정의
const props = defineProps({
  forexInfo: {
    type: Array,
    required: true,
  },
  selectedCurrency: {
    type: String,
    required: true,
  },
});

const chartCanvas = ref(null);
let chartInstance = null;

const chartTitle = computed(() => {
  const selected = props.forexInfo?.find(
    item => item.curUnit === props.selectedCurrency
  );
  return selected ? `${selected.curUnit} 환율 변화` : '환율 변화';
});

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
}

// 차트 생성
const chartData = () => {
  if (!chartCanvas.value) return;

  const selected = props.forexInfo?.find(
    item => item.curUnit === props.selectedCurrency
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
            'rgba(242, 63, 63, 0.8)', // #F23F3F 빨간색 (과거)
            'rgba(40, 126, 255, 0.8)', // #287EFF 파란색 (현재)
          ],
          borderColor: ['#F23F3F', '#287EFF'],
          borderWidth: 0,
          borderRadius: 12,
          borderSkipped: false,
          barThickness: 80,
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
                maximumFractionDigits: 4,
              })} 원`;
            },
            afterLabel: function (context) {
              const isCurrentRate = context.dataIndex === 1;
              const date = isCurrentRate ? selected.anlzDate : selected.recDate;
              return `(${formatDate(date)})`;
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
          // min: minY - padding,
          min: 0,
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

// 선택된 통화가 바뀔 때마다 차트 데이터 업데이트
watch(
  () => [props.forexInfo, props.selectedCurrency],
  () => {
    const selected = props.forexInfo.find(
      item => item.curUnit === props.selectedCurrency
    );

    if (!selected) {
      chartData.value = null;
      return;
    }

    chartData.value = {
      labels: ['과거 환율', '현재 환율'],
      datasets: [
        {
          label: `${selected.curUnit} 환율`,
          backgroundColor: ['#ff6b35', '#4a90e2'],
          data: [selected.pastRate, selected.currentRate],
          barThickness: 100, // ✅ 슬림한 막대폭
          borderRadius: 5, // ✅ 둥근 막대 (선택)
        },
      ],
    };
  },
  { immediate: true }
);
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
}

.past-badge {
  background: linear-gradient(135deg, #f23f3f, #ff6b6b);
}

.current-badge {
  background: linear-gradient(135deg, #287eff, #5aa0ff);
}

.chart-wrapper {
  width: 100%;
  height: 100%;
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

canvas {
  width: 100% !important;
  height: 100% !important;
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
</style>
