<script setup>
import BaseCard from '../common/BaseCard.vue';
import { ref, computed } from 'vue';
// import jsonData from './mydata.json'; // 목업 데이터, 추후 실제 api로 수정

const props = defineProps({
  assets: {
    type: Array,
    default: () => [],
  },
});

// 날짜 필터칩
const periodMap = {
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
};
const selectedPeriodKey = ref('1M'); // 필터칩 기본: 1개월

// API 데이터 사용
const assetData = computed(() => {
  return props.assets || [];
});

const today = computed(() => {
  if (assetData.value.length === 0) return new Date();
  return new Date(assetData.value.at(-1).date);
});

const asset = computed(() => {
  if (assetData.value.length === 0) return 0;
  return parseInt(assetData.value.at(-1).asset);
});

// // 목업 데이터 사용 (기존 코드)
// import jsonData from './mydata.json'; 
// const assetData = jsonData.mydata;
// const today = new Date(assetData.at(-1).date);
// const asset = ref(assetData.at(-1).asset);

// 필터칩 기준 과거 자산
const pastAsset = computed(() => {
  const offsetDays = periodMap[selectedPeriodKey.value];
  const pastDate = new Date(today.value);
  pastDate.setDate(today.value.getDate() - offsetDays);
  const pastDateStr = pastDate.toISOString().slice(0, 10);
  return (
    assetData.value.findLast(entry => entry.date <= pastDateStr)?.asset ?? asset.value
  );
});

// 자산 추이 워딩
const assetDiff = computed(() => {
  const diff = asset.value - pastAsset.value;
  const formatted = Math.abs(diff).toLocaleString();
  return {
    value: diff,
    message: `${diff === 0 ? '동일해요' : diff > 0 ? `+${formatted}원` : `-${formatted}원`}`,
    color:
      diff === 0
        ? 'text-fg-primary'
        : diff > 0
          ? 'text-status-red'
          : 'text-status-blue',
  };
});

// 자산 차트
import { Line } from 'vue-chartjs';
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from 'chart.js';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Filler);

const visibleChartData = computed(() => {
  const range = periodMap[selectedPeriodKey.value];
  const fromDate = new Date(today.value);
  fromDate.setDate(today.value.getDate() - range);
  const fromStr = fromDate.toISOString().slice(0, 10);
  const startIdx = assetData.value.findIndex(entry => entry.date >= fromStr);
  if (startIdx === -1) return [];
  return assetData.value.slice(startIdx);
});

function groupByWeek(data) {
  const weekMap = {};
  data.forEach(({ date, asset }) => {
    const d = new Date(date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const weekKey = weekStart.toISOString().slice(0, 10);
    (weekMap[weekKey] ||= []).push(asset);
  });
  return Object.keys(weekMap).map(week => ({
    date: week,
    asset: Math.round(
      weekMap[week].reduce((sum, v) => sum + v, 0) / weekMap[week].length
    ),
  }));
}

function groupByMonth(data) {
  const monthlyMap = {};
  data.forEach(({ date, asset }) => {
    const monthKey = date.slice(0, 7);
    (monthlyMap[monthKey] ||= []).push(asset);
  });
  return Object.keys(monthlyMap).map(month => ({
    date: month,
    asset: Math.round(
      monthlyMap[month].reduce((sum, v) => sum + v, 0) /
        monthlyMap[month].length
    ),
  }));
}

function movingAverage(data, windowSize = 5) {
  const result = [];
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
    if (i >= windowSize) sum -= data[i - windowSize];
    const len = i < windowSize - 1 ? i + 1 : windowSize;
    result.push(Math.round(sum / len));
  }
  return result;
}

const chartData = computed(() => {
  let grouped;
  if (selectedPeriodKey.value === '1Y') {
    grouped = groupByMonth(visibleChartData.value);
  } else if (
    selectedPeriodKey.value === '6M' ||
    selectedPeriodKey.value === '3M'
  ) {
    grouped = groupByWeek(visibleChartData.value);
  } else {
    grouped = visibleChartData.value;
  }

  const rawAssets = grouped.map(entry => entry.asset);
  const smoothedAssets =
    selectedPeriodKey.value === '1M' ? movingAverage(rawAssets) : rawAssets;

  return {
    labels: grouped.map(entry => entry.date),
    datasets: [
      {
        data: smoothedAssets,
        borderColor: '#3b82f6',
        tension: 0.3,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
    title: { display: false },
  },
  scales: {
    x: { display: false },
    y: { display: false },
  },
  elements: {
    point: { radius: 0 },
  },
};
</script>

<template>
  <BaseCard size="lg">
    <span class="text-body02">
      {{
        {
          '1M': '지난달',
          '3M': '3개월 전',
          '6M': '6개월 전',
          '1Y': '1년 전',
        }[selectedPeriodKey]
      }}보다
    </span>
    <span class="text-body02" :class="assetDiff.color">{{
      assetDiff.message
    }}</span>
    <p class="mt-1 title02">{{ asset.toLocaleString() }}원</p>
    <div class="mt-12 w-full">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    <div class="mt-3 flex gap-2">
      <button
        v-for="(label, key) in {
          '1M': '1달',
          '3M': '3달',
          '6M': '6달',
          '1Y': '1년',
        }"
        :key="key"
        @click="selectedPeriodKey = key"
        :class="[
          'h-7 px-4 rounded-full text-footnote',
          selectedPeriodKey === key
            ? 'font-medium bg-base-200 text-fg-primary'
            : 'bg-transparent text-gray-400',
        ]"
      >
        {{ label }}
      </button>
    </div>
  </BaseCard>
</template>
