<script setup>
import { ref, computed } from 'vue';

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
  if (assetData.value.length === 0) return null;
  return new Date(assetData.value.at(-1).date);
});

const asset = computed(() => {
  if (assetData.value.length === 0) return 0;
  return parseInt(assetData.value.at(-1).asset);
});

// 필터칩 기준 과거 자산
const pastAsset = computed(() => {
  if (!today.value) return asset.value;

  const offsetDays = periodMap[selectedPeriodKey.value];
  const pastDate = new Date(today.value);
  pastDate.setDate(today.value.getDate() - offsetDays);
  const pastDateStr = pastDate.toISOString().slice(0, 10);
  const foundEntry = assetData.value.findLast(
    entry => entry.date <= pastDateStr
  );
  return foundEntry ? parseInt(foundEntry.asset) : asset.value;
});

const upColor = '#F23F3F';
const downColor = '#287EFF';
const neutralColor = '#60584C';

// 자산 추이 워딩
const assetDiff = computed(() => {
  const diff = asset.value - pastAsset.value;
  const periodText = {
    '1M': '지난달',
    '3M': '3개월 전',
    '6M': '6개월 전',
    '1Y': '1년 전',
  }[selectedPeriodKey.value];
  if (diff === 0) {
    return {
      value: 0,
      prefix: periodText,
      change: null,
      suffix: '과 동일해요',
      color: 'text-fg-primary',
    };
  }
  const formatted = Math.abs(diff).toLocaleString();
  const isPositive = diff > 0;

  return {
    value: diff,
    prefix: periodText,
    change: `${isPositive ? '+' : '-'}${formatted}원`,
    suffix: isPositive ? '증가했어요' : '감소했어요',
    color: isPositive ? 'text-status-red' : 'text-status-blue',
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
  Tooltip,
} from 'chart.js';

Chart.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip
);

const visibleChartData = computed(() => {
  if (!today.value) return [];

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
    const day = d.getDay();
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    const weekKey = weekStart.toISOString().slice(0, 10);
    (weekMap[weekKey] ||= []).push(parseInt(asset));
  });

  const weeks = Object.keys(weekMap);
  if (weeks.length <= 2) {
    return weeks.map(week => ({
      date: week,
      asset: Math.round(
        weekMap[week].reduce((sum, v) => sum + v, 0) / weekMap[week].length
      ),
    }));
  }

  const validWeeks = weeks.slice(1, -1);
  return validWeeks.map(week => ({
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
    (monthlyMap[monthKey] ||= []).push(parseInt(asset));
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

    const len = Math.min(i + 1, windowSize);

    if (i >= windowSize) {
      sum -= data[i - windowSize];
    }
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

  if (!Array.isArray(grouped) || grouped.length === 0) {
    return { labels: [], datasets: [{ data: [] }] };
  }

  const rawAssets = grouped.map(entry => parseInt(entry.asset));
  const smoothedAssets =
    selectedPeriodKey.value === '1M' ? movingAverage(rawAssets) : rawAssets;

  const diff = assetDiff.value.value;
  const mainColor = diff > 0 ? upColor : diff < 0 ? downColor : neutralColor;

  return {
    labels: grouped.map(entry => entry.date),
    datasets: [
      {
        data: smoothedAssets,
        borderColor: mainColor,
        tension: 0.3,
        fill: true,
        backgroundColor: context => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          const gradientFill = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradientFill.addColorStop(0, hexToRgba(mainColor, 0.2));
          gradientFill.addColorStop(1, hexToRgba(mainColor, 0));
          return gradientFill;
        },
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    ],
  };
});

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
      callbacks: {
        title: tooltipItems => {
          const date = tooltipItems[0].label;
          if (!date) return '';
          const dateOnly = date.split(' ')[0];
          const [year, month, day] = dateOnly.split('-');
          return `${year.slice(2)}년 ${month}월 ${day ? day + '일' : ''}`;
        },
        label: context => {
          // 자산 값에 '원' 추가
          const value = context.parsed.y.toLocaleString();
          return `자산: ${value}원`;
        },
      },
    },
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
  <div>
    <h2 class="title03 mb-4">
      나의 순자산
      <span
        class="inline-block relative group ml-1 tooltip"
        data-tip="전체 자산"
      >
        <Tooltiip class="w-5 h-5 text-fg-secondary" />
      </span>
    </h2>
    <span v-if="assetDiff.value === 0" class="text-body02">
      {{ assetDiff.prefix }}과 동일해요
    </span>

    <span v-else class="text-body02">
      {{ assetDiff.prefix }}보다
      <span :class="assetDiff.color">{{ assetDiff.change }}</span>
      {{ assetDiff.suffix }}
    </span>
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
  </div>
</template>
