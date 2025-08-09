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
import { ref, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale);

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

const chartData = ref(null);

const chartOptions = {
  responsive: true,
  plugins: {
    // ✅ 막대 위 숫자 표시
    datalabels: {
      anchor: 'end',
      align: 'top',
      formatter: value => `${value.toLocaleString()}`,
      color: '#333',
      font: {
        weight: 'bold',
        size: 12,
      },
    },
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: '환율 변화 (과거 vs 현재)',
    },
    tooltip: {
      callbacks: {
        label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: '환율',
      },
    },
    x: {
      title: {
        display: true,
        text: '구분',
      },
    },
  },
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
